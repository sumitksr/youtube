# VideoTube Backend (YouTube-style API)

Node.js + Express + MongoDB backend for a YouTube-style app. Includes user authentication (JWT + refresh tokens), profile management (avatar/cover image), and user channel profile aggregation.

## Features

- **Auth**: Register / login / logout
- **JWT security**: Access + refresh tokens (httpOnly cookies + token response)
- **User profile**: Update name/email, change password
- **Uploads**: Avatar & cover image upload via **Multer** → **Cloudinary**
- **Channel profile**: Subscriber/subscription counts via MongoDB aggregation
- **Watch history**: Returns user watch history with video owner details

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Server**: Express `5.x`
- **Database**: MongoDB + Mongoose
- **Auth**: JSON Web Tokens (`jsonwebtoken`)
- **Uploads**: `multer`, Cloudinary SDK
- **Utilities**: Cookie parsing (`cookie-parser`), CORS (`cors`)

## Project Structure

```
src/
  config/
    cloudinary.js      # Cloudinary config + upload/delete helpers
    database.js        # MongoDB connection
  controllers/
    user.js            # User/auth endpoints
  middlewares/
    auth.js            # JWT verification middleware
    multer.js          # Multer disk storage (public/temp)
  models/
    user.js            # User schema + auth helpers
    video.js           # Video schema
    subscription.js    # Subscription schema (WIP)
  routes/
    user.js            # /api/v1/users routes
  utils/
    ApiError.js
    ApiResponse.js
    asyncHandler.js
public/
  temp/                # Multer temporary upload folder
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create a `.env` file (this repo includes an example):

```bash
copy .env.example .env
```

Required variables (see `.env.example`):

- `PORT`
- `CORS_ORIGIN`
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRES_IN`
- `Iteration`

### 3) Run the server

Development (recommended):

```bash
npm run dev
```

Production:

```bash
npm start
```

Server starts from `src/index.js` and mounts routes under:

- `http://localhost:<PORT>/api/v1/users`

## API Reference

Base path: `/api/v1/users`

### Auth & User

#### Register
- **POST** `/register`
- **Content-Type**: `multipart/form-data`
- **Form fields**:
  - `fullName` (string, required)
  - `email` (string, required)
  - `username` (string, required)
  - `password` (string, required)
  - `avatar` (file, required)
  - `coverImage` (file, optional)

#### Login
- **POST** `/login`
- **Content-Type**: `application/json` (or `multipart/form-data` without files)
- **Body**:
  - `email` (string, optional)
  - `username` (string, optional)
  - `password` (string, required)

Returns `accessToken` and `refreshToken` in JSON, and also attempts to set them as cookies.

#### Logout (Protected)
- **POST** `/logout`

#### Refresh access token
- **POST** `/refresh-token`
- Send refresh token using either:
  - Cookie: `refreshToken`, or
  - Body: `{ "refreshToken": "..." }`

#### Change password (Protected)
- **POST** `/change-password`
- **Body**:
  - `currentPassword`
  - `newPassword`
  - `confirmPassword`

#### Get current user (Protected)
- **POST** `/current-user`

#### Update profile (Protected)
- **POST** `/update-profile`
- **Body**:
  - `fullName`
  - `email`

#### Update cover image (Protected)
- **POST** `/update-cover-image`
- **Content-Type**: `multipart/form-data`
- **File field**: `coverImage`

#### Update avatar (Protected)
- **POST** `/update-avatar`
- **Content-Type**: `multipart/form-data`
- **File field**: `avatar`

#### Channel profile (Protected)
- **GET** `/channel/:username`

#### Watch history (Protected)
- **GET** `/history`

## Authentication Notes

- Protected routes require a valid access token.
- The middleware accepts the token from either:
  - Cookie: `accessToken`, or
  - Header: `Authorization: Bearer <token>`

Important for local dev:
- Cookies are currently set with `secure: true`, which means browsers won’t store them over plain `http://localhost`.
- Workaround: use the returned tokens from the login response and pass them via the `Authorization` header during local development.

## Response Format

Most successful responses use a consistent wrapper:

- `statusCode`
- `data`
- `message`
- `success`


