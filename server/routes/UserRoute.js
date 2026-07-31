import express from "express";
import {
    EmpLogin, EmpOtp, EmpRegister, resetPassword, verifyOtp, googleLogin,
    getUserProfile, updateUserProfile
} from "../controllers/userController.js";
import { verifyToken, authorizeRoles, protect, authorize } from "../middlewares/authMiddleware.js";

const route = express.Router();

route.post("/newEmp", EmpRegister);
route.post("/Emplogin", EmpLogin);
route.post("/googleLogin", googleLogin);
route.post("/sendOtp", EmpOtp);
route.post("/verifyOtp", verifyOtp);
route.post("/resetpassword", resetPassword);


route.get("/profile", protect, getUserProfile);
route.put("/profile", protect, updateUserProfile);


route.get("/admin-only", protect, authorize("Admin"), (req, res) => {
    res.status(200).json({ success: true, message: "Welcome Admin!", user: req.user });
});

route.get("/hr-only", protect, authorize("Admin", "HR"), (req, res) => {
    res.status(200).json({ success: true, message: "Welcome HR/Admin!", user: req.user });
});

route.get("/employee-only", protect, authorize("Admin", "HR", "Employee"), (req, res) => {
    res.status(200).json({ success: true, message: "Welcome Employee!", user: req.user });
});

export default route;
