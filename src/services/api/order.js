import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listOrdersForAdmin: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: `v1/orders`,
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.ORDER],
    }),

    deleteOrderById: builder.mutation({
      query: ({id}) => ({
        url: `v1/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.ORDER],
    }),
  }),
});

export const { useListOrdersForAdminQuery, useDeleteOrderByIdMutation } =
  orderApi;
