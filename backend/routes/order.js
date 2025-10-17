const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth'); 

// @route POST /api/orders
// @desc Place a new order
// Requires 'protect' middleware to ensure a user is logged in
router.post('/', protect, orderController.placeOrder);

// @route GET /api/orders/history
// @desc Get the authenticated user's order history
router.get('/history', protect, orderController.getOrderHistory);

// @route GET /api/orders/:id
// @desc Get details of a specific order (must belong to the authenticated user)
router.get('/:id', protect, orderController.getOrderDetails); 

module.exports = router;