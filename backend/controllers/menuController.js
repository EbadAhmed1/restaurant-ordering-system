const Menu = require('../models/Menu');

// @desc Get all active menu items
// @route GET /api/menu
exports.getMenu = async (req, res) => {
    try {
        const menuItems = await Menu.findActiveItems();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve menu' });
    }
};

// @desc Get a single menu item by ID
// @route GET /api/menu/:id
exports.getMenuItemById = async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving item' });
    }
};