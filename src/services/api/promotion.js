// services/api/promotion.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const promotionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPromotions: builder.query({
      query: ({ page, size }) => ({
        url: `/v1/admin/promotions`,
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.PROMOTION],
    }),
    addPromotion: builder.mutation({
      query: (promotion) => ({
        url: `/v1/admin/promotions`,
        method: "POST",
        data: promotion,
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
    updatePromotion: builder.mutation({
      query: ({ id, ...promotion }) => ({
        url: `/v1/admin/promotions/${id}`,
        method: "PUT",
        data: promotion,
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
    deletePromotion: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/promotions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Optimistic Update
        const patchResult = dispatch(
          promotionApi.util.updateQueryData(
            "listPromotions",
            undefined,
            (draft) => {
              if (draft) {
                const branches = draft.find((item) => item.id === id);
                if (branches) {
                  branches.status = "INACTIVE";
                }
                return draft;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("Error deleting promotion:", error);
        }
      },
    }),
    restorePromotion: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/promotions/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          promotionApi.util.updateQueryData(
            "listPromotions",
            undefined,
            (draft) => {
              const index = draft.items.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.items[index].status = "ACTIVE";
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("Error restoring promotion:", error);
        }
      },
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
