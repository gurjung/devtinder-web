import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./userSlice";

export type ConnectionsState = User[] | null;

const initialState: ConnectionsState = null;

const connectionSlice = createSlice({
  name: "connection",
  initialState: initialState as ConnectionsState,
  reducers: {
    addConnections: (
      _state,
      action: PayloadAction<User[]>,
    ): ConnectionsState => {
      return action.payload;
    },
    removeConnections: (): ConnectionsState => {
      return null;
    },
  },
});

export const { addConnections, removeConnections } = connectionSlice.actions;

export default connectionSlice.reducer;
