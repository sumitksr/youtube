import mongoose from "mongoose";
import { dbconnect } from './config/database.js';
import express from "express";
import { PORT } from './constants.js';
import cors from "cors";
const app = express();


