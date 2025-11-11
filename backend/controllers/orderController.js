const orderService = require('../services/order.service'); // Import the new service

// @desc Create a new order
// @route POST /api/orders
// @access Private (Requires Auth)
exports.placeOrder = async (req, res) => {
    // Only items are needed from the body; the total is calculated by the service
    const { items } = req.body; 
    try {
        // Pass userId and the items array to the Service layer
        const newOrder = await orderService.createOrder(req.user.id, items); 
        
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        // Use the centralized error handler (next(error)) instead of local res.status(500)
        // For now, if you haven't implemented it:
        res.status(400).json({ message: error.message || 'Could not place order' });
    }
};

// @desc Get order history for the authenticated user
// @route GET /api/orders/history
// @access Private (Requires Auth)
exports.getOrderHistory = async (req, res) => {
    try {
        // Delegate complex fetching logic to the Service layer
        const orders = await orderService.getOrderHistory(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve order history' });
    }
};

// @desc Get details of a specific order (must belong to the authenticated user)
// @route GET /api/orders/:id
exports.getOrderDetails = async (req, res, next) => {
    const Order = require('../models/Order'); // Local import for convenience

    try {
        const order = await Order.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id // CRITICAL: Check if the order belongs to the user
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