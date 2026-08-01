import express from "express";

import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
  getMyProfile,
  updateMyProfile,
} from "../controllers/EmployeeController.js";

import {
  verifyToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// =====================================================
// EMPLOYEE PROFILE ROUTES
// Logged-in user can view/update own employee profile
// =====================================================

// Get logged-in employee profile
router.get("/profile", verifyToken, getMyProfile);

// Update logged-in employee profile
router.put("/profile", verifyToken, updateMyProfile);


// =====================================================
// EMPLOYEE MANAGEMENT ROUTES
// Admin and HR only
// =====================================================

// Create new employee
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin", "HR"),
  createEmployee
);

// Get all employees
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "HR"),
  getAllEmployees
);

// Get single employee by ID
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "HR"),
  getEmployeeById
);

// Update employee
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "HR"),
  updateEmployee
);

// Delete employee
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  deleteEmployee
);

// Update employee status
router.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("Admin", "HR"),
  updateEmployeeStatus
);

export default router;