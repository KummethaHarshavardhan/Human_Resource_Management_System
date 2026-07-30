import express from 'express';
import { EmpLogin, googleLogin,EmpOtp, EmpRegister, resetPassword, verifyOtp, getProfile, updateProfile } from '../controllers/UserController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const route = express.Router();


route.post('/newEmp', EmpRegister);
route.post('/Emplogin', EmpLogin);
route.post("/google-login", googleLogin);
route.post('/sendOtp', EmpOtp);
route.post('/verifyOtp', verifyOtp);
route.post('/resetpassword', resetPassword);

// laksmi Reddy
route
  .route("/profile")
  .get(verifyToken, getProfile)
  .put(verifyToken, updateProfile);

route.get("/admin-only",verifyToken,authorizeRoles("Admin"),(req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

route.get("/hr-only",verifyToken,authorizeRoles("Admin", "HR"),(req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome HR/Admin",
      user: req.user,
    });
  }
);

route.get("/employee-only",verifyToken,authorizeRoles("Admin", "HR", "Employee"),(req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Employee",
      user: req.user,
    });
  }
);

export default route;

