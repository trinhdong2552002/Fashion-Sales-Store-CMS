import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    refreshToken: null,
    authenticated: false,
  },
  reducers: {
    setAuth: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.authenticated = true;
      console.log("setAuth", action.payload);
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.authenticated = false;
    },
    refreshAuth: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.authenticated = action.payload.authenticated;
    },
  },
});

export const { setAuth, clearAuth, refreshAuth } = authSlice.actions;
export const selectAuthAccessToken = (state) => state.auth.accessToken;
export default authSlice.reducer;
