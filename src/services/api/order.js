import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listOrdersForAdmin: builder.query({
      query: ({ page, size }) => ({
        url: `v1/admin/orders`,
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.ORDER],
    }),
  }),
});

export const { useListOrdersForAdminQuery } = orderApi;
