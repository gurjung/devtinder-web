import apiClient from "@/services/api";
import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/api";

export interface LoginCredentials {
  emailId: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const res = await apiClient.post<User | ApiResponse<User>>("/login", credentials);
    // Handles both { data: user } and raw user objects
    if (res.data && typeof res.data === "object" && "data" in res.data && res.data.data) {
      return res.data.data as User;
    }
    return res.data as User;
  },

  async signup(credentials: SignupCredentials): Promise<User> {
    const res = await apiClient.post<ApiResponse<User> | User>("/signup", credentials);
    if (res.data && typeof res.data === "object" && "data" in res.data && res.data.data) {
      return res.data.data as User;
    }
    return res.data as User;
  },

  async logout(): Promise<void> {
    await apiClient.post("/logout", {});
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User> | User>("/profile/view");
    if (res.data && typeof res.data === "object" && "data" in res.data && res.data.data) {
      return res.data.data as User;
    }
    return res.data as User;
  },
};

export default authService;
