# 🚀 Deploy Pixora to Vercel

Complete guide to deploy both frontend and backend on Vercel.

## 📋 Prerequisites

- GitHub account with Pixora repository
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas connection string

---

## 🎯 **Method 1: Deploy via Vercel Dashboard** (Recommended)

### **Step 1: Prepare Your Repository**

Your repository is already prepared with:
- ✅ `vercel.json` configuration
- ✅ Backend in `/backend` folder
- ✅ Frontend in `/frontend` folder

### **Step 2: Deploy to Vercel**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub

2. **Import Repository**
   - Click **"Add New..." → "Project"**
   - Find and select **"Pixora"** repository
   - Click **"Import"**

3. **Configure Build Settings**
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install --prefix backend && npm install --prefix frontend`

4. **Add Environment Variables**

Click **"Environment Variables"** and add these:

```
MONGODB_URI
mongodb+srv://alonesurvivor03_db_user:Anuj1234@cluster0.qwgai2u.mongodb.net/pixora?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
pixora_super_secret_jwt_key_2024_change_this

STORAGE_BACKEND
gridfs

NODE_ENV
production
```

**Important**: After deployment, you'll need to add these URLs:
- `FRONTEND_URL` - Your Vercel deployment URL
- `BACKEND_URL` - Your Vercel deployment URL
- `VITE_API_URL` - Your Vercel deployment URL + `/api`

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - Copy your deployment URL (e.g., `https://pixora.vercel.app`)

6. **Update Environment Variables**
   - Go to your project **Settings → Environment Variables**
   - Add/Update:
     ```
     FRONTEND_URL = https://pixora.vercel.app
     BACKEND_URL = https://pixora.vercel.app
     VITE_API_URL = https://pixora.vercel.app/api
     ```
   - Click **"Redeploy"** from the Deployments tab

---

## 🎯 **Method 2: Deploy via Vercel CLI** (Quick)

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**

```bash
vercel login
```

### **Step 3: Deploy from Root Directory**

```bash
cd "/Users/anuj/Documents/traial/test 2"
vercel
```

### **Step 4: Answer Prompts**

```
? Set up and deploy "~/Documents/traial/test 2"? [Y/n] y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] n
? What's your project's name? pixora
? In which directory is your code located? ./
```

### **Step 5: Add Environment Variables via CLI**

```bash
# Add MongoDB URI
vercel env add MONGODB_URI

# Add JWT Secret
vercel env add JWT_SECRET

# Add Storage Backend
vercel env add STORAGE_BACKEND

# Add Node Environment
vercel env add NODE_ENV
```

When prompted, enter the values:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your secret key
- `STORAGE_BACKEND`: `gridfs`
- `NODE_ENV`: `production`

### **Step 6: Deploy to Production**

```bash
vercel --prod
```

### **Step 7: Update URLs**

After getting your deployment URL, add:

```bash
vercel env add FRONTEND_URL
# Enter: https://your-app.vercel.app

vercel env add BACKEND_URL
# Enter: https://your-app.vercel.app

vercel env add VITE_API_URL
# Enter: https://your-app.vercel.app/api
```

Then redeploy:

```bash
vercel --prod
```

---

## 📁 **Project Structure for Vercel**

```
Pixora/
├── backend/
│   ├── server.js           ← Entry point for API
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── dist/               ← Built files served
│   ├── package.json
│   └── ...
├── vercel.json             ← Vercel configuration
└── package.json            ← Root package.json (optional)
```

---

## 🔧 **How Vercel Routes Work**

The `vercel.json` configuration handles routing:

1. **`/api/*`** → Backend API (Express server)
2. **`/f/*`** → Backend file streaming (Express server)
3. **`/*`** → Frontend static files (React app)

Example URLs:
- `https://pixora.vercel.app/` → Frontend landing page
- `https://pixora.vercel.app/api/auth/login` → Backend API
- `https://pixora.vercel.app/f/abc123xyz` → Public file streaming

---

## 🔐 **Environment Variables Reference**

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/pixora` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secret_key_here` |
| `STORAGE_BACKEND` | Storage type | `gridfs` |
| `FRONTEND_URL` | Your app URL | `https://pixora.vercel.app` |
| `BACKEND_URL` | Your app URL (same as frontend) | `https://pixora.vercel.app` |
| `VITE_API_URL` | Frontend API endpoint | `https://pixora.vercel.app/api` |
| `NODE_ENV` | Environment | `production` |

---

## ✅ **Post-Deployment Checklist**

After successful deployment:

- [ ] Visit your Vercel URL
- [ ] Register a new account
- [ ] Login with credentials
- [ ] Upload a test file (JPEG/PNG/PDF)
- [ ] Check storage tracking updates
- [ ] Copy and test a file share link
- [ ] Test file deletion
- [ ] Check Settings page

---

## 🐛 **Common Issues & Fixes**

### **Issue 1: API calls failing**
**Solution**: Check that `VITE_API_URL` is set correctly
```bash
vercel env ls
# Verify VITE_API_URL = https://your-app.vercel.app/api
```

### **Issue 2: CORS errors**
**Solution**: Ensure `FRONTEND_URL` matches your Vercel URL exactly
```bash
vercel env add FRONTEND_URL
# Enter: https://pixora.vercel.app (no trailing slash)
```

### **Issue 3: File uploads failing**
**Solution**: Check MongoDB connection
- Test your `MONGODB_URI` in MongoDB Compass
- Ensure IP whitelist in MongoDB Atlas includes `0.0.0.0/0` for Vercel

### **Issue 4: 404 on refresh**
**Solution**: Already handled by `vercel.json` routing configuration

### **Issue 5: Build fails**
**Solution**: Check build logs
```bash
vercel logs [deployment-url]
```

---

## 🔄 **Updating Your Deployment**

### **Automatic (Git Push)**
```bash
git add .
git commit -m "Update feature"
git push origin main
```
Vercel auto-deploys on every push to `main` branch.

### **Manual (CLI)**
```bash
vercel --prod
```

---

## 📊 **Monitoring Your App**

1. **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
   - View deployment status
   - Check analytics
   - Monitor errors

2. **Logs**:
   ```bash
   vercel logs --follow
   ```

3. **Environment Variables**:
   ```bash
   vercel env ls
   vercel env pull
   ```

---

## 🎉 **Success!**

Your Pixora app should now be live at:
**https://your-project-name.vercel.app**

Share your deployment URL and let users:
- Register accounts
- Upload files
- Share permanent links
- Track storage usage

---

## 📞 **Need Help?**

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- Check GitHub Issues

---

**Made with ❤️ by Anuj Kumar Singh**
