// server/routes/payrollRoutes.js

import express from 'express';
import {
  generatePayroll,
  getAllPayrolls,
  getPayrollsByEmployee,
  getPayrollById,
  markPayrollAsPaid,
} from '../controllers/payrollController.js';
import { validateGeneratePayroll } from '../validations/payrollValidation.js';

// TEMP: auth middleware removed until Team 1 delivers authMiddleware.js
// Add back: import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', validateGeneratePayroll, generatePayroll);
router.get('/', getAllPayrolls);
router.get('/employee/:employeeId', getPayrollsByEmployee);
router.get('/:id', getPayrollById);
router.patch('/:id/mark-paid', markPayrollAsPaid);

export default router;