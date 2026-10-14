import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tag-keys";

export type PaymentStatus =
  | "PAID"
  | "PENDING"
  | "REFUNDED"
  | "CANCELED"
  | "FAILED";

export interface PaymentHistoryItem {
  id: number;
  isPrimary: boolean;
  paymentMethod: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentTime: string;
}

export interface SearchPaymentHistoriesParams {
  page?: number;
  size?: number;
  sort?: string | string[];
  startDate: string;
  endDate: string;
  paymentStatus?: PaymentStatus | "";
}

export interface PaymentHistoriesResponse {
  code: number;
  message: string;
  result: {
    page: number;
    size: number;
    totalPages: number;
    totalItems: number;
    items: PaymentHistoryItem[];
  };
}

export const paymentHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchPaymentHistories: builder.query<
      PaymentHistoriesResponse,
      SearchPaymentHistoriesParams
    >({
      query: ({ page, size, sort, startDate, endDate, paymentStatus }) => {
        const params: Record<string, any> = {
          page: page ?? 0,
          size: size ?? 25,
          startDate,
          endDate,
        };
        if (sort) {
          params.sort = sort;
        }
        if (paymentStatus && paymentStatus.trim() !== "") {
          params.paymentStatus = paymentStatus;
        }
        return {
          url: "/v1/admin/payment-histories/search",
          params,
        };
      },
      providesTags: [TAG_KEYS.PAYMENT_HISTORY],
    }),

    deletePaymentHistory: builder.mutation<any, { id: number | string }>({
      query: ({ id }) => ({
        url: `/v1/admin/payment-histories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PAYMENT_HISTORY],
    }),
  }),
});

export const {
  useSearchPaymentHistoriesQuery,
  useDeletePaymentHistoryMutation,
} = paymentHistoryApi;
