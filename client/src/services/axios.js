import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // for sending cookies
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
