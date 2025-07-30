import axios from "axios";

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const baseURL = isDevelopment && isLocalhost 
  ? "http://localhost:3001" 
  : "/api";

export const ApiUrl = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false
})