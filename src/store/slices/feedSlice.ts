import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./userSlice";

export type FeedState = User[] | null;

const initialState: FeedState = null;

const feedSlice = createSlice({
  name: "feed",
  initialState: initialState as FeedState,
  reducers: {
    addFeed: (_state, action: PayloadAction<User[]>): FeedState => {
      return action.payload;
    },
    removeUserFromFeed: (state, action: PayloadAction<string>): FeedState => {
      if (!state) return null;
      const newFeed = state.filter((user) => user._id !== action.payload);
      return newFeed;
    },
  },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
