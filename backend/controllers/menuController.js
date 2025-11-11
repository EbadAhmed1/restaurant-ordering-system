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

// @desc Add a new menu item
// @route POST /api/menu (Admin Only)
exports.addMenuItem = async (req, res, next) => {
    const { name, description, price, category, isAvailable } = req.body;
    // req.file is populated by the multer middleware (upload.middleware)
    const imageUrl = req.file ? req.file.path.replace('public', '') : null; 

    try {
        const newItem = await Menu.create({
            name, 
            description, 
            price, 
            category,
            isAvailable: isAvailable || true, // Default to true if not provided
            imageUrl
        }); 
        res.status(201).json({ message: 'Menu item created successfully', item: newItem });
    } catch (error) {
        next(error);
    }
};

