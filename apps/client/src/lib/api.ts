import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://jira-clone-j092.onrender.com",
  withCredentials: true, // 🔑 cookie-based auth
});

// Optional global error logging
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);
