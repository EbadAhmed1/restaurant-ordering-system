const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Order = require('./Order');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // One payment per order
        references: {
            model: 'Orders',
            key: 'id',
        }
    },
    transactionId: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.ENUM('Credit Card', 'COD', 'PayPal'),
        allowNull: false,
    },
    amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Success', 'Failed', 'Pending'),
        defaultValue: 'Pending',
        allowNull: false,
    }
}, {
    tableName: 'payments',
    timestamps: true,
});

// Associations
Order.hasOne(Payment, { foreignKey: 'orderId', as: 'paymentDetails' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Payment;