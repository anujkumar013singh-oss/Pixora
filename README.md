# Pixora 🎨

**Your Files. Anywhere.** A modern file hosting platform with shareable links.

![Pixora Banner](https://img.shields.io/badge/Pixora-File%20Hosting-0057FF?style=for-the-badge)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication
- 📤 **File Upload** - Drag & drop JPEG, PNG, and PDF files
- 🔗 **Universal Links** - Generate permanent shareable links
- 📊 **Storage Tracking** - Real-time storage usage monitoring
- 🎨 **Beautiful UI** - Dark theme with smooth animations
- ⚡ **Fast & Secure** - GridFS storage with magic byte validation
- 🌐 **Public Sharing** - Direct file streaming via unique short IDs

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **GSAP** - Advanced scroll animations
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **GridFS** - File storage system
- **JWT** - Secure authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)

### Clone Repository
```bash
git clone https://github.com/anujkumar013singh-oss/Pixora.git
cd Pixora
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
STORAGE_BACKEND=gridfs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001
EOF

# Start backend
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Start frontend
npm run dev
```

The app will be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 🚀 Deployment

### **Quick Deploy to Vercel** (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anujkumar013singh-oss/Pixora)

**Full Guide**: See [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md) for complete step-by-step instructions.

### **Quick Steps:**

1. **Via Vercel Dashboard:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Pixora repository
   - Add environment variables (MongoDB URI, JWT Secret, etc.)
   - Deploy!

2. **Via Vercel CLI:**
   ```bash
   npm install -g vercel
   cd "/Users/anuj/Documents/traial/test 2"
   vercel --prod
   ```

**Environment Variables Needed:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your secret key
- `STORAGE_BACKEND` - Set to `gridfs`
- `FRONTEND_URL` - Your Vercel URL
- `BACKEND_URL` - Your Vercel URL
- `VITE_API_URL` - Your Vercel URL + `/api`

### Alternative: Backend (Render.com)

1. Go to [Render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: pixora-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your secret key
   - `FRONTEND_URL` - Your frontend URL
   - `BACKEND_URL` - Your backend URL (will be provided by Render)
6. Click "Create Web Service"

### Frontend (Vercel/Netlify)

**Vercel:**
```bash
cd frontend
npm install -g vercel
vercel
```

**Netlify:**
```bash
cd frontend
npm run build
# Drag and drop the 'dist' folder to Netlify
```

Update `frontend/src/api.js` with your deployed backend URL.

## 📁 Project Structure

```
Pixora/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB & GridFS config
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── File.js            # File metadata schema
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── files.js           # File CRUD endpoints
│   │   └── public.js          # Public file streaming
│   ├── server.js              # Express app
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React context (Auth)
│   │   ├── pages/             # Route pages
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   └── package.json
│
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pixora
JWT_SECRET=your_super_secret_jwt_key_here
STORAGE_BACKEND=gridfs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001
```

### Frontend
Update `src/api.js`:
```javascript
const api = axios.create({
  baseURL: 'https://your-backend-url.com/api',
  withCredentials: true,
});
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Files (Protected)
- `POST /api/files/upload` - Upload file
- `GET /api/files` - List user's files
- `DELETE /api/files/:id` - Delete file

### Public
- `GET /f/:shortId` - Stream file publicly

## 🎨 Design

- **Colors**: Electric blue (#0057FF) on pure black (#000000)
- **Typography**: Syne (display) + DM Sans (body)
- **Style**: Sharp edges, electric glow effects, uppercase tracking
- **Animations**: GSAP scroll reveals, Framer Motion interactions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Anuj Kumar Singh**
- GitHub: [@anujkumar013singh-oss](https://github.com/anujkumar013singh-oss)

## 🙏 Acknowledgments

- Design inspiration from modern SaaS platforms
- Icons by [Lucide Icons](https://lucide.dev)
- Animations powered by GSAP and Framer Motion

---

<p align="center">Made with ❤️ by Anuj Kumar Singh</p>
