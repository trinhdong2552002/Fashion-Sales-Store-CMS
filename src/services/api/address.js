import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAddressesByAdmin: builder.query({
      query: ({ page, size, sort }) => ({
        url: "/v1/admin/addresses",
        params: { page, size, sort },
      }),
      providesTags: [TAG_KEYS.ADDRESS],
    }),
    deleteAddress: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
    }),
    restoreAddress: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/addresses/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
    }),
  }),
});

export const {
  useGetAllAddressesByAdminQuery,
  useDeleteAddressMutation,
  useRestoreAddressMutation,
} = addressApi;
