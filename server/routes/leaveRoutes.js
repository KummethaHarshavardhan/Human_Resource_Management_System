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
router.post("/apply", verifyToken, applyLeave);
router.get("/history", verifyToken, getLeaveHistory);

// HR/Admin
router.put(
  "/approve/:id",
  verifyToken,
  authorizeRoles("Admin", "HR"),
  approveLeave
);

router.put(
  "/reject/:id",
  verifyToken,
  authorizeRoles("Admin", "HR"),
  rejectLeave
);

// Employee
router.delete("/:id", verifyToken, cancelLeave);

export default router;