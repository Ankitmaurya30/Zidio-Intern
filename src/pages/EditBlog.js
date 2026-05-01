import React, { useEffect, useState } from "react";
import { fetchBlog, updateBlog } from "../services/blogService";
import { useParams, useNavigate } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchBlog(id);
      setBlog(data);
      setTitle(data.title);
      setContent(data.content);
      setTags((data.tags || []).join(","));
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    await updateBlog(id, { title, content, tags: tags.split(",").map(t => t.trim()), imageFile });
    navigate("/dashboard");
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Edit Post</h2>
      <form onSubmit={submit}>
        <input value={title} onChange={e=>setTitle(e.target.value)} required />
        <input value={tags} onChange={e=>setTags(e.target.value)} />
        <BlogEditor content={content} setContent={setContent} />
        <input type="file" onChange={e=>setImageFile(e.target.files[0])} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}