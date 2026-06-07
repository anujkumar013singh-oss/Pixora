# Pixora Backend

Backend server for Pixora file hosting platform.

## Features

- JWT Authentication
- File Upload with GridFS (MongoDB)
- Public file streaming
- Storage usage tracking
- Magic byte file validation
- Secure file handling

## Tech Stack

- Node.js + Express
- MongoDB + GridFS
- JWT Authentication
- Multer for file uploads
- Bcrypt for password hashing

## Environment Variables

Create a `.env` file with:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STORAGE_BACKEND=gridfs
FRONTEND_URL=https://your-frontend-url.com
BACKEND_URL=https://your-backend-url.com
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user data

### Files (Protected)
- `POST /api/files/upload` - Upload file
- `GET /api/files` - List user's files
- `DELETE /api/files/:id` - Delete file

### Public
- `GET /f/:shortId` - Stream file publicly

## Deployment

This backend can be deployed to:
- Render.com
- Railway.app
- Fly.io
- Heroku
- DigitalOcean App Platform
