import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./userSlice";

export interface ConnectionRequest {
  _id: string;
  fromUserId: User;
  toUserId?: string | User;
  status?: "interested" | "ignored" | "accepted" | "rejected" | string;
  createdAt?: string;
  updatedAt?: string;
}

export type RequestsState = ConnectionRequest[] | null;

const initialState: RequestsState = null;

const requestSlice = createSlice({
  name: "requests",
  initialState: initialState as RequestsState,
  reducers: {
    addRequests: (
      _state,
      action: PayloadAction<ConnectionRequest[]>,
    ): RequestsState => {
      return action.payload;
    },
    removeRequest: (
      state,
      action: PayloadAction<string>,
    ): RequestsState => {
      if (!state) return null;
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
  },
});

export const { addRequests, removeRequest } = requestSlice.actions;

export default requestSlice.reducer;

