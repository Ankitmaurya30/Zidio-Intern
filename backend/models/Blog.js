import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    trim: true
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      public_id: {
        type: String,
        required: true
      }
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Food', 'Other'],
    default: 'Other'
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: [true, 'Please add a comment'],
        trim: true
      },
      name: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create blog slug from the title
BlogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for like count
BlogSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
BlogSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

export default mongoose.model('Blog', BlogSchema);