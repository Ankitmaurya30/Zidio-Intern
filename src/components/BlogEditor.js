import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function BlogEditor({ content, setContent }) {
  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      placeholder="Write your post..."
    />
  );
}