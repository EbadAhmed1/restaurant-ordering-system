const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        }
    },
    numberOfGuests: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reservationTime: {
        type: DataTypes.DATE, // Maps to DATETIME in MySQL
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Confirmed', 'Seated', 'Cancelled'),
        defaultValue: 'Confirmed',
        allowNull: false,
    }
}, {
    tableName: 'reservations',
    timestamps: true,
});

// Associations
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

module.exports = Reservation;