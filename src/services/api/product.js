import { baseApi } from "@/services/api/index.js";
import { TAG_KEYS } from "@/constants/tagKeys.js";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProductsForAdmin: builder.query({
      query: ({ page, size }) => ({
        url: "/v1/admin/products",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.PRODUCT],
    }),

    searchProducts: builder.query({
      query: ({ page, size, search }) => ({
        url: `/v1/public/products/search`,
        params: { page, size, search },
      }),
      providesTags: [TAG_KEYS.PRODUCT],
    }),

    addProduct: builder.mutation({
      query: (product) => ({
        url: "/v1/admin/products",
        method: "POST",
        data: {
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          variants: product.variants,
        },
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/v1/admin/products/${id}`,
        method: "PUT",
        data: {
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          variants: product.variants,
        },
      }),

      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),

    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),

    restoreProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/products/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),
  }),
});

export const {
  useListProductsForAdminQuery,
  useSearchProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} = productApi;
