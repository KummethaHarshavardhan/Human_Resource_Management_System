import express from "express";
import {
  applyLeave,
  getLeaveHistory,
  approveLeave,
  rejectLeave,
  cancelLeave,
} from "../controllers/leaveController.js";

import {
  verifyToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Employee
router.post("/leave/apply", verifyToken, applyLeave);
router.get("/leave/history", verifyToken, getLeaveHistory);

// HR/Admin
router.put(
  "/leave/approve/:id",
  verifyToken,
  authorizeRoles("Admin", "HR"),
  approveLeave
);

router.put(
  "/leave/reject/:id",
  verifyToken,
  authorizeRoles("Admin", "HR"),
  rejectLeave
);

// Employee
router.delete("/leave/:id", verifyToken, cancelLeave);

export default router;