import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import dotenv from 'dotenv';

dotenv.config();

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = DB_NAME || 'VIDEOTUBE_DB';

export const dbconnect = async ()=>{
   await mongoose.connect(`${dbURI}/${dbName}`, {
    }).then(() => {
        console.log('Database connected successfully');
    }).catch((err) => {
        console.error('Database connection failed:', err);
    });
}

