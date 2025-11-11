const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Used to fetch full user data if needed

// Secret key should be loaded from .env
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; 

/**
 * Middleware to check for a valid JWT and attach user data to the request.
 * Required for all protected routes.
 */
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token (Token is typically 'Bearer TOKEN_STRING')
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Find the user by ID from the payload (excluding the password)
            // Assuming your User model has a static findById method
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return next(new Error('User associated with token not found.'));
            }

            // Attach user object to the request for controller access
            req.user = user; 
            
            next();

        } catch (error) {
            // Handle expired, invalid, or tampered token errors
            if (error.name === 'TokenExpiredError') {
                 return res.status(401).json({ message: 'Token expired. Please log in again.' });
            }
            if (error.name === 'JsonWebTokenError') {
                 return res.status(401).json({ message: 'Invalid token format or signature.' });
            }
            // Pass any other errors to the central error handler
            next(error); 
        }
    }

    if (!token) {
        // No token provided at all
        res.status(401);
        next(new Error('Access denied. No token provided.'));
    }
};

/**
 * Middleware to restrict access only to users with the 'admin' role.
 * Must be used AFTER the 'protect' middleware.
 */
exports.adminOnly = (req, res, next) => {
    // req.user is set by the 'protect' middleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        next(new Error('Access denied. Admin privileges required.'));
    }
};