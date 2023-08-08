import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  user: UserStateProps | null;
}

type UserStateProps = {
  uid: string;
  email: string;
  displayName: string;
};

export const userSlice = createSlice({
  name: "user",
  initialState: { user: null } as UserState, // Explicitly type initialState
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { login } = userSlice.actions;
