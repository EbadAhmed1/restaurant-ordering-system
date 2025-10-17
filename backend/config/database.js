const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env

// Initialize Sequelize with MySQL connection details
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Set to true to see SQL queries in the console
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Function to test the database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };