import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import route from "./routes/UserRoute.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import leaveBalanceRoutes from "./routes/leaveBalanceRoutes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use("/api", route);
app.use("/api/departments", departmentRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/leave-balance", leaveBalanceRoutes);

app.get("/", (req, res) => {
    res.json({
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
    console.log(`Server running on port ${PORT}`);
});