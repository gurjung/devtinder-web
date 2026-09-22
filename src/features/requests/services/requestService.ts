import apiClient from "@/services/api";
import type { ConnectionRequest, RequestStatus } from "@/types/request";
import type { ApiResponse } from "@/types/api";

export const requestService = {
  async getReceivedRequests(): Promise<ConnectionRequest[]> {
    const res = await apiClient.get<ApiResponse<ConnectionRequest[]> | ConnectionRequest[]>(
      "/user/requests/received",
    );
    if (res.data && typeof res.data === "object" && "data" in res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  async reviewRequest(
    status: RequestStatus | "accepted" | "rejected",
    requestId: string,
  ): Promise<void> {
    await apiClient.post(`/request/review/${status}/${requestId}`, {});
  },

  async sendConnectionRequest(
    status: RequestStatus | "interested" | "ignored",
    userId: string,
  ): Promise<void> {
    await apiClient.post(`/request/send/${status}/${userId}`, {});
  },
};

export default requestService;
