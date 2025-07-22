// services/api/productVariant.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productVariantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllProduct_VariantsByProduct: builder.query({
      query: ({ page, size, id }) => ({
        url: `/v1/admin/products/${id}/product-variants/admin`,
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),
    updateProductVariant: builder.mutation({
      query: ({ id, price, quantity }) => ({
        url: `/v1/admin/product-variants/${id}`,
        method: "PUT",
        data: {
          price,
          quantity,
        },
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),
    deleteProductVariant: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/product-variants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productVariantApi.util.updateQueryData(
            "listAllProduct_VariantsByProduct",
            (draft) => {
              if (draft) {
                const productVariant = draft.find((item) => item.id === id);
                if (productVariant) {
                  productVariant.status = "INACTIVE";
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
          console.log("Error deleting product variant:", error);
        }
      },
    }),

    restoreProductVariant: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/product-variants/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productVariantApi.util.updateQueryData(
            "listAllProduct_VariantsByProduct",
            (draft) => {
              if (draft) {
                const productVariant = draft.find((item) => item.id === id);
                if (productVariant) {
                  productVariant.status = "INACTIVE";
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
          console.log("Error restore product variant:", error);
        }
      },
    }),
  }),
});

export const {
  useListAllProduct_VariantsByProductQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useRestoreProductVariantMutation,
} = productVariantApi;
