import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsersByAdmin: builder.query({
      query: ({ page, size }) => ({
        url: "/v1/admin/users",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.USER],
    }),

    createUserWithRole: builder.mutation({
      query: (userData) => ({
        url: "/v1/admin/users",
        method: "POST",
        data: userData,
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),

    // Soft delete user
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/v1/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),

    // Restore user
    restoreUser: builder.mutation({
      query: (id) => ({
        url: `/v1/admin/users/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),
  }),
});

export const {
  useGetAllUsersByAdminQuery,
  useCreateUserWithRoleMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
} = userApi;
