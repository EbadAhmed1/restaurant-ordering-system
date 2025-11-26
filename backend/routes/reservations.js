const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, reservationController.createReservation);
router.get('/my-reservations', protect, reservationController.getUserReservations);
router.get('/all', protect, adminOnly, reservationController.getAllReservations);
router.put('/:id/status', protect, adminOnly, reservationController.updateReservationStatus);
router.delete('/:id', protect, reservationController.cancelReservation);

module.exports = router;
