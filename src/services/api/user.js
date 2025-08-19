import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsersForAdmin: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: "/v1/users",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.USER],
    }),

    createUserWithRole: builder.mutation({
      query: (userData) => ({
        url: "/v1/users",
        method: "POST",
        data: userData,
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/v1/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),

    restoreUser: builder.mutation({
      query: (id) => ({
        url: `/v1/users/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),
  }),
});

export const {
  useCreateUserWithRoleMutation,
  useListUsersForAdminQuery,
  useDeleteUserMutation,
  useRestoreUserMutation,
} = userApi;
