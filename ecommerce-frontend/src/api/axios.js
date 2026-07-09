import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Attach CSRF token from cookie to every mutating request
api.interceptors.request.use((config) => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (match) config.headers["X-XSRF-TOKEN"] = decodeURIComponent(match[1]);
  return config;
});

export default api;
