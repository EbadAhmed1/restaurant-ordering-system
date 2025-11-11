const Menu = require('../models/Menu'); 
const Order = require('../models/Order'); 
const User = require('../models/User'); 

// @desc Add a new menu item
// @route POST /api/admin/menu
// @access Private (Admin Only)
exports.addMenuItem = async (req, res) => {
    // Only Admin can do this, role check middleware assumed
    try {
        const newItem = await Menu.create(req.body); 
        res.status(201).json({ 
            message: 'Menu item created successfully', 
            item: newItem 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add menu item' });
    }
};

// @desc Get all user accounts (for management)
// @route GET /api/admin/users
// @access Private (Admin Only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAllUsers(); // Assumes function to retrieve all users
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// @desc Get all orders in the system (for monitoring)
// @route GET /api/admin/orders (Admin Only)
exports.getAllOrders = async (req, res, next) => {
    try {
        // Fetch all orders, ordering by latest first
        const orders = await Order.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};