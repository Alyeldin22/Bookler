# 🔌 API Testing Guide for Booking App

This guide shows you how to test all available APIs in your Booking App.

## 🚀 Quick Start

### Method 1: Web Interface
1. Open your app at `http://localhost:5173/`
2. Navigate to `http://localhost:5173/api-test`
3. Use the interactive dashboard to test APIs

### Method 2: Browser Console
1. Open your app in the browser
2. Open Developer Tools (F12)
3. In the Console tab, run: `runApiTests()`

## 📋 Available APIs

### Base URL
```
https://booking-app-db.vercel.app
```

### Endpoints

| Endpoint | Method | Description | Example |
|----------|--------|-------------|---------|
| `/hotels` | GET | Get all hotels | `GET /hotels` |
| `/hotels/:id` | GET | Get hotel by ID | `GET /hotels/1` |
| `/recommended_hotels` | GET | Get recommended hotels | `GET /recommended_hotels` |
| `/best_offer` | GET | Get best offers | `GET /best_offer` |

## 🛠️ API Service Methods

### Individual API Calls

```javascript
// Get all hotels
const hotels = await apiService.getAllHotels();

// Get recommended hotels
const recommended = await apiService.getRecommendedHotels();

// Get best offers
const offers = await apiService.getBestOffers();

// Get hotel by ID
const hotel = await apiService.getHotelById(1);

// Get API statistics
const stats = await apiService.getApiStats();

// Test all endpoints
const endpoints = await apiService.getAllEndpoints();

// Search hotels with filters
const searchResults = await apiService.searchHotels({
  query: "luxury",
  country: "US",
  minPrice: 100,
  maxPrice: 500,
  rating: 4,
  amenities: ["wifi", "pool"]
});
```

### Fetch All Data at Once

```javascript
// Fetch all data simultaneously
const allData = await fetchAllData();

// Results include:
// - allData.hotels: Array of all hotels
// - allData.recommended: Array of recommended hotels
// - allData.offers: Array of best offers
// - allData.stats: API statistics
// - allData.errors: Any errors encountered
```

## 🧪 Testing Commands

### Console Commands (Available in Browser)

```javascript
// Run all API tests
runApiTests()

// Access individual methods
apiService.getAllHotels()
apiService.getRecommendedHotels()
apiService.getBestOffers()
apiService.getApiStats()
apiService.getAllEndpoints()
```

### Expected Output

When you run `runApiTests()`, you should see:

```
🚀 Starting API Tests...
==================================================
📊 Testing API Statistics...
✅ API Stats: { totalHotels: 10, totalRecommended: 5, totalOffers: 3, apiStatus: "online" }
------------------------------
🏨 Testing Hotels Endpoint...
✅ Found 10 hotels
Sample hotel: { id: 1, name: "Luxury Hotel", ... }
------------------------------
⭐ Testing Recommended Hotels...
✅ Found 5 recommended hotels
Sample recommended: { id: 1, name: "Premium Resort", ... }
------------------------------
🎯 Testing Best Offers...
✅ Found 3 best offers
Sample offer: { id: 1, location: "Paris", ... }
------------------------------
🏢 Testing Specific Hotel...
✅ Hotel 1 details: Luxury Hotel
------------------------------
🔍 Testing All Endpoints...
✅ Endpoint test results:
✅ Hotels: 200
✅ Recommended Hotels: 200
✅ Best Offers: 200
❌ API Info: 404
❌ Health Check: 404
❌ API Documentation: 404
❌ API Status: 404
------------------------------
🔄 Testing Fetch All Data...
✅ All data fetched successfully!
📈 Summary: 10 hotels, 5 recommended, 3 offers
==================================================
🎉 All API tests completed successfully!
```

## 📊 API Statistics

The API statistics include:

- **totalHotels**: Number of available hotels
- **totalRecommended**: Number of recommended hotels
- **totalOffers**: Number of best offers
- **apiStatus**: "online" or "offline"

## 🔍 Error Handling

The API service includes comprehensive error handling:

- Network errors are caught and logged
- Failed endpoints are reported with status codes
- Graceful degradation when some endpoints fail
- Detailed error messages for debugging

## 📱 Web Interface Features

The API testing dashboard (`/api-test`) provides:

- **Interactive Buttons**: Test different API functions
- **Real-time Results**: See API responses immediately
- **Statistics Display**: Visual representation of API data
- **Error Reporting**: Clear error messages and status
- **Data Preview**: Sample data from each endpoint
- **API Documentation**: List of available endpoints

## 🎯 Use Cases

### For Developers
- Test API connectivity
- Verify data structure
- Debug API issues
- Monitor API performance

### For Testing
- Automated API testing
- Data validation
- Endpoint discovery
- Performance benchmarking

### For Monitoring
- API health checks
- Data availability monitoring
- Error tracking
- Usage statistics

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure you're accessing from the correct domain
2. **Network Errors**: Check your internet connection
3. **404 Errors**: Some endpoints may not exist (normal)
4. **Timeout Errors**: API might be slow, try again

### Debug Commands

```javascript
// Check API status
apiService.getApiStats()

// Test specific endpoint
apiService.getAllEndpoints()

// Check for errors
console.log('API Errors:', allData.errors)
```

## 📈 Performance Tips

- Use `fetchAllData()` for bulk operations
- Cache results when possible
- Handle errors gracefully
- Monitor API response times

---

**Happy Testing! 🎉**

For more information, check the browser console for additional debugging tools. 