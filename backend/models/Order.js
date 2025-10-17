const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Import other models to define relationships
const User = require('./User');
const Menu = require('./Menu');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // Foreign Key linking to the User who placed the order
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Name of the target table
            key: 'id',
        }
    },
    // Note: Items are stored as JSON for simplicity and flexibility
    items: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'JSON array of ordered items, quantities, and prices',
    },
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

// --- Define Associations (Relationships) ---
// 1. User has many Orders (One-to-Many)
User.hasMany(Order, {
    foreignKey: 'userId',
    onDelete: 'CASCADE', // If a User is deleted, their Orders are also deleted
});

Order.belongsTo(User, {
    foreignKey: 'userId',
});

// Note: Menu items are included in the Order.items JSON column for simplicity, 
// so a dedicated OrderItem join table isn't needed right now.

module.exports = Order;

// Note: You must ensure all models are imported at least once 
// (e.g., in a central index file or in your main server file) 
// and then run: await sequelize.sync({ alter: true }); 
// to create the tables in your MySQL database.
