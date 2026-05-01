import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  // Default image if none is provided
  const defaultImage = "https://via.placeholder.com/300x200/181818/e50914?text=BlogFlix";
  
  return (
    <div className="card">
      <div className="card-img-container">
        <img 
          src={blog.images && blog.images.length > 0 ? blog.images[0].url : defaultImage} 
          alt={blog.title} 
          className="card-img" 
        />
        <div className="card-overlay">
          <Link to={`/blogs/${blog._id}`} className="card-play-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3L19 12L5 21V3Z" fill="white"/>
            </svg>
          </Link>
        </div>
        {blog.category && (
          <div className="card-category">
            <span>{blog.category}</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <h3>{blog.title}</h3>
        <p dangerouslySetInnerHTML={{ __html: blog.excerpt || (blog.content.slice(0, 120) + "...") }} />
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="card-tags">
            {blog.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="card-tag">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="card-meta">
          <small>By {blog.author?.name || "Unknown"}</small>
          <Link to={`/blogs/${blog._id}`} className="read-more">Read more</Link>
        </div>
      </div>
    </div>
  );
}