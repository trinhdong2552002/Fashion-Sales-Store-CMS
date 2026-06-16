import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const statisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyRevenue: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "v1/admin/statistics/revenues/monthly",
        params: { startDate, endDate },
      }),
      providesTags: [TAG_KEYS.STATISTICS],
    }),

    getTopSellingProducts: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "v1/admin/statistics/products/top-selling",
        params: { startDate, endDate },
      }),
      providesTags: [TAG_KEYS.STATISTICS],
    }),

    getOrderSummary: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "v1/admin/statistics/orders/summary",
        params: { startDate, endDate },
      }),
      providesTags: [TAG_KEYS.STATISTICS],
    }),

    getExportOrderRevenueToExcel: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "v1/admin/statistics/orders/revenue-by-date/export",
        params: { startDate, endDate },
        responseType: "blob",
      }),
      providesTags: [TAG_KEYS.STATISTICS],
    }),
  }),
});

export const {
  useGetMonthlyRevenueQuery,
  useGetTopSellingProductsQuery,
  useGetOrderSummaryQuery,
  useLazyGetExportOrderRevenueToExcelQuery,
} = statisticsApi;
