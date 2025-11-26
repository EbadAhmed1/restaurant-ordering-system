const orderService = require('../services/order.service');

exports.placeOrder = async (req, res) => {
    const { items, paymentMethod = 'COD', cardDetails = null } = req.body; 
    try {
        const newOrder = await orderService.createOrder(req.user.id, items, paymentMethod, cardDetails); 
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Could not place order' });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await orderService.getOrderHistory(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve order history' });
    }
};

exports.getOrderDetails = async (req, res, next) => {
    const Order = require('../models/Order');

    try {
        const order = await Order.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!order) {
            res.status(404);
            return next(new Error('Order not found or access denied.'));
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};