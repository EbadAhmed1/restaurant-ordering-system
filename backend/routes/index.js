const express = require('express');
const router = express.Router();

// Import all specific route files
const authRoutes = require('./auth');
const menuRoutes = require('./menu');
const orderRoutes = require('./order');
const adminRoutes = require('./admin');

// Mount routes to their respective paths
router.use('/auth', authRoutes); // /api/auth/...
router.use('/menu', menuRoutes); // /api/menu/...
router.use('/orders', orderRoutes); // /api/orders/...
router.use('/admin', adminRoutes); // /api/admin/...

// Basic root route for API status check
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Restaurant Ordering API' });
});

module.exports = router;