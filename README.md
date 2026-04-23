# 🎬 VideoHub Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

A production-ready **Node.js** backend for a video-sharing and social networking platform — featuring secure authentication, media processing, and rich social interactions via clean RESTful APIs.

</div>

---

## ✨ Features

- 🔐 **User Authentication** — Secure registration & login with dual JWT strategy (access + refresh tokens)
- 🎥 **Video Management** — Upload, metadata handling, and paginated retrieval
- 💬 **Comments** — Full CRUD comment system with pagination
- ❤️ **Likes** — Polymorphic likes for videos, comments, and tweets
- 🐦 **Tweets** — User text posts
- 📋 **Playlists** — User-curated video collections
- 👥 **Subscriptions** — Follow/unfollow relationships between users
- ☁️ **Media Processing** — Two-stage upload pipeline (local temp → Cloudinary)

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication (access + refresh tokens) |
| **Cloudinary** | Media storage & delivery |
| **Multer** | File upload handling |
| **Bcrypt** | Password hashing |
| **mongoose-aggregate-paginate-v2** | Paginated aggregation queries |

---

## 📦 Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# → Edit .env with your credentials (see Environment Setup below)

# 4. Start the server
npm run dev
```

---

## 🔧 Environment Setup

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/project1

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRY=1d
JWT_REFRESH_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ Never commit your `.env` file. Add it to `.gitignore`.

---

## 🌐 API Reference

### 🔑 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users/register` | Register a new user |
| `POST` | `/api/v1/users/login` | Login and receive tokens |
| `POST` | `/api/v1/users/logout` | Logout current user |
| `POST` | `/api/v1/users/refresh-token` | Refresh access token |
| `GET` | `/api/v1/users/me` | Get current user profile |
| `PATCH` | `/api/v1/users/update-account` | Update account details |
| `PATCH` | `/api/v1/users/avatar` | Update avatar |
| `PATCH` | `/api/v1/users/cover-image` | Update cover image |

### 🎥 Videos

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/video/` | Get all videos (paginated) |
| `POST` | `/api/v1/video/` | Upload a new video |
| `GET` | `/api/v1/video/:videoId` | Get video by ID |
| `PATCH` | `/api/v1/video/:videoId` | Update video metadata |
| `DELETE` | `/api/v1/video/:videoId` | Delete a video |
| `PATCH` | `/api/v1/video/toggle/publish/:videoId` | Toggle publish status |

### 💬 Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/comment/:videoId` | Get comments for a video |
| `POST` | `/api/v1/comment/:videoId` | Add a comment |
| `PATCH` | `/api/v1/comment/:commentId` | Update a comment |
| `DELETE` | `/api/v1/comment/:commentId` | Delete a comment |

### ❤️ Likes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/likes/toggle/v/:videoId` | Toggle like on a video |
| `POST` | `/api/v1/likes/toggle/c/:commentId` | Toggle like on a comment |
| `POST` | `/api/v1/likes/toggle/t/:tweetId` | Toggle like on a tweet |
| `GET` | `/api/v1/likes/videos` | Get liked videos |

### 🐦 Tweets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/tweet/` | Create a tweet |
| `GET` | `/api/v1/tweet/user/:userId` | Get user's tweets |
| `PATCH` | `/api/v1/tweet/:tweetId` | Update a tweet |
| `DELETE` | `/api/v1/tweet/:tweetId` | Delete a tweet |

### 📋 Playlists

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/playlist/` | Create a playlist |
| `GET` | `/api/v1/playlist/:playlistId` | Get playlist by ID |
| `PATCH` | `/api/v1/playlist/:playlistId` | Update playlist |
| `DELETE` | `/api/v1/playlist/:playlistId` | Delete playlist |
| `POST` | `/api/v1/playlist/add/:videoId/:playlistId` | Add video to playlist |
| `DELETE` | `/api/v1/playlist/remove/:videoId/:playlistId` | Remove video from playlist |

### 👥 Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/subscriptions/c/:channelId` | Toggle subscription |
| `GET` | `/api/v1/subscriptions/c/:channelId` | Get channel subscribers |
| `GET` | `/api/v1/subscriptions/u/:subscriberId` | Get subscribed channels |

### 📊 Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/dashboard/stats` | Get channel statistics |
| `GET` | `/api/v1/dashboard/videos` | Get channel videos |

---

## 🗄 Database Models

```
User          → Authentication, profile, watch history
Video         → Video metadata with pagination support
Comment       → User comments on videos
Like          → Polymorphic likes (videos / comments / tweets)
Tweet         → User text posts
Playlist      → User-curated video collections
Subscription  → Follow relationships between users
```

All models include `createdAt` and `updatedAt` timestamps automatically.

---

## 🏗 Project Structure

```
src/
├── controllers/        # Route handlers & business logic
├── models/             # Mongoose schemas & models
├── routes/             # Express route definitions
├── middleware/         # Auth, error handling, multer config
├── utils/              # ApiError, ApiResponse, asyncHandler
├── db/                 # MongoDB connection
└── app.js              # Express app configuration
```

---

## 🔒 Authentication Flow

This project uses a **dual-token JWT strategy** for enhanced security:

```
1. Login  →  Access Token (short-lived) + Refresh Token (long-lived, stored in DB)
2. Request  →  Send Access Token in Authorization header
3. Expiry  →  Use Refresh Token to get a new Access Token
4. Logout  →  Refresh Token invalidated in DB
```

---

## 🚀 Running the Application

```bash
# Development (with hot reload via nodemon)
npm run dev

# Production
npm start
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ using Node.js & Express

</div>
