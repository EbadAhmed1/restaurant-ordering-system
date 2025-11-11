const User = require('../models/User');

// @desc Get user profile details
// @route GET /api/users/profile
// @access Private (Requires Auth)
exports.getProfile = async (req, res, next) => { // Added 'next'
    try {
        // req.user.id is populated by authentication middleware
        // Assuming findById is correctly implemented in User model to exclude password
        const user = await User.findById(req.user.id); 
        if (!user) {
            res.status(404);
            return next(new Error('User not found'));
        }
        res.json(user.toResponseObject());
    } catch (error) {
        // Use central error handling
        next(error);
    }
};

// @desc Update user profile details
// @route PUT /api/users/profile
// @access Private (Requires Auth)
exports.updateProfile = async (req, res, next) => { // Added 'next'
    const { username, email } = req.body;
    try {
        // Assuming User.update handles finding the user and applying updates
        const updatedUser = await User.update(req.user.id, { username, email });
        res.json({ message: 'Profile updated successfully', user: updatedUser.toResponseObject() });
    } catch (error) {
        // Use central error handling
        next(error);
    }
};