import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllBlogs,
  deleteBlog
} from '../controllers/adminController.js';

const router = express.Router();

import { protect, authorize } from '../middleware/auth.js';

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// User routes
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Blog routes
router.route('/blogs')
  .get(getAllBlogs);

router.route('/blogs/:id')
  .delete(deleteBlog);

export default router;