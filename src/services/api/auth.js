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
      invalidatesTags: [TAG_KEYS.AUTH],
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
      providesTags: [TAG_KEYS.AUTH],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMyInfoQuery,
} = authApi;
