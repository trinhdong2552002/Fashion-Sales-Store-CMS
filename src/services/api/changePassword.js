// services/api/changePassword.js
import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys.js";

export const changePasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword, confirmPassword }) => ({
        url: "/v1/auth/change-password",
        method: "POST",
        data: {
          oldPassword,
          newPassword,
          confirmPassword,
        },
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),
  }),
});

export const { useChangePasswordMutation } = changePasswordApi;
