import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConnectionRequest } from "@/types/request";

export type { ConnectionRequest };
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
