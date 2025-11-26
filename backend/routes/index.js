const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const menuRoutes = require('./menu');
const orderRoutes = require('./order');
const adminRoutes = require('./admin');
const reservationRoutes = require('./reservations');

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/reservations', reservationRoutes);

// Basic root route for API status check
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Restaurant Ordering API' });
});

module.exports = router;