const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Order = require('./Order');
const Menu = require('./Menu');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id',
        }
    },
    menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Menu',
            key: 'id',
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    priceAtOrder: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Snapshot of the item price at the moment of order',
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        // You can calculate this before saving: quantity * priceAtOrder
    }
}, {
    tableName: 'orderitems',
    timestamps: false, // Usually junction tables don't need timestamps, but you can enable if needed
});

// Associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Menu.hasMany(OrderItem, { foreignKey: 'menuId' });
OrderItem.belongsTo(Menu, { foreignKey: 'menuId', as: 'menuItem' });

module.exports = OrderItem;