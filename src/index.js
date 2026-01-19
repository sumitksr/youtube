import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { dbconnect } from './config/database.js';
import userRoutes from './routes/user.js';
import './config/cloudinary.js'; // Initialize cloudinary config

dotenv.config();

const PORT = process.env.PORT || 3000;
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
app.use('/api/v1/users', userRoutes);
