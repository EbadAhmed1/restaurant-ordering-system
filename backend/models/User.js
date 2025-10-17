const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('customer', 'admin'),
        defaultValue: 'customer',
        allowNull: false,
    },
}, {
    tableName: 'Users', // Explicitly define table name
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Helper method to strip sensitive data before sending user object in API response
User.prototype.toResponseObject = function() {
    const user = this.toJSON();
    delete user.password;
    return user;
};

module.exports = User;