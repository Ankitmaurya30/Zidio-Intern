import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  likeBlog,
  commentBlog,
  deleteComment,
  searchBlogs,
  filterBlogs
} from '../controllers/blogController.js';

const router = express.Router();

import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// Blog routes
router.route('/')
  .get(getBlogs)
  .post(protect, upload.array('images', 5), createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, upload.array('images', 5), updateBlog)
  .delete(protect, deleteBlog);

// User blogs
router.get('/user/:userId', getUserBlogs);

// Like and comment routes
router.put('/:id/like', protect, likeBlog);
router.post('/:id/comment', protect, commentBlog);
router.delete('/:id/comment/:commentId', protect, deleteComment);

// Search and filter routes
router.get('/search', searchBlogs);
router.get('/filter', filterBlogs);

export default router;