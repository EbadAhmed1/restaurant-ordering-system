const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
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
    // REMOVED: items (JSON) column. 
    // Data is now stored in the 'OrderItem' table.
    
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Processing', 'Delivered', 'Cancelled'),
        defaultValue: 'Pending',
        allowNull: false,
    },
}, {
    tableName: 'Orders',
    timestamps: true,
});

// Associations
User.hasMany(Order, {
    foreignKey: 'userId',
    onDelete: 'CASCADE', 
});

Order.belongsTo(User, {
    foreignKey: 'userId',
});

module.exports = Order;