import express from 'express';
import { EmpLogin, googleLogin,EmpOtp, EmpRegister, resetPassword, verifyOtp } from '../controllers/UserController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const route = express.Router();


route.post('/newEmp', EmpRegister);
route.post('/Emplogin', EmpLogin);
route.post("/google-login", googleLogin);
route.post('/sendOtp', EmpOtp);
route.post('/verifyOtp', verifyOtp);
route.post('/resetpassword', resetPassword);

export default route;