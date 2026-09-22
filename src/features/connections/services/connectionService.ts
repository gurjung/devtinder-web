import apiClient from "@/services/api";
import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/api";

export const connectionService = {
  async getConnections(): Promise<User[]> {
    const res = await apiClient.get<ApiResponse<User[]> | User[]>("/user/connections");
    if (res.data && typeof res.data === "object" && "data" in res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },
};

export default connectionService;
