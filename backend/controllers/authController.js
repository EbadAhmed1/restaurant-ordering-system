const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User'); 


// Load secret key from .env file and ensure it is present.
const JWT_SECRET = process.env.JWT_SECRET; 
if (!JWT_SECRET) {
    // Application should fail to start if the secret is missing
    throw new Error('JWT_SECRET not defined in environment variables'); 
}
// --------------------------------

// @desc Register a new user
// @route POST /api/auth/register
exports.register = async (req, res, next) => { // Added 'next'
    const { username, email, password, role } = req.body;
    try {
        let user = await User.findByEmail(email);
        if (user) {
            // Set 400 status before passing to error handler
            res.status(400); 
            return next(new Error('User already exists'));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'customer', // Default role
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: user.toResponseObject() });
    } catch (error) {
        // Use central error handling
        next(error); 
    }
};

// @desc Authenticate a user and return token
// @route POST /api/auth/login
exports.login = async (req, res, next) => { // Added 'next'
    const { email, password } = req.body;
    try {
        // Assuming findByEmail retrieves the password hash for comparison
        const user = await User.findByEmail(email);
        if (!user) {
            res.status(400);
            return next(new Error('Invalid Credentials'));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400);
            return next(new Error('Invalid Credentials'));
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: user.toResponseObject() });
    } catch (error) {
        // Use central error handling
        next(error); 
    }
};