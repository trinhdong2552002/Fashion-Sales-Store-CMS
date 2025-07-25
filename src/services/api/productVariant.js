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
    }),

    restoreProductVariant: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/product-variants/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),
  }),
});

export const {
  useListAllProduct_VariantsByProductQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useRestoreProductVariantMutation,
} = productVariantApi;
