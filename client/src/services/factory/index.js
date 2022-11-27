import axios from "axios";
import queryString from "query-string";
import { parse, stringify } from "qs";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + "api",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    encode: parse,
    serialize: stringify,
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
    }

    throw error;
  }
);

export default axiosClient;
