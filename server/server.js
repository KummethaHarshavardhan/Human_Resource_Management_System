import express from "express";
import dotenv from "dotenv";
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

app.use("/api", route);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HRMS API Server is Running",
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
