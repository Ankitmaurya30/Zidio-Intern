import React, { useEffect, useState } from "react";
import { fetchBlog, toggleLike, deleteBlog } from "../services/blogService";
import { useParams, useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  const load = async () => {
    const data = await fetchBlog(id);
    setBlog(data);
  };

  useEffect(() => { load(); }, [id]);

  const like = async () => { await toggleLike(id); await load(); };

  const remove = async () => {
    if (!window.confirm("Delete post?")) return;
    await deleteBlog(id);
    navigate("/dashboard");
  };

  if (!blog) return <div>Loading...</div>;

  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="container">
      <h1>{blog.title}</h1>
      <div className="meta">By {blog.author?.name} • {new Date(blog.createdAt).toLocaleString()}</div>
      {blog.images && blog.images.length > 0 && <img src={blog.images[0].url} alt="cover" className="detail-img" />}
      <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      <div className="actions">
        <button onClick={like}>{blog.likes?.includes(user._id) ? "Unlike" : "Like"} ({blog.likes?.length || 0})</button>
        {user._id === blog.author?._id && (
          <>
            <button onClick={()=>navigate(`/blogs/edit/${id}`)}>Edit</button>
            <button onClick={remove}>Delete</button>
          </>
        )}
      </div>

      <CommentSection comments={blog.comments || []} blogId={id} refresh={load} />
    </div>
  );
}