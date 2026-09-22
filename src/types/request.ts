import type { User } from "./user";

export type RequestStatus = "interested" | "ignored" | "accepted" | "rejected";

export interface ConnectionRequest {
  _id: string;
  fromUserId: User;
  toUserId?: string | User;
  status?: RequestStatus | string;
  createdAt?: string;
  updatedAt?: string;
}
