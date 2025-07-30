# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub, Google, or Email
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect React app
6. Click "Deploy"

### Option 2: Deploy via Git
1. Push your code to GitHub
2. Connect repository to Vercel
3. Automatic deployment on every push

### Option 3: Deploy via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 📁 Important Files for Deployment

### API Files (Already Created)
- ✅ `api/hotels.js` - All hotels endpoint
- ✅ `api/recommended_hotels.js` - Recommended hotels
- ✅ `api/best_offer.js` - Best offers
- ✅ `api/hotels/[id].js` - Individual hotel

### Database
- ✅ `booking-db.json` - Main database file
- ✅ `API_BACKUP_NOTES.md` - Backup procedures

## 🔧 Local Development

### Start React App
```bash
npm run dev
```

### Start JSON Server (Backup API)
```bash
npm run api
# or
npm run api:dev
```

### Build for Production
```bash
npm run build
```

## 🚨 Backup Procedures

### If Vercel API Fails:
1. Install JSON Server: `npm install json-server`
2. Start backup server: `npm run api`
3. Update API URL in `src/network/interceptor/ApiUrl.js`:
   ```javascript
   baseURL: "http://localhost:3001"
   ```

### Database Backup
- Always keep `booking-db.json` safe
- Contains all hotel data
- Can be used with JSON Server anytime

## 📊 API Endpoints

### Vercel (Production)
- `/api/hotels` - All hotels
- `/api/recommended_hotels` - Recommended hotels
- `/api/best_offer` - Best offers
- `/api/hotels/[id]` - Specific hotel

### JSON Server (Backup)
- `http://localhost:3001/hotels` - All hotels
- `http://localhost:3001/recommended_hotels` - Recommended hotels
- `http://localhost:3001/best_offer` - Best offers
- `http://localhost:3001/hotels/[id]` - Specific hotel

## ✅ Ready for Deployment

Your app is now ready to deploy to Vercel with:
- ✅ All API endpoints created
- ✅ Database file preserved
- ✅ Backup procedures documented
- ✅ JSON Server ready as fallback 