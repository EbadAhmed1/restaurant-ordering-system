const Menu = require('../models/Menu');

exports.getMenu = async (req, res, next) => {
    try {
        const menuItems = await Menu.findAll({
            where: { isAvailable: true }
        });
        res.json(menuItems);
    } catch (error) {
        next(error);
    }
};

exports.addMenuItem = async (req, res, next) => {
    const { name, description, price, category, isAvailable } = req.body;
    const imageUrl = req.file ? req.file.path.replace('public', '') : null; 

    try {
        const newItem = await Menu.create({
            name, 
            description, 
            price, 
            category,
            isAvailable: isAvailable || true,
            imageUrl
        }); 
        res.status(201).json({ message: 'Menu item created successfully', item: newItem });
    } catch (error) {
        next(error);
    }
};

exports.updateMenuItem = async (req, res, next) => {
    const { name, description, price, category, isAvailable } = req.body;
    const imageUrl = req.file ? req.file.path.replace('public', '') : req.body.imageUrl; 

    try {
        const item = await Menu.findByPk(req.params.id);

        if (!item) {
            res.status(404);
            return next(new Error('Menu item not found'));
        }

        await item.update({ 
            name, description, price, category, isAvailable, imageUrl
        });

        res.json({ message: 'Menu item updated successfully', item });
    } catch (error) {
        next(error);
    }
};

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

exports.getMenuItemById = async (req, res, next) => {
    try {
        const item = await Menu.findByPk(req.params.id);
        if (!item) {
            res.status(404);
            return next(new Error('Item not found'));
        }
        res.json(item);
    } catch (error) {
        next(error);
    }
};