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
      invalidatesTags: [TAG_KEYS.USER],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Lưu accessToken vào localStorage
          if (data?.result?.accessToken) {
            localStorage.setItem("accessToken", data.result.accessToken);
            console.log("Token saved:", data.result.accessToken); // Log token để debug
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
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
      invalidatesTags: [TAG_KEYS.USER],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Xóa accessToken khỏi localStorage
          if (data?.result?.accessToken) {
            localStorage.removeItem("accessToken");
            console.log("Token removed:", data.result.accessToken); // Log token để debug
          }
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
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
      invalidatesTags: [TAG_KEYS.USER],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Lưu refreshToken vào localStorage
          if (data?.result?.refreshToken) {
            localStorage.setItem("refreshToken", data.result.refreshToken);
            console.log("Refresh token saved:", data.result.refreshToken); // Log token để debug
          }
        } catch (error) {
          console.error("Refresh token failed:", error);
        }
      },
    }),

    getMyInfo: builder.query({
      query: () => ({
        url: "/v1/auth/myInfo",
        method: "GET",
      }),
      providesTags: [TAG_KEYS.USER],
    }),

    // Cập nhật thông tin người dùng
    updateUser: builder.mutation({
      query: ({ id, ...credentials }) => {
        // Chuyển đổi birthDate thành định dạng YYYY-MM-DD
        const dob =
          credentials.birthDate?.year &&
          credentials.birthDate?.month &&
          credentials.birthDate?.date
            ? `${credentials.birthDate.year}-${String(
                credentials.birthDate.month
              ).padStart(2, "0")}-${String(credentials.birthDate.date).padStart(
                2,
                "0"
              )}`
            : undefined;

        return {
          url: `/v1/users/${id}`,
          method: "PUT",
          body: {
            name: credentials.name,
            avatarUrl: credentials.image, // Đổi image thành avatarUrl
            dob: dob, // Gửi dob thay vì birthDate
            gender: credentials.gender,
            roles: [], // Backend yêu cầu roles, gửi mảng rỗng nếu không có
          },
        };
      },
      invalidatesTags: [TAG_KEYS.USER],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMyInfoQuery,
  useUpdateUserMutation,
} = authApi;
