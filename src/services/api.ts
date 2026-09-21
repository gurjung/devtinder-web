import axios, { type AxiosInstance } from "axios";
import { BASE_URL } from "@/constants/config";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
