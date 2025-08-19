import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAddressForAdmin: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: `/v1/addresses`,
        method: "GET",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.ADDRESS],
    }),
    deleteAddress: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
    }),
    restoreAddress: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/addresses/${id}/restore`,
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
