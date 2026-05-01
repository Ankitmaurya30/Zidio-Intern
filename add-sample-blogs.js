import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Import Blog model
import Blog from './backend/models/Blog.js';
import User from './backend/models/User.js';

// Sample blog data with Netflix-inspired content
const sampleBlogs = [
  {
    title: "The Evolution of Streaming: How Netflix Changed Entertainment",
    content: `<p>Streaming has revolutionized how we consume media. From DVD rentals to global streaming giant, Netflix has led this transformation.</p>
    <p>The company's willingness to invest in original content created a new golden age of television, with shows like Stranger Things and The Crown redefining what's possible in serialized storytelling.</p>
    <p>This blog explores how the streaming model has changed viewer expectations and transformed the entertainment industry forever.</p>`,
    tags: ["streaming", "entertainment", "technology"],
    category: "Technology",
    images: [{
      url: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Streaming Entertainment",
      public_id: "streaming-evolution-netflix"
    }]
  },
  {
    title: "Binge-Worthy: The Psychology Behind Marathon Viewing",
    content: `<p>The phenomenon of binge-watching has changed how stories are told and consumed. When Netflix released entire seasons at once, it created a new viewing behavior.</p>
    <p>This article examines the psychological factors that make marathon viewing so appealing and how content creators have adapted their storytelling techniques to accommodate this behavior.</p>
    <p>From cliffhangers to character development, learn how binge-watching has influenced modern narrative structures.</p>`,
    tags: ["psychology", "binge-watching", "entertainment"],
    category: "Health",
    images: [{
      url: "https://images.unsplash.com/photo-1585128792020-803d29415281?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Person watching TV",
      public_id: "binge-watching-psychology"
    }]
  },
  {
    title: "The Art of the Algorithm: How Recommendations Shape Viewing Habits",
    content: `<p>Behind every streaming service is a sophisticated recommendation algorithm designed to keep viewers engaged.</p>
    <p>Netflix's recommendation system is particularly advanced, analyzing viewing patterns, preferences, and even the time of day to suggest content that keeps subscribers watching.</p>
    <p>This deep dive explores how these algorithms work and their impact on content discovery and viewing diversity.</p>`,
    tags: ["technology", "algorithms", "data science"],
    category: "Technology",
    images: [{
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Algorithm visualization",
      public_id: "algorithm-recommendations"
    }]
  },
  {
    title: "Global Storytelling: How International Content Became Mainstream",
    content: `<p>Shows like Squid Game, Money Heist, and Dark have proven that language is no barrier to global success.</p>
    <p>Netflix's investment in international content has exposed audiences to stories and perspectives from around the world, challenging Hollywood's dominance.</p>
    <p>This article examines how streaming platforms have helped international content find global audiences and what this means for the future of entertainment.</p>`,
    tags: ["international", "global", "content"],
    category: "Travel",
    images: [{
      url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Global entertainment",
      public_id: "global-storytelling"
    }]
  },
  {
    title: "The Future of Interactive Storytelling",
    content: `<p>With experiments like Black Mirror: Bandersnatch, Netflix has explored the potential of interactive storytelling.</p>
    <p>This format allows viewers to make choices that affect the narrative, blurring the line between passive viewing and active participation.</p>
    <p>This blog explores the challenges and opportunities of interactive content and what it might mean for the future of entertainment.</p>`,
    tags: ["interactive", "future", "innovation"],
    category: "Technology",
    images: [{
      url: "https://images.unsplash.com/photo-1551817958-d9d86fb29431?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Interactive technology",
      public_id: "interactive-storytelling"
    }]
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected successfully');
  
  try {
    // Find admin user to set as author
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    
    // Add author to each blog
    const blogsWithAuthor = sampleBlogs.map(blog => ({
      ...blog,
      author: adminUser._id
    }));
    
    // Delete existing blogs
    await Blog.deleteMany({});
    console.log('Existing blogs deleted');
    
    // Insert sample blogs
    await Blog.insertMany(blogsWithAuthor);
    console.log('Sample blogs added successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample blogs:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});