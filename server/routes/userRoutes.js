import express from 'express';
import { getUserProfile, updateUserProfile, googleLogin } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/google-login', googleLogin);

router.get('/admin-only', protect, authorize('Admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome Admin! Access granted to Admin route.',
    user: req.user,
  });
});

router.get('/hr-only', protect, authorize('Admin', 'HR'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome HR/Admin! Access granted to HR route.',
    user: req.user,
  });
});

router.get('/employee-only', protect, authorize('Admin', 'HR', 'Employee'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome Employee! Access granted to Employee route.',
    user: req.user,
  });
});

export default router;
