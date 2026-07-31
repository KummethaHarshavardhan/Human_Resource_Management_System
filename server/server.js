import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import route from './routes/UserRoute.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

app.use('/api', route);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Backend server start");
});