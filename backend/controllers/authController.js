const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const JWT_SECRET = process.env.JWT_SECRET; 
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not defined in environment variables'); 
}

exports.register = async (req, res, next) => { 
    const { username, email, password, role } = req.body;
    try {
        let user = await User.findOne({ where: { email } });
        
        if (user) {
            res.status(400); 
            return next(new Error('User already exists'));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'customer',
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: user.toResponseObject() });
    } catch (error) {
        next(error); 
    }
};

exports.login = async (req, res, next) => { 
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        
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
        next(error); 
    }
};