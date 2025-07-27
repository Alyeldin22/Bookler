import { ApiUrl } from "../network/interceptor/ApiUrl";

// API Service for Booking App
export const apiService = {
  // Get all hotels
  getAllHotels: async () => {
    try {
      const response = await ApiUrl.get("/hotels");
      return response.data;
    } catch (error) {
      console.error("Error fetching all hotels:", error);
      throw error;
    }
  },

  // Get recommended hotels
  getRecommendedHotels: async () => {
    try {
      const response = await ApiUrl.get("/recommended_hotels");
      return response.data;
    } catch (error) {
      console.error("Error fetching recommended hotels:", error);
      throw error;
    }
  },

  // Get best offers
  getBestOffers: async () => {
    try {
      const response = await ApiUrl.get("/best_offer");
      return response.data;
    } catch (error) {
      console.error("Error fetching best offers:", error);
      throw error;
    }
  },

  // Get hotel by ID
  getHotelById: async (id) => {
    try {
      const response = await ApiUrl.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotel with ID ${id}:`, error);
      throw error;
    }
  },

  // Get all available endpoints (for discovery)
  getAllEndpoints: async () => {
    try {
      // Try to fetch all known endpoints
      const endpoints = [
        { name: "Hotels", endpoint: "/hotels" },
        { name: "Recommended Hotels", endpoint: "/recommended_hotels" },
        { name: "Best Offers", endpoint: "/best_offer" },
        { name: "API Info", endpoint: "/" },
        { name: "Health Check", endpoint: "/health" },
        { name: "API Documentation", endpoint: "/docs" },
        { name: "API Status", endpoint: "/status" }
      ];

      const results = {};

      for (const endpoint of endpoints) {
        try {
          const response = await ApiUrl.get(endpoint.endpoint);
          results[endpoint.name] = {
            status: "success",
            data: response.data,
            statusCode: response.status
          };
        } catch (error) {
          results[endpoint.name] = {
            status: "error",
            error: error.message,
            statusCode: error.response?.status || "unknown"
          };
        }
      }

      return results;
    } catch (error) {
      console.error("Error fetching all endpoints:", error);
      throw error;
    }
  },

  // Search hotels with filters
  searchHotels: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.query) params.append("q", filters.query);
      if (filters.country) params.append("country", filters.country);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.rating) params.append("rating", filters.rating);
      if (filters.amenities) params.append("amenities", filters.amenities.join(","));
      
      const response = await ApiUrl.get(`/hotels?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error searching hotels:", error);
      throw error;
    }
  },

  // Get API statistics
  getApiStats: async () => {
    try {
      const stats = {
        totalHotels: 0,
        totalRecommended: 0,
        totalOffers: 0,
        apiStatus: "unknown"
      };

      // Get total hotels
      try {
        const hotelsResponse = await ApiUrl.get("/hotels");
        stats.totalHotels = Array.isArray(hotelsResponse.data) ? hotelsResponse.data.length : 0;
      } catch (error) {
        console.warn("Could not fetch hotels count:", error.message);
      }

      // Get total recommended hotels
      try {
        const recommendedResponse = await ApiUrl.get("/recommended_hotels");
        stats.totalRecommended = Array.isArray(recommendedResponse.data) ? recommendedResponse.data.length : 0;
      } catch (error) {
        console.warn("Could not fetch recommended hotels count:", error.message);
      }

      // Get total offers
      try {
        const offersResponse = await ApiUrl.get("/best_offer");
        stats.totalOffers = Array.isArray(offersResponse.data) ? offersResponse.data.length : 0;
      } catch (error) {
        console.warn("Could not fetch offers count:", error.message);
      }

      // Check API status
      try {
        await ApiUrl.get("/");
        stats.apiStatus = "online";
      } catch (error) {
        stats.apiStatus = "offline";
      }

      return stats;
    } catch (error) {
      console.error("Error getting API stats:", error);
      throw error;
    }
  }
};

// Utility function to fetch all data at once
export const fetchAllData = async () => {
  try {
    console.log("🔄 Fetching all API data...");
    
    const [hotels, recommended, offers, stats] = await Promise.allSettled([
      apiService.getAllHotels(),
      apiService.getRecommendedHotels(),
      apiService.getBestOffers(),
      apiService.getApiStats()
    ]);

    const results = {
      hotels: hotels.status === 'fulfilled' ? hotels.value : null,
      recommended: recommended.status === 'fulfilled' ? recommended.value : null,
      offers: offers.status === 'fulfilled' ? offers.value : null,
      stats: stats.status === 'fulfilled' ? stats.value : null,
      errors: []
    };

    // Collect any errors
    [hotels, recommended, offers, stats].forEach((result, index) => {
      if (result.status === 'rejected') {
        const endpointNames = ['hotels', 'recommended', 'offers', 'stats'];
        results.errors.push({
          endpoint: endpointNames[index],
          error: result.reason.message
        });
      }
    });

    console.log("✅ All API data fetched successfully!");
    console.log("📊 API Statistics:", results.stats);
    console.log("🏨 Total Hotels:", results.hotels?.length || 0);
    console.log("⭐ Recommended Hotels:", results.recommended?.length || 0);
    console.log("🎯 Best Offers:", results.offers?.length || 0);
    
    if (results.errors.length > 0) {
      console.warn("⚠️ Some endpoints failed:", results.errors);
    }

    return results;
  } catch (error) {
    console.error("❌ Error fetching all data:", error);
    throw error;
  }
};

export default apiService; 