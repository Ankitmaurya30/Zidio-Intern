import React, { useEffect, useState } from "react";
import { fetchBlogs } from "../services/blogService";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [q, setQ] = useState("");
  const [featuredBlog, setFeaturedBlog] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await fetchBlogs();
    setBlogs(data);
    
    // Set the first blog as featured if blogs exist
    if (data && data.length > 0) {
      setFeaturedBlog(data[0]);
    }
  };

  const filtered = blogs.filter(b => 
    b._id !== featuredBlog?._id && 
    (b.title.toLowerCase().includes(q.toLowerCase()) || 
    (b.tags || []).join(" ").includes(q.toLowerCase())
  ));

  return (
    <div className="container">
      {featuredBlog && (
        <div className="featured-blog">
          <div className="featured-content">
            <div className="featured-tag">FEATURED</div>
            <h2>{featuredBlog.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: featuredBlog.excerpt || (featuredBlog.content.slice(0, 200) + "...") }} />
            <div className="featured-meta">
              <span>By {featuredBlog.author?.name || "Unknown"}</span>
              <Link to={`/blogs/${featuredBlog._id}`} className="btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
                  <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                </svg>
                Read Now
              </Link>
            </div>
          </div>
          <div className="featured-image">
            {featuredBlog.images && featuredBlog.images.length > 0 ? (
              <img src={featuredBlog.images[0].url} alt={featuredBlog.title} />
            ) : (
              <img src="https://via.placeholder.com/800x450/181818/e50914?text=BlogFlix" alt="Featured" />
            )}
            <div className="featured-overlay"></div>
          </div>
        </div>
      )}
      
      <div className="home-head">
        <h1>Latest Posts</h1>
        <div className="search-write">
          <div className="search-container">
            <input 
              placeholder="Search by keyword or tag" 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
            />
          </div>
          <Link to="/blogs/create" className="btn">
            <span>Write a Post</span>
          </Link>
        </div>
      </div>
      
      <div className="grid">
        {filtered.length > 0 ? (
          filtered.map(blog => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <div className="no-results">
            <h3>No posts found</h3>
            <p>Try a different search term or create a new post.</p>
          </div>
        )}
      </div>
    </div>
  );
}