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

// @desc Update an existing menu item
// @route PUT /api/menu/:id (Admin Only)
exports.updateMenuItem = async (req, res, next) => {
    const { name, description, price, category, isAvailable } = req.body;
    // req.file is populated by the multer middleware
    const imageUrl = req.file ? req.file.path.replace('public', '') : req.body.imageUrl; 

    try {
        const item = await Menu.findByPk(req.params.id);

        if (!item) {
            res.status(404);
            return next(new Error('Menu item not found'));
        }

        // Use Sequelize's update method
        await item.update({ 
            name, description, price, category, isAvailable, imageUrl
        });

        res.json({ message: 'Menu item updated successfully', item });
    } catch (error) {
        next(error);
    }
};

// @desc Delete a menu item
// @route DELETE /api/menu/:id (Admin Only)
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const item = await Menu.findByPk(req.params.id);

        if (!item) {
            res.status(404);
            return next(new Error('Menu item not found'));
        }

        await item.destroy();

        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        next(error);
    }
};