// services/api/productVariant.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productVariantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllProductVariantsByProduct: builder.query({
      query: ({ pageNo, pageSize, id }) => ({
        // TODO: Dùng tạm của user hiện admin đang lỗi
        // url: `/v1/products/${id}/product-variants/admin`,
        url: `/v1/products/${id}/product-variants`,
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.PRODUCT_VARIANT],
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
    }),
    deleteProductVariant: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/product-variants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),

    // TODO: BE cũ hiện tại ko support restore khi xoá biến thể coi như đã xoá cứng
    // restoreProductVariant: builder.mutation({
    //   query: ({ id }) => ({
    //     url: `/v1/product-variants/${id}/restore`,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
    // }),
  }),
});

export const {
  useListAllProductVariantsByProductQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  // useRestoreProductVariantMutation,
} = productVariantApi;
