const mongoose = require('mongoose');
const { DB_NAME } = require('../constants.js');
require('dotenv').config();

const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/mydatabase';
const dbName = DB_NAME || 'mydatabase';

exports.dbconnect = async ()=>{
   await mongoose.connect(`${dbURI}/${dbName}`, {
    }).then(() => {
        console.log('Database connected successfully');
    }).catch((err) => {
        console.error('Database connection failed:', err);
    });
}

