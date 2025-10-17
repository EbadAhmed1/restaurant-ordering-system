const Order = require('../models/Order');

// @desc Create a new order
// @route POST /api/orders
// @access Private (Requires Auth)
exports.placeOrder = async (req, res) => {
    const { items, total } = req.body;
    try {
        // req.user.id is populated by authentication middleware
        const newOrder = await Order.create({ userId: req.user.id, items, total, status: 'Pending' });
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Could not place order' });
    }
};

// @desc Get order history for the authenticated user
// @route GET /api/orders/history
// @access Private (Requires Auth)
exports.getOrderHistory = async (req, res) => {
    try {
        // req.user.id is populated by authentication middleware
        const orders = await Order.findHistoryByUserId(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve order history' });
    }
};