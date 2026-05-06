import { baseApi } from "@/services/api/index.js";
import { TAG_KEYS } from "@/constants/tagKeys.js";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductsByAdmin: builder.query({
      query: ({ page, size, sort }) => ({
        url: "/v1/admin/products/admin",
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

    addProduct: builder.mutation({
      query: (product) => ({
        url: "/v1/admin/products",
        method: "POST",
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          categoryId: product.categoryId,
          colorIds: product.colorIds,
          sizeIds: product.sizeIds,
          imageIds: product.imageIds,
        },
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/v1/admin/products/${id}`,
        method: "PUT",
        data: { ...product },
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
  useGetAllProductsByAdminQuery,
  useSearchProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} = productApi;
