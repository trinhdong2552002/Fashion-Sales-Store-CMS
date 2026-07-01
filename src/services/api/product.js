import { baseApi } from "@/services/api/index.js";
import { TAG_KEYS } from "@/constants/tag-keys.js";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductsByAdmin: builder.query({
      query: ({ page, size, sort }) => ({
        url: "/v1/admin/products",
        params: { page, size, sort },
      }),
      providesTags: [TAG_KEYS.PRODUCT],
    }),

    // TODO: Api search product for user has been error, need backend fix it
    // TODO: Because i want to use search api for admin too the BE have not support it yet
    // searchProducts: builder.query({
    //   query: ({ pageNo, pageSize, search }) => ({
    //     url: "/v1/products/search",
    //     params: { pageNo, pageSize, search },
    //   }),
    //   providesTags: [TAG_KEYS.PRODUCT],
    // }),

    getAllProductVariantsByProductForAdmin: builder.query({
      query: ({ page, size, sort, productId }) => ({
        url: `/v1/admin/products/${productId}/product-variants/admin`,
        params: { page, size, sort },
      }),
      providesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),

    createProduct: builder.mutation({
      query: (product) => ({
        url: "/v1/admin/products",
        method: "POST",
        data: product,
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, ...product }) => ({
        url: `/v1/admin/products/${productId}`,
        method: "PUT",
        data: { ...product },
      }),

      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),

    deleteProduct: builder.mutation({
      query: ({ productId }) => ({
        url: `/v1/admin/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),

    restoreProduct: builder.mutation({
      query: ({ productId }) => ({
        url: `/v1/admin/products/${productId}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),
  }),
});

export const {
  useGetAllProductsByAdminQuery,
  useGetAllProductVariantsByProductForAdminQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} = productApi;
