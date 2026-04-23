# 🚀 Backend System (Node.js + Express + MongoDB)

A scalable and secure RESTful backend built with Node.js and Express, featuring authentication, user management, and production-ready architecture.

---

## 📌 Features

- 🔐 JWT Authentication (Access & Refresh Tokens)  
- 👤 User Registration, Login & Logout  
- 🔄 Token Refresh Mechanism  
- 🔑 Password Update Functionality  
- 🖼️ Avatar & Cover Image Upload  
- 🛡️ Protected Routes via Middleware  
- ⚡ Centralized Error Handling  
- 📦 Modular MVC Architecture  

---

## 🏗️ Tech Stack

- Backend: Node.js, Express.js  
- Database: MongoDB + Mongoose  
- Authentication: JSON Web Tokens (JWT)  
- Security: bcrypt, HTTP-only cookies  
- File Uploads: Multer  
- Testing: Postman  

---

## 📂 Project Structure

```
backend/
│── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│
│── .env
│── package.json
│── server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/krgaurav7/backend.git
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### 4. Run the server
```bash
npm run dev
```

Server runs at:
```
http://localhost:5000
```

---

## 🔑 API Overview

### Auth
- POST /api/v1/users/register  
- POST /api/v1/users/login  
- POST /api/v1/users/logout  
- POST /api/v1/users/refresh-token  

### User
- GET /api/v1/users/me  
- PATCH /api/v1/users/update  
- PATCH /api/v1/users/avatar  
- PATCH /api/v1/users/cover  

---

## 🔐 Authentication Flow

- Login → Access Token + Refresh Token  
- Access token used for API calls  
- Refresh token used to regenerate access token  
- Tokens stored securely (HTTP-only cookies)  

---

## 🚀 Deployment

- Render  
- Railway  

---

## 🛡️ Security

- Password hashing using bcrypt  
- Token-based authentication  
- Protected routes via middleware  
- Environment variable management
  
---

## 👨‍💻 Author

Gaurav Raj  
https://github.com/krgaurav7  

---

## ⭐ Show your support

Give a ⭐ if you like this project!
