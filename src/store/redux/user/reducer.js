import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/services/api/auth";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Đồng bộ khi đăng nhập thành công
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = {
          code: action.payload.code,
          message: action.payload.message,
          result: {
            accessToken: action.payload.result.accessToken,
            refreshToken: action.payload.result.refreshToken,
            authenticated: action.payload.result.authenticated,
            email: action.payload.result.email,
          },
        };
      }
    );

    // Đồng bộ khi lấy thông tin người dùng hiện tại
    builder.addMatcher(
      authApi.endpoints.getMyInfo.matchFulfilled,
      (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            code: action.payload.code,
            message: action.payload.message,
            result: {
              ...state.user.result,
              id: action.payload.result?.id,
              name: action.payload.result?.name,
              email: action.payload.result?.email,
              roles: action.payload.result?.roles,
            },
          };
        } else {
          state.user = {
            code: action.payload.code,
            message: action.payload.message,
            result: {
              id: action.payload.result?.id,
              name: action.payload.result?.name,
              email: action.payload.result?.email,
              roles: action.payload.result?.roles,
            },
          };
        }
      }
    );

    // Đồng bộ khi cập nhật thông tin người dùng
    builder.addMatcher(
      authApi.endpoints.updateUser.matchFulfilled,
      (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            code: action.payload.code,
            message: action.payload.message,
            result: {
              ...state.user.result,
              id: action.payload.result?.id,
              name: action.payload.result?.name,
              email: action.payload.result?.email,
              roles: action.payload.result?.roles,
            },
          };
        } else {
          state.user = {
            code: action.payload.code,
            message: action.payload.message,
            result: {
              id: action.payload.result?.id,
              name: action.payload.result?.name,
              email: action.payload.result?.email,
              roles: action.payload.result?.roles,
            },
          };
        }
      }
    );
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectUserId = (state) => state.user.user?.id;

export default userSlice.reducer;