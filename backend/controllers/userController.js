const User = require('../models/User');

// @desc Get user profile details
// @route GET /api/users/profile
// @access Private (Requires Auth)
exports.getProfile = async (req, res) => {
    try {
        // req.user.id is populated by authentication middleware
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.toResponseObject());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// @desc Update user profile details
// @route PUT /api/users/profile
// @access Private (Requires Auth)
exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    try {
        const updatedUser = await User.update(req.user.id, { username, email });
        res.json({ message: 'Profile updated successfully', user: updatedUser.toResponseObject() });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
};