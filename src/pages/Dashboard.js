import React, { useEffect, useState } from "react";
import { fetchUserBlogs } from "../services/blogService";
import BlogCard from "../components/BlogCard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await fetchUserBlogs(user._id);
    setBlogs(data);
  };

  return (
    <div className="container">
      <h2>Your Blogs</h2>
      <div className="grid">
        {blogs.map(b => <BlogCard key={b._id} blog={b} />)}
      </div>
    </div>
  );
}