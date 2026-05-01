import React, { useEffect, useState } from "react";
import { fetchUserBlogs } from "../services/blogService";
import BlogCard from "../components/BlogCard";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchUserBlogs(user._id);
      setBlogs(data);
    })();
  }, [user._id]);

  return (
    <div className="container">
      <div className="profile-head">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>

      <h3>Your Posts</h3>
      <div className="grid">
        {blogs.map(b => <BlogCard key={b._id} blog={b} />)}
      </div>
    </div>
  );
}