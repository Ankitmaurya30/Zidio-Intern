import api from "../api/axiosConfig";

export const fetchBlogs = (params) =>
  api.get("/blogs", { params }).then((r) => r.data.data);

export const fetchBlog = (id) => api.get(`/blogs/${id}`).then((r) => r.data.data);

export const createBlog = async ({ title, content, tags, imageFile }) => {
  let imageData = null;
  if (imageFile) {
    const form = new FormData();
    form.append("file", imageFile);
    const upload = await api.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    imageData = {
      url: upload.data.url,
      public_id: upload.data.public_id
    };
  }
  const { data } = await api.post("/blogs", { 
    title, 
    content, 
    tags, 
    images: imageData ? [imageData] : []
  });
  return data;
};

export const updateBlog = async (id, { title, content, tags, imageFile, replaceImages = false }) => {
  let imageData = null;
  if (imageFile) {
    const form = new FormData();
    form.append("file", imageFile);
    const upload = await api.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    imageData = {
      url: upload.data.url,
      public_id: upload.data.public_id
    };
  }
  const { data } = await api.put(`/blogs/${id}`, { 
    title, 
    content, 
    tags, 
    images: imageData ? [imageData] : undefined,
    replaceImages: replaceImages.toString()
  });
  return data;
};

export const deleteBlog = (id) => api.delete(`/blogs/${id}`).then((r) => r.data);

export const addComment = (blogId, text) => api.post(`/blogs/${blogId}/comments`, { text }).then((r) => r.data);

export const toggleLike = (blogId) => api.post(`/blogs/${blogId}/like`).then((r) => r.data);

export const fetchUserBlogs = (userId) => api.get(`/users/${userId}/blogs`).then((r) => r.data);

export const fetchAllUsers = () => api.get("/users").then((r) => r.data);

export const adminDeleteUser = (userId) => api.delete(`/admin/users/${userId}`).then((r) => r.data);