import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAddressForAdmin: builder.query({
      query: ({ page, size }) => ({
        url: `/v1/admin/addresses`,
        method: "GET",
        params: { page, size },
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
  useListAddressForAdminQuery,
  useDeleteAddressMutation,
  useRestoreAddressMutation,
} = addressApi;
