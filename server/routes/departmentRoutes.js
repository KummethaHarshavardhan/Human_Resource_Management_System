import express from "express";

import {
    verifyToken,
    authorizeRoles
} from "../middlewares/authMiddleware.js";

import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

router.post(
    "/",
    verifyToken,
    authorizeRoles("Admin", "HR"),
    createDepartment
);

router.get(
    "/",
    verifyToken,
    getAllDepartments
);

router.get(
    "/:id",
    verifyToken,
    getDepartmentById
);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("Admin", "HR"),
    updateDepartment
);

router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("Admin"),
    deleteDepartment
);

export default router;