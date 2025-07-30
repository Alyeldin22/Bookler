# API Backup & Deployment Notes

## Current API Setup

### JSON Server API
- **Database**: `booking-db.json`
- **Package**: `json-server` (npm package)
- **Deployment**: Vercel serverless functions

### Data Structure
The `booking-db.json` contains:
- `hotels` - Array of all hotels
- `recommended_hotels` - Array of recommended hotels
- Additional data structures as needed

### Vercel Serverless Functions
Created API endpoints:
- `/api/hotels` - Returns all hotels
- `/api/recommended_hotels` - Returns recommended hotels  
- `/api/best_offer` - Returns top 10 best offers
- `/api/hotels/[id]` - Returns specific hotel by ID

## Backup Procedures

### If API Stops Working:

1. **Install JSON Server**:
   ```bash
   npm install json-server
   ```

2. **Start Local Server**:
   ```bash
   npx json-server --watch booking-db.json --port 3001
   ```

3. **Update API URLs**:
   - Change from `/api/` to `http://localhost:3001/`
   - Update `src/network/interceptor/ApiUrl.js`

### Database File
- **File**: `booking-db.json`
- **Location**: Project root
- **Backup**: Always keep a copy of this file
- **Size**: Contains comprehensive hotel data

### JSON Server Commands
```bash
# Install
npm install json-server

# Start server
npx json-server --watch booking-db.json --port 3001

# Start with custom routes
npx json-server --watch booking-db.json --port 3001 --routes routes.json

# Start with middleware
npx json-server --watch booking-db.json --port 3001 --middlewares ./middleware.js
```

### Vercel Deployment
- ✅ Serverless functions in `/api/` folder
- ✅ Uses `booking-db.json` as data source
- ✅ Automatic deployment on Git push

## Important Notes
- Always backup `booking-db.json` before major changes
- JSON Server is for development/backup only
- Vercel serverless functions are for production
- Database structure should remain consistent between both setups 