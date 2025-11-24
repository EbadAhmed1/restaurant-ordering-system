const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const allRoutes = require('./routes/index'); 
const errorHandler = require('./middleware/error.middleware'); 
const cors = require('cors'); 
require('dotenv').config({ path: './backend/.env' });

const app = express();
const PORT = process.env.PORT || 4500;

require('./models/User');
require('./models/Menu');
require('./models/Order');
require('./models/OrderItem');
require('./models/Payment');
require('./models/Reservation');

// Connect to Database and sync models
const startServer = async () => {
    await connectDB();
    app.use(cors()); 
    app.use(express.json());
    app.use('/public', express.static('public'));
    app.use('/api', allRoutes);
    app.use(errorHandler);
    app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`));
};

startServer();