import express from 'express';
import { registerUser, loginUser, googleLogin, getMe, verifyOtp, resendOtp } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

export default router;
