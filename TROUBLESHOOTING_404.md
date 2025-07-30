# 🔧 Troubleshooting 404 Errors

## Problem: "Failed to load resource: the server responded with a status of 404"

### Root Cause
Your React app is trying to call API endpoints that don't exist in the current environment.

## 🚀 Solutions

### Solution 1: Use JSON Server for Local Development

1. **Start JSON Server:**
   ```bash
   npm run api
   ```

2. **Start React App:**
   ```bash
   npm run dev
   ```

3. **Test API:**
   ```bash
   node test-api.js
   ```

### Solution 2: Deploy to Vercel (Production)

1. **Deploy to Vercel:**
   ```bash
   vercel
   ```

2. **Your API endpoints will be available at:**
   - `https://your-app.vercel.app/api/hotels`
   - `https://your-app.vercel.app/api/recommended_hotels`
   - `https://your-app.vercel.app/api/best_offer`

### Solution 3: Manual API Testing

Test your endpoints manually:

```bash
# Test hotels endpoint
curl http://localhost:3001/hotels

# Test recommended hotels
curl http://localhost:3001/recommended_hotels

# Test specific hotel
curl http://localhost:3001/hotels/marriott_marquis_sf
```

## 🔍 Debug Steps

### 1. Check if JSON Server is Running
```bash
npm run api
```
You should see:
```
  \{^_^}/ hi!

  Loading booking-db.json
  Done

  Resources
  http://localhost:3001/hotels
  http://localhost:3001/recommended_hotels

  Home
  http://localhost:3001
```

### 2. Check Browser Console
Open Developer Tools (F12) and look for:
- Network tab: See which requests are failing
- Console tab: Look for error messages

### 3. Verify API Configuration
Check `src/network/interceptor/ApiUrl.js`:
```javascript
const baseURL = isDevelopment && isLocalhost 
  ? "http://localhost:3001" 
  : "/api";
```

## 🎯 Quick Fix

### For Immediate Testing:
1. **Terminal 1:**
   ```bash
   npm run api
   ```

2. **Terminal 2:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   - Go to `http://localhost:5173`
   - Check console for errors
   - API calls should now work

### For Production:
1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Your app will use Vercel's serverless functions**

## ✅ Expected Results

After fixing:
- ✅ No more 404 errors
- ✅ Hotels load properly
- ✅ Recommended hotels display
- ✅ Hotel details work
- ✅ Search functionality works

## 🚨 Common Issues

### Issue 1: JSON Server not starting
**Solution:** Check if port 3001 is available
```bash
# Kill any process on port 3001
npx kill-port 3001
npm run api
```

### Issue 2: CORS errors
**Solution:** JSON Server handles CORS automatically

### Issue 3: Database not found
**Solution:** Ensure `booking-db.json` exists in project root

## 📞 Need Help?

If you're still getting 404 errors:
1. Check if JSON Server is running on port 3001
2. Verify `booking-db.json` exists
3. Check browser console for specific error messages
4. Try the test script: `node test-api.js` 