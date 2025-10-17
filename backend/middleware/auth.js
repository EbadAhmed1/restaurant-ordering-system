const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Required to verify user role
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

/**
 * Middleware to protect routes: validates JWT token and attaches user to req.user.
 */
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check for token in headers (Bearer token format)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (removes 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // 3. Find user and attach to request object (excluding password)
            // We only attach the ID and role from the token payload for simplicity here,
            // but a full app would fetch the User object.
            req.user = decoded; 
            
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

/**
 * Middleware to restrict access to Admin users only.
 */
exports.adminOnly = (req, res, next) => {
    // Requires the 'protect' middleware to run first (req.user must exist)
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Not authorized as admin' });
    }
};
