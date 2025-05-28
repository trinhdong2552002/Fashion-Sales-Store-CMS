import { setAuth } from "../../store/redux/auth/reducer";
import { setUser } from "../../store/redux/user/reducer";
import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Đăng nhập
    login: builder.mutation({
      query: (credentials) => ({
        url: "/v1/auth/login",
        method: "POST",
        data: {
          email: credentials.email,
          password: credentials.password,
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        const authData = {
          accessToken: data?.result?.accessToken,
          refreshToken: data.result?.refreshToken,
          authenticated: data?.result?.authenticated,
          email: data?.result?.email,
          roles: data?.result?.roles,
        };

        dispatch(setAuth(authData));

        console.log("queryFulfilled", data);
      },
      invalidatesTags: [TAG_KEYS.AUTH],
    }),

    // Quên mật khẩu
    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "/v1/auth/forgot-password",
        method: "POST",
        data: {
          email: credentials.email,
        },
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),

    // Xác thực mật khẩu
    forgotPasswordVerify: builder.mutation({
      query: (credentials) => ({
        url: "/v1/auth/forgot-password/verify-code",
        method: "POST",
        data: {
          email: credentials.email,
          verificationCode: credentials.verificationCode,
        },
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),

    // Đặt lại mật khẩu
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/v1/auth/forgot-password/reset-password",
        method: "POST",
        data: {
          forgotPasswordToken: credentials.forgotPasswordToken,
          newPassword: credentials.newPassword,
          confirmPassword: credentials.confirmPassword,
        },
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),

    // Đăng xuất
    logout: builder.mutation({
      query: (credentials) => {
        if (!credentials.accessToken) {
          throw new Error("accessToken is required for logout");
        }

        return {
          url: "/v1/auth/logout",
          method: "POST",
          data: {
            accessToken: credentials.accessToken,
          },
        };
      },
      invalidatesTags: [TAG_KEYS.AUTH],
    }),

    // refreshToken
    refreshToken: builder.mutation({
      query: (credentials) => ({
        url: "/v1/auth/refresh-token",
        method: "POST",
        data: {
          refreshToken: credentials.refreshToken,
        },
      }),
      invalidatesTags: [TAG_KEYS.AUTH],
    }),

    getMyInfo: builder.query({
      query: () => ({
        url: "/v1/auth/myInfo",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // Wait for the query to resolve

          // Dispatch setUser to update the user slice with the fetched data
          dispatch(
            setUser({
              id: data?.result?.id || null,
              name: data?.result?.name || null,
              email: data?.result?.email || null,
              avatarUrl: data?.result?.avatarUrl || null,
              dob: data?.result?.dob || null,
              gender: data?.result?.gender || null,
            })
          );

          console.log("getMyInfo queryFulfilled", data);
        } catch (error) {
          console.error("getMyInfo failed:", error);
        }
      },
      providesTags: [TAG_KEYS.AUTH],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useForgotPasswordVerifyMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMyInfoQuery,
  useLazyGetMyInfoQuery,
} = authApi;
