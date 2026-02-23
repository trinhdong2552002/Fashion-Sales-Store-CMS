import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    authenticated: false,
    email: null,
    roles: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.authenticated = true;
      state.email = action.payload.email;
      state.roles = action.payload.roles;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.authenticated = false;
      state.email = null;
      state.roles = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
