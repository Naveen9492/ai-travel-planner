import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://ai-travel-planner-ge4v.onrender.com",
});

api.interceptors.request.use(config => {
  const token = Cookies.get("jwt_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;