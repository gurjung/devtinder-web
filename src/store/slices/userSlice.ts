import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";

export type { User };
export type UserState = User | null;

const initialState: UserState = null as UserState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (_state, action: PayloadAction<User>): UserState => {
      return action.payload;
    },
    removeUser: (): UserState => {
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
