# Blog Frontend

React frontend for the blogging application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create `.env` with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Run:
   ```
   npm start
   ```

Backend expected endpoints (adjust service URLs if different):
- POST /api/auth/register
- POST /api/auth/login
- GET /api/blogs
- GET /api/blogs/:id
- POST /api/blogs
- PUT /api/blogs/:id
- DELETE /api/blogs/:id
- POST /api/blogs/:id/comments
- POST /api/blogs/:id/like
- POST /api/upload (returns { url })
- GET /api/users/:id/blogs
- GET /api/users
- DELETE /api/admin/users/:id