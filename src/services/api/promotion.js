// services/api/promotion.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tag-keys.js";

export const promotionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPromotionsByAdmin: builder.query({
      query: ({ page, size, sort }) => ({
        url: "/v1/admin/promotions",
        params: { page, size, sort },
      }),
      providesTags: [TAG_KEYS.PROMOTION],
    }),

    addPromotion: builder.mutation({
      query: (promotion) => ({
        url: "/v1/admin/promotions",
        method: "POST",
        data: promotion,
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),

    updatePromotion: builder.mutation({
      query: ({ promotionId, ...promotion }) => ({
        url: `/v1/admin/promotions/${promotionId}`,
        method: "PUT",
        data: promotion,
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),

    deletePromotion: builder.mutation({
      query: ({ promotionId }) => ({
        url: `/v1/admin/promotions/${promotionId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),

    restorePromotion: builder.mutation({
      query: ({ promotionId }) => ({
        url: `/v1/admin/promotions/${promotionId}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
  }),
});

export const {
  useGetAllPromotionsByAdminQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useRestorePromotionMutation,
} = promotionApi;
