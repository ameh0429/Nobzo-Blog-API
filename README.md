# Nobzo Blog REST API

A production-quality RESTful API for a blog platform built with Node.js, Express, and MongoDB. This API demonstrates strong backend fundamentals including authentication, authorization, data relationships, filtering, pagination, and clean architecture.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Secure user registration and login with bcrypt password hashing
- **Blog Post Management**: Full CRUD operations with soft delete functionality
- **Advanced Filtering**: Search, pagination, tag filtering, and multi-parameter queries
- **Data Relationships**: Mongoose references between Users and Posts
- **Slug Generation**: Automatic URL-friendly slug creation from post titles
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Clean Architecture**: Separation of concerns with controllers, services, and models

## Project Structure

```
Nobzo-Blog-API/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication request handlers
│   └── postController.js    # Post request handlers
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Centralized error handling
├── models/
│   ├── User.js              # User schema and model
│   └── Post.js              # Post schema and model
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   └── postRoutes.js        # Post routes
├── services/
│   ├── authService.js       # Authentication business logic
│   └── postService.js       # Post business logic
├── utils/
│   ├── errors.js            # Custom error classes
│   └── jwt.js               # JWT utility functions
├── validators/
│   └── index.js             # Input validation rules
├── app.js                   # Server entry point             
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (ESM modules)
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Slug Generation**: slugify

## Prerequisites

- Node.js
- MongoDB
- npm


##  Installation & Setup

 - **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-api
   ```

 - **Install dependencies**
   ```bash
   npm install
   ```

 - **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blog-api
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

 - **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   ```

 - **Run the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

##  API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John David",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John David",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John David",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Posts

#### Create Post (Authenticated)
```http
POST /api/posts
Authorization: Bearer 
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "status": "published",
  "tags": ["technology", "nodejs"]
}
```

**Response (201)**:
```json
{
  "status": "success",
  "data": {
    "post": {
      "_id": "65abc456...",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "content": "This is the content of my blog post...",
      "author": {
        "_id": "65abc123...",
        "name": "John David",
        "email": "john@example.com"
      },
      "status": "published",
      "tags": ["technology", "nodejs"],
      "createdAt": "2024-01-15T10:45:00.000Z",
      "updatedAt": "2024-01-15T10:45:00.000Z"
    }
  }
}
```

#### Get All Posts (Public/Authenticated)
```http
GET /api/posts?page=1&limit=10&search=nodejs&tag=technology&status=published
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in title and content
- `tag` (optional): Filter by tag
- `author` (optional): Filter by author ID
- `status` (optional): Filter by status (authenticated users only)

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "posts": [
      {
        "_id": "65abc456...",
        "title": "My First Blog Post",
        "slug": "my-first-blog-post",
        "content": "This is the content...",
        "author": {
          "_id": "65abc123...",
          "name": "John David",
          "email": "john@example.com"
        },
        "status": "published",
        "tags": ["technology", "nodejs"],
        "createdAt": "2024-01-15T10:45:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### Get Single Post by Slug
```http
GET /api/posts/my-first-blog-post
```

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "post": {
      "_id": "65abc456...",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "content": "This is the content of my blog post...",
      "author": {
        "_id": "65abc123...",
        "name": "John David",
        "email": "john@example.com"
      },
      "status": "published",
      "tags": ["technology", "nodejs"],
      "createdAt": "2024-01-15T10:45:00.000Z",
      "updatedAt": "2024-01-15T10:45:00.000Z"
    }
  }
}
```

#### Update Post (Author Only)
```http
PUT /api/posts/65abc456...
Authorization: Bearer 
Content-Type: application/json

{
  "title": "Updated Blog Post Title",
  "status": "published"
}
```

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "post": {
      "_id": "65abc456...",
      "title": "Updated Blog Post Title",
      "slug": "updated-blog-post-title",
      "content": "This is the content...",
      "status": "published",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

#### Delete Post (Author Only - Soft Delete)
```http
DELETE /api/posts/65abc456...
Authorization: Bearer 
```

**Response (204)**: No content

### Health Check
```http
GET /health
```

**Response (200)**:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

##  Authorization Rules

1. **Public Access**:
   - View published posts only
   - Cannot see draft posts
   - No filtering by status

2. **Authenticated Users**:
   - Can create posts (draft or published)
   - Can filter posts by status
   - Can only see their own draft posts
   - Can only update/delete their own posts

3. **Post Visibility**:
   - Published posts: Visible to everyone
   - Draft posts: Only visible to the author

##  Key Design Decisions

### 1. **Layered Architecture**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic and authorization
- **Models**: Define data schemas and database operations
- **Middleware**: Handle cross-cutting concerns (auth, errors)

This separation ensures testability, maintainability, and single responsibility.

### 2. **Soft Delete Implementation**
Posts are never permanently deleted. Instead, a `deletedAt` timestamp is set. This allows:
- Data recovery if needed
- Audit trails

### 3. **Slug Generation**
Slugs are automatically generated from titles using the `slugify` library with:
- Automatic conflict resolution (appends counter)
- URL-safe characters only
- Lowercase normalization

### 4. **Authorization in Service Layer**
Authorization logic lives in services, not middleware, because:
- Authorization often depends on database queries
- Complex rules require context from business logic
- Keeps middleware focused on authentication only

### 5. **Optional Authentication**
The `GET /api/posts` endpoint uses `optionalAuth` middleware to:
- Allow public access to published posts
- Enable authenticated users to filter by status
- Provide different data based on authentication state

### 6. **Centralized Error Handling**
All errors flow through a single error handler that:
- Formats errors consistently
- Maps Mongoose errors to HTTP status codes
- Hides stack traces in production
- Provides detailed errors in development

### 7. **Text Search Indexing**
MongoDB text indexes on `title` and `content` enable:
- Fast full-text search
- Relevance scoring
- Multi-word search support

### 8. **Compound Indexes**
Strategic compound indexes optimize common query patterns:
- `{ status, deletedAt, createdAt }` for listing posts
- `{ author, status, deletedAt }` for user's posts
- `{ tags, status, deletedAt }` for tag filtering

##  Testing the API

You can test the API using curl, Postman, or any HTTP client.

### Example Flow:

1. **Register a user**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
   ```

2. **Login and save token**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

3. **Create a post**
   ```bash
   curl -X POST http://localhost:5000/api/posts \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"title":"My Post","content":"Post content here","status":"published","tags":["tech"]}'
   ```

4. **Get all posts**
   ```bash
   curl http://localhost:5000/api/posts
   ```

##  Security Best Practices

- Passwords are hashed using bcrypt with salt rounds
- JWT tokens expire after 7 days (configurable)
- Sensitive data (passwords) excluded from JSON responses
- Input validation on all endpoints
- MongoDB injection protection via Mongoose
- Rate limiting recommended for production (not included)


## Future Improvements

   - Add helmet.js for security headers
   - Implement rate limiting (express-rate-limit)
   - Add CORS configuration
   - Enable HTTPS only
   - Add logging (Winston, Morgan)
   - Set up error tracking (Sentry)
   - Monitor database performance
   - Add Redis for caching