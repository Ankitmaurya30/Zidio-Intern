# Blogging Platform Backend

A secure and scalable backend for a blogging platform with authentication, CRUD operations, and admin control.

## Features

- JWT-based authentication
- Blog CRUD operations with image uploads
- Like and comment system
- Profile management
- Search and filter functionality
- Admin panel APIs

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Image Storage**: Cloudinary
- **File Upload**: Multer

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create a new blog
- `GET /api/blogs/:id` - Get a single blog
- `PUT /api/blogs/:id` - Update a blog
- `DELETE /api/blogs/:id` - Delete a blog
- `GET /api/blogs/user/:userId` - Get blogs by user

### Likes & Comments
- `PUT /api/blogs/:id/like` - Like/unlike a blog
- `POST /api/blogs/:id/comment` - Add a comment to a blog
- `DELETE /api/blogs/:id/comment/:commentId` - Delete a comment

### Search & Filter
- `GET /api/blogs/search` - Search blogs by keyword
- `GET /api/blogs/filter` - Filter blogs by category or tag

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get a single user
- `PUT /api/admin/users/:id` - Update a user
- `DELETE /api/admin/users/:id` - Delete a user
- `GET /api/admin/blogs` - Get all blogs
- `DELETE /api/admin/blogs/:id` - Delete a blog

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB installed locally or MongoDB Atlas account
- Cloudinary account for image storage

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd blogging-platform
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     NODE_ENV=development
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRE=30d
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

4. Create uploads directory
   ```
   mkdir uploads
   ```

5. Run the server
   ```
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Usage

### Authentication

To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### File Uploads

When creating or updating blogs with images, use form-data with the following fields:
- `title`: Blog title
- `content`: Blog content
- `category`: Blog category
- `tags`: Blog tags (comma-separated)
- `images`: Image files (multiple files allowed)

## Deployment

This backend can be deployed to Render or any other Node.js hosting service.

## License

ISC