// axios instance for calling your backend
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
  timeout: 5000,
});

export default api;
