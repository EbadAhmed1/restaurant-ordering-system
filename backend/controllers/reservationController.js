const Reservation = require('../models/Reservation');
const User = require('../models/User');
const { sequelize } = require('../config/database');

exports.createReservation = async (req, res) => {
    const { numberOfGuests, reservationTime, notes } = req.body;
    
    try {
        const reservation = await Reservation.create({
            userId: req.user.id,
            numberOfGuests,
            reservationTime,
            notes,
            status: 'Confirmed'
        });

        res.status(201).json({ 
            message: 'Reservation created successfully', 
            reservation 
        });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Failed to create reservation' });
    }
};

exports.getUserReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: { userId: req.user.id },
            order: [['reservationTime', 'DESC']]
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve reservations' });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: [{
                model: User,
                attributes: ['username', 'email']
            }],
            order: [['reservationTime', 'ASC']]
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve reservations' });
    }
};

exports.updateReservationStatus = async (req, res) => {
    const { status } = req.body;
    
    try {
        const reservation = await Reservation.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['username', 'email']
            }]
        });
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        await reservation.update({ status });
        res.json({ message: 'Reservation status updated', reservation });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        await reservation.update({ status: 'Cancelled' });
        res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = exports;
