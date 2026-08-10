// server/routes/salaryRoutes.js

import express from 'express';
import {
  createSalary,
  getAllSalaries,
  getSalaryByEmployee,
  getSalaryById,
  updateSalary,
  deactivateSalary,
} from '../controllers/salaryController.js';
import { validateCreateSalary, validateUpdateSalary } from '../validations/salaryValidation.js';

// TEMP: auth middleware removed until Team 1 delivers authMiddleware.js
// Add back: import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', validateCreateSalary, createSalary);
router.get('/', getAllSalaries);
router.get('/id/:id', getSalaryById); // NEW — fetch by salary _id (used by Edit page)
router.get('/:employeeId', getSalaryByEmployee);
router.put('/:id', validateUpdateSalary, updateSalary);
router.delete('/:id', deactivateSalary);

export default router;