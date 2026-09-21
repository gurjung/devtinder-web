import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your user object
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  // Add other user fields as needed
}

// State can either be a User or null
type UserState = User | null;

const initialState: UserState = null as UserState;

const userSlice = createSlice({
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
