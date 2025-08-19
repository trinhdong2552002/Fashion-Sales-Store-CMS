// services/api/promotion.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const promotionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPromotions: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: `/v1/promotions`,
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.PROMOTION],
    }),
    addPromotion: builder.mutation({
      query: (promotion) => ({
        url: `/v1/promotions`,
        method: "POST",
        data: promotion,
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
    updatePromotion: builder.mutation({
      query: ({ id, ...promotion }) => ({
        url: `/v1/promotions/${id}`,
        method: "PUT",
        data: promotion,
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
    deletePromotion: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/promotions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
    restorePromotion: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/promotions/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
  }),
});

export const {
  useListPromotionsQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useRestorePromotionMutation,
} = promotionApi;
