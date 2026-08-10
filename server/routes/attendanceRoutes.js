import express from "express";

import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getMonthlyAttendance,
  getAttendanceCalendar,
  getAllAttendanceAdmin,
} from "../controllers/attendanceController.js";

import {
  validateCheckIn,
  validateCheckOut,
  validateMonthlyAttendance,
} from "../validations/attendanceValidation.js";

import {
  verifyToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Attendance Routes Working"
  });
});


router.post(
  "/check-in",
  verifyToken,
  authorizeRoles("Employee", "HR"),
  validateCheckIn,
  checkIn
);


router.post(
  "/check-out",
  verifyToken,
  authorizeRoles("Employee", "HR"),
  validateCheckOut,
  checkOut
);


router.get(
  "/today",
  verifyToken,
  authorizeRoles("Employee", "HR", "Admin"),
  getTodayAttendance
);


router.get(
  "/history",
  verifyToken,
  authorizeRoles("Employee", "HR", "Admin"),
  getAttendanceHistory
);


router.get(
  "/month/:year/:month",
  verifyToken,
  authorizeRoles("Employee", "HR", "Admin"),
  validateMonthlyAttendance,
  getMonthlyAttendance
);


router.get(
  "/calendar/:year/:month",
  verifyToken,
  authorizeRoles("Employee", "HR", "Admin"),
  getAttendanceCalendar
);


router.get(
  "/admin/all",
  verifyToken,
  authorizeRoles("Admin"),
  getAllAttendanceAdmin
);

export default router;