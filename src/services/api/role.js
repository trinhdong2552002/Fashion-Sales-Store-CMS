import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRolesByAdmin: builder.query({
      query: ({ page, size, sort } = {}) => ({
        url: `/v1/admin/roles`,
        params: { page, size, sort },
      }),
      providesTags: [TAG_KEYS.ROLE],
    }),

    getPermissionsByRoleId: builder.query({
      query: (roleId) => ({
        url: `/v1/admin/roles/${roleId}/permissions`,
      }),
      providesTags: [TAG_KEYS.ROLE],
    }),

    getRoleById: builder.query({
      query: (id) => ({
        url: `/v1/admin/roles/${id}`,
      }),
      providesTags: [TAG_KEYS.ROLE],
    }),
  }),
});

export const {
  useGetAllRolesByAdminQuery,
  useGetPermissionsByRoleIdQuery,
  useGetRoleByIdQuery,
} = roleApi;
