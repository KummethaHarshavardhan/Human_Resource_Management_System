import express from 'express';
import { EmpLogin, EmpOtp, EmpRegister, resetPassword, verifyOtp, getProfile } from '../controllers/UserController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const route = express.Router();


route.post('/newEmp', EmpRegister);
route.post('/Emplogin', EmpLogin);
route.post('/sendOtp', EmpOtp);
route.post('/verifyOtp', verifyOtp);
route.post('/resetpassword', resetPassword);

route.get('/profile', verifyToken, getProfile);

route.get('/admin-only', verifyToken, authorizeRoles("Admin"), (req, res) => {
    res.json({ success: true, message: "Welcome Admin" });
});

export default route;

