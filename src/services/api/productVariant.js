// services/api/productVariant.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productVariantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProductVariants: builder.query({
      query: ({
        productId,
        pageNo = 1,
        pageSize = 10,
        colorId,
        sizeId,
      } = {}) => {
        if (!productId)
          throw new Error("Vui lòng chọn một sản phẩm để xem biến thể.");
        return {
          url: `/v1/products/${productId}/product-variants`,
          method: "GET",
          params: { pageNo, pageSize, colorId, sizeId },
        };
      },
      providesTags: [TAG_KEYS.PRODUCT_VARIANT],
      transformResponse: (response) => ({
        items: Array.isArray(response.result?.items)
          ? response.result.items
          : [],
        totalPages: response.result?.totalPages || 1,
        totalItems: response.result?.totalItems || 0,
      }),
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),
    updateProductVariant: builder.mutation({
      query: ({ id, price, quantity }) => ({
        url: `/v1/product-variants/${id}`,
        method: "PUT",
        data: {
          price,
          quantity,
        },
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            productVariantApi.util.updateQueryData(
              "listProductVariants",
              undefined,
              (draft) => {
                const index = draft.items.findIndex((item) => item.id === id);
                if (index !== -1) {
                  draft.items[index] = {
                    ...draft.items[index],
                    ...data.result,
                  };
                }
              }
            )
          );
        } catch (error) {
          console.log("Error updating variant:", error);
        }
      },
    }),
    deleteProductVariant: builder.mutation({
      query: (id) => ({
        url: `/v1/product-variants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            productVariantApi.util.updateQueryData(
              "listProductVariants",
              undefined,
              (draft) => {
                const index = draft.items.findIndex((item) => item.id === id);
                if (index !== -1) {
                  draft.items[index].status = "INACTIVE";
                }
              }
            )
          );
        } catch (error) {
          console.log("Error deleting variant:", error);
        }
      },
    }),

    restoreProductVariant: builder.mutation({
      query: (id) => ({
        url: `/v1/product-variants/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            productVariantApi.util.updateQueryData(
              "listProductVariants",
              undefined,
              (draft) => {
                const index = draft.items.findIndex((item) => item.id === id);
                if (index !== -1) {
                  draft.items[index].status = "ACTIVE";
                }
              }
            )
          );
        } catch (error) {
          console.log("Error restoring variant:", error);
        }
      },
    }),
  }),
});

export const {
  useListProductVariantsQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useRestoreProductVariantMutation,
} = productVariantApi;
