import React, { useState } from "react";
import { addComment } from "../services/blogService";

export default function CommentSection({ comments = [], blogId, refresh }) {
  const [text, setText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addComment(blogId, text);
    setText("");
    if (refresh) refresh();
  };

  return (
    <div className="comments">
      <h4>Comments</h4>
      <form onSubmit={submit}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write comment..." />
        <button type="submit">Comment</button>
      </form>

      <div className="comments-list">
        {comments.length === 0 && <p>No comments yet</p>}
        {comments.map((c) => (
          <div key={c._id} className="comment">
            <strong>{c.user?.name || "User"}</strong>
            <p>{c.text}</p>
            <small>{new Date(c.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}