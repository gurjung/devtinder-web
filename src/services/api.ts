import axios, { type AxiosInstance } from "axios";
import { BASE_URL } from "@/constants/config";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status || error.status;
    const requestUrl = error.config?.url || "";
    const isAuthEndpoint = requestUrl.includes("/login") || requestUrl.includes("/signup");

    if (status === 401 && !isAuthEndpoint) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
