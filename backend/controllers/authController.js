const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Assumes a User model exists in '../models/User.js'
const User = require('../models/User'); 

// Secret key should be loaded from .env file for production security
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; 

// @desc Register a new user
// @route POST /api/auth/register
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        let user = await User.findByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
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
        res.status(201).json({ token, user: user.toResponseObject() }); // toResponseObject removes password
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc Authenticate a user and return token
// @route POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: user.toResponseObject() });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};