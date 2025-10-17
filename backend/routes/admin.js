const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth'); 

// All routes here require both protection and admin role confirmation

// @route GET /api/admin/users
// @desc Get all users in the system
router.get('/users', protect, adminOnly, adminController.getAllUsers);

// @route GET /api/admin/orders
// @desc Get all orders in the system (for monitoring)
router.get('/orders', protect, adminOnly, adminController.getAllOrders);

// @route PUT /api/admin/orders/:id/status
// @desc Update the status of any order (e.g., to 'Delivered')
router.put('/orders/:id/status', protect, adminOnly, adminController.updateOrderStatus);

module.exports = router;