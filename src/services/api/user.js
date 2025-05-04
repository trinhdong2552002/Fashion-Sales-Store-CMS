import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserWithRole: builder.mutation({
      query: (userData) => ({
        url: "/v1/users",
        method: "POST",
        data: userData,
      }),
      invalidatesTags: [TAG_KEYS.USER],
    }),
    fetchAllUsersForAdmin: builder.query({
      query: ({ pageNo = 1, pageSize = 10, sortBy = "name-asc", search = "", roles = "" } = {}) => ({
        url: "/v1/users",
        method: "GET",
        params: { pageNo, pageSize, sortBy, search, roles },
      }),
      providesTags: [TAG_KEYS.USER],
      transformResponse: (response) => ({
        page: response.result.page,
        size: response.result.size,
        totalPages: response.result.totalPages,
        totalItems: response.result.totalItems,
        items: response.result.items,
      }),
    }),
    fetchUserById: builder.query({
      query: (id) => ({
        url: `/v1/users/${id}`,
        method: "GET",
      }),
      providesTags: [TAG_KEYS.USER],
    }),
    softDeleteUser: builder.mutation({
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
  useFetchAllUsersForAdminQuery,
  useFetchUserByIdQuery,
  useSoftDeleteUserMutation,
  useRestoreUserMutation,
} = userApi;