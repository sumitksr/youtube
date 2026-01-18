const mongoose = require('mongoose');
const express = require('express');
const PORT = process.env.PORT || 3000;
const { DB_NAME } = "../constants.js";
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { dbconnect } = require('./config/database.js');
const app = express();


//CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true,
}))


//MIDDLEWARES
app.use(express.json({limit: '50kb'}));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(cookieParser());
app.use(express.static('public'));


//DB CONNECTION
dbconnect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to the database:', err);
});


//ROUTES
import userRoutes from './routes/user.js';
app.use('/api/v1/users', userRoutes);
