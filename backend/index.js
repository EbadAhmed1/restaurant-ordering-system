const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const allRoutes = require('./routes/index'); 
const errorHandler = require('./middleware/error.middleware'); 
const cors = require('cors'); 
const helmet = require('helmet'); 
require('dotenv').config({ path: './backend/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

require('./models/User');
require('./models/Menu');
require('./models/Order');
require('./models/OrderItem');
require('./models/Payment');      // Now Sequelize knows about Payments
require('./models/Reservation');

// Connect to Database and sync models
const startServer = async () => {
    await connectDB();
    // Use sequelize.sync() once all models are imported (done in database.js)
    // await sequelize.sync({ alter: true }); // Uncomment this to run migrations/sync
    
    // --- Global Middleware ---
    app.use(helmet());
    app.use(cors()); // Allow cross-origin requests from your frontend
    app.use(express.json()); // Body parser for JSON requests


    app.use('/public', express.static('public'));


    // --- Routes ---
    app.use('/api', allRoutes);

    // --- Error Handler (MUST be the last middleware) ---
    app.use(errorHandler);

    app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`));
};

startServer();