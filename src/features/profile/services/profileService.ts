import apiClient from "@/services/api";
import type { User, UserProfileEditPayload } from "@/types/user";
import type { ApiResponse } from "@/types/api";

export const profileService = {
  async editProfile(payload: UserProfileEditPayload): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User> | User>("/profile/edit", payload);
    if (res.data && typeof res.data === "object" && "data" in res.data && res.data.data) {
      return res.data.data as User;
    }
    return res.data as User;
  },
};

export default profileService;
