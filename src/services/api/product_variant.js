// services/api/productVariant.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productVariantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductVariant: builder.mutation({
      query: (productVariant) => ({
        url: `/v1/admin/products/${productId}/product-variants`,
        method: "POST",
        data: productVariant,
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),

    updateProductVariant: builder.mutation({
      query: ({ productVariantId, price, quantity }) => ({
        url: `/v1/admin/product-variants/${productVariantId}`,
        method: "PUT",
        data: {
          price,
          quantity,
        },
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),

    deleteProductVariant: builder.mutation({
      query: ({ productVariantId }) => ({
        url: `/v1/admin/product-variants/${productVariantId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),

    restoreProductVariant: builder.mutation({
      query: ({ productVariantId }) => ({
        url: `/v1/admin/product-variants/${productVariantId}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),
  }),
});

export const {
  useListAllProductVariantsByProductQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useRestoreProductVariantMutation,
} = productVariantApi;
