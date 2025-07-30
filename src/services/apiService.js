import { ApiUrl } from "../network/interceptor/ApiUrl";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(firebaseAuth, provider);
  return result.user;
};

export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(firebaseAuth, provider);
  return result.user;
};


export const apiService = {

  getAllHotels: async () => {
    try {
      const response = await ApiUrl.get("/hotels");
      return response.data;
    } catch (error) {
      console.error("Error fetching all hotels:", error);
      throw error;
    }
  },


  getRecommendedHotels: async () => {
    try {
      const response = await ApiUrl.get("/recommended_hotels");
      return response.data;
    } catch (error) {
      console.error("Error fetching recommended hotels:", error);
      throw error;
    }
  },


  getBestOffers: async () => {
    try {
      const response = await ApiUrl.get("/best_offer");
      return response.data;
    } catch (error) {
      console.error("Error fetching best offers:", error);
      throw error;
    }
  },


  getHotelById: async (id) => {
    try {
      const response = await ApiUrl.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotel with ID ${id}:`, error);
      throw error;
    }
  },


  getAllEndpoints: async () => {
    try {
      
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


  getApiStats: async () => {
    try {
      const stats = {
        totalHotels: 0,
        totalRecommended: 0,
        totalOffers: 0,
        apiStatus: "unknown"
      };

    
      try {
        const hotelsResponse = await ApiUrl.get("/hotels");
        stats.totalHotels = Array.isArray(hotelsResponse.data) ? hotelsResponse.data.length : 0;
      } catch (error) {
        console.warn("Could not fetch hotels count:", error.message);
      }

      
      try {
        const recommendedResponse = await ApiUrl.get("/recommended_hotels");
        stats.totalRecommended = Array.isArray(recommendedResponse.data) ? recommendedResponse.data.length : 0;
      } catch (error) {
        console.warn("Could not fetch recommended hotels count:", error.message);
      }

      
      try {
        const offersResponse = await ApiUrl.get("/best_offer");
        stats.totalOffers = Array.isArray(offersResponse.data) ? offersResponse.data.length : 0;
      } catch (error) {
        console.warn("Could not fetch offers count:", error.message);
      }

    
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