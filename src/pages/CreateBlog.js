import React, { useState } from "react";
import BlogEditor from "../components/BlogEditor";
import { createBlog } from "../services/blogService";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await createBlog({ title, content, tags: tags.split(",").map(t => t.trim()), imageFile });
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h2>Create Post</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
        <input placeholder="tags (comma separated)" value={tags} onChange={(e)=>setTags(e.target.value)} />
        <BlogEditor content={content} setContent={setContent} />
        <input type="file" accept="image/*" onChange={(e)=>setImageFile(e.target.files[0])} />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}