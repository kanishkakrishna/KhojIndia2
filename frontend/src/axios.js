// src/axios.js
import axios from "axios";

// Create an instance
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`, // ✅ Updated to deployed backend
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

