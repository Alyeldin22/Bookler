import axios from "axios";
export const ApiUrl = axios.create({
    baseURL: "/api",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false
})