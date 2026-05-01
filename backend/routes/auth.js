import express from 'express';
import {
  signup,
  login,
  getMe,
  updateDetails,
  updatePassword
} from '../controllers/authController.js';

const router = express.Router();

import { protect } from '../middleware/auth.js';

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

export default router;