import Blog from '../models/Blog.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import fs from 'fs';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Blog.countDocuments();

    // Query with pagination
    const blogs = await Blog.find()
      .populate('author', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination,
      data: blogs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name profilePicture');

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.author = req.user._id;

    // Handle image uploads if any
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        images.push(result);
      }
    }

    // Create blog with images
    const blog = await Blog.create({
      ...req.body,
      images
    });

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (err) {
    // Clean up any uploaded files if blog creation fails
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(err);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Make sure user is blog owner
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this blog'
      });
    }

    // Handle image uploads if any
    if (req.files && req.files.length > 0) {
      const images = [];
      
      // Delete old images from Cloudinary if replacing
      if (req.body.replaceImages === 'true') {
        for (const image of blog.images) {
          await deleteFromCloudinary(image.public_id);
        }
        
        // Upload new images
        for (const file of req.files) {
          const result = await uploadToCloudinary(file.path);
          images.push(result);
        }
        
        req.body.images = images;
      } else {
        // Add new images to existing ones
        for (const file of req.files) {
          const result = await uploadToCloudinary(file.path);
          images.push(result);
        }
        
        req.body.images = [...blog.images, ...images];
      }
    }

    // Update blog
    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (err) {
    // Clean up any uploaded files if blog update fails
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(err);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Make sure user is blog owner or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this blog'
      });
    }

    // Delete images from Cloudinary
    for (const image of blog.images) {
      await deleteFromCloudinary(image.public_id);
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get blogs by user
// @route   GET /api/blogs/user/:userId
// @access  Public
export const getUserBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Blog.countDocuments({ author: req.params.userId });

    const blogs = await Blog.find({ author: req.params.userId })
      .populate('author', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination,
      data: blogs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check if the blog has already been liked by this user
    if (blog.likes.some(like => like.toString() === req.user.id)) {
      // Unlike the blog
      blog.likes = blog.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like the blog
      blog.likes.push(req.user.id);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Comment on a blog
// @route   POST /api/blogs/:id/comment
// @access  Private
export const commentBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const newComment = {
      text: req.body.text,
      user: req.user.id,
      name: req.user.name
    };

    blog.comments.unshift(newComment);

    await blog.save();

    res.status(201).json({
      success: true,
      data: blog.comments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment
// @route   DELETE /api/blogs/:id/comment/:commentId
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Pull out comment
    const comment = blog.comments.find(
      comment => comment.id === req.params.commentId
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    // Get remove index
    const removeIndex = blog.comments
      .map(comment => comment.id)
      .indexOf(req.params.commentId);

    blog.comments.splice(removeIndex, 1);

    await blog.save();

    res.status(200).json({
      success: true,
      data: blog.comments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search blogs
// @route   GET /api/blogs/search
// @access  Public
export const searchBlogs = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search keyword'
      });
    }

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ]
    }).populate('author', 'name email profilePicture');

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Filter blogs by category or tags
// @route   GET /api/blogs/filter
// @access  Public
export const filterBlogs = async (req, res, next) => {
  try {
    const { category, tag } = req.query;
    const filterQuery = {};

    if (category) {
      filterQuery.category = category;
    }

    if (tag) {
      filterQuery.tags = { $in: [tag] };
    }

    if (!category && !tag) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a category or tag to filter by'
      });
    }

    const blogs = await Blog.find(filterQuery)
      .populate('author', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (err) {
    next(err);
  }
};