const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const allRoutes = require('./routes/index'); // The route aggregator we'll create below
const errorHandler = require('./middleware/error.middleware'); // The middleware we'll add
const cors = require('cors'); // Essential for connecting with the React frontend
const helmet = require('helmet'); // Security enhancement
require('dotenv').config(); // Load environment variables FIRST

const app = express();
const PORT = process.env.PORT || 5000;

