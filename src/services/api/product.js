import { baseApi } from "@/services/api/index.js";
import { TAG_KEYS } from "@/constants/tagKeys.js";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProductsForAdmin: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: "/v1/products/admin",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.PRODUCT],
    }),

    // TODO: Need search product for admin
    // searchProducts: builder.query({
    //   query: ({ pageNo, pageSize, search }) => ({
    //     url: "/v1/products/search",
    //     params: { pageNo, pageSize, search },
    //   }),
    //   providesTags: [TAG_KEYS.PRODUCT],
    // }),

    addProduct: builder.mutation({
      query: (product) => ({
        url: "/v1/products",
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
        url: `/v1/products/${id}`,
        method: "PUT",
        data: { ...product },
      }),

      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),

    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),

    restoreProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/products/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT],
    }),
  }),
});

export const {
  useListProductsForAdminQuery,
  // useSearchProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} = productApi;
