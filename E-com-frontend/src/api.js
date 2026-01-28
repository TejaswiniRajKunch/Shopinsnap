// src/api.js
import axios from "axios";

// Backend base URL
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Set / remove auth token
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

// Load token on refresh
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

export default api;
