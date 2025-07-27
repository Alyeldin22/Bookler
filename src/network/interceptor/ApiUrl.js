import axios from "axios";

export const ApiUrl = axios.create({
    baseURL: "/api", // Using Vite proxy to avoid CORS issues
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false
})

// Request interceptor to log outgoing requests
ApiUrl.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to log responses
ApiUrl.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status || 'Network Error'} ${error.config?.url}`);
    
    // Handle CORS errors specifically
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.warn('⚠️ CORS or Network Error - This might be due to port mismatch. Try refreshing the page.');
    }
    
    return Promise.reject(error);
  }
);