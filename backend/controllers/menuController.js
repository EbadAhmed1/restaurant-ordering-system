const Menu = require('../models/Menu');

// @desc Get all active menu items
// @route GET /api/menu
exports.getMenu = async (req, res, next) => {
    try {
        const menuItems = await Menu.findAll({
            where: { isAvailable: true }
        });
        res.json(menuItems);
    } catch (error) {
        next(error); // Use centralized error handling
    }
};