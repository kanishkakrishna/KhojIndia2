// src/axios.js
import axios from "axios";

// Create an instance
const API = axios.create({
  baseURL: "http://localhost:9000/api",
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
