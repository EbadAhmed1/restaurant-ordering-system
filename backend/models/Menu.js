const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Menu = sequelize.define('Menu', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // Stores currency with 2 decimal places
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING(255), // For storing the path or URL to the image
        allowNull: true,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'Menu',
    timestamps: true,
});

module.exports = Menu;
