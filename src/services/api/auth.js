import { setUserInfo } from "@/store/redux/user/reducer";
import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

    getMyInfo: builder.query({
      query: () => ({
        url: "/v1/auth/myInfo",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // Wait for the query to resolve

          // Dispatch setUser to update the user slice with the fetched data
          dispatch(
            setUserInfo({
              id: data?.result?.id || null,
              name: data?.result?.name || null,
              email: data?.result?.email || null,
              avatarUrl: data?.result?.avatarUrl || null,
              dob: data?.result?.dob || null,
              gender: data?.result?.gender || null,
            }),
          );

          // console.log("getMyInfo queryFulfilled", data);
        } catch (error) {
          console.error("getMyInfo failed:", error);
        }
      },
      providesTags: [TAG_KEYS.AUTH],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useLazyGetMyInfoQuery } =
  authApi;
