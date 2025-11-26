const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; 

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return next(new Error('User associated with token not found.'));
            }

            req.user = user; 
            next();

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                 return res.status(401).json({ message: 'Token expired. Please log in again.' });
            }
            if (error.name === 'JsonWebTokenError') {
                 return res.status(401).json({ message: 'Invalid token format or signature.' });
            }
            next(error); 
        }
    }

    if (!token) {
        res.status(401);
        next(new Error('Access denied. No token provided.'));
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        next(new Error('Access denied. Admin privileges required.'));
    }
};