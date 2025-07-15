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
      query: (page, size) => ({
        url: `/v1/public/products/search`,
        params: { page, size },
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
      providesTags: [TAG_KEYS.PRODUCT],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Transformed product data:", data);
        } catch (error) {
          console.error("Error fetching product:", {
            status: error.error?.status,
            data: error.error?.data,
            params: arg,
          });
        }
      },
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

      providesTags: [TAG_KEYS.PRODUCT],
    }),

    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/products/${id}`,
        method: "DELETE",
      }),
      providesTags: [TAG_KEYS.PRODUCT],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productApi.util.updateQueryData("listProductsForAdmin", (draft) => {
            if (draft) {
              const product = draft.find((item) => item.id === id);
              if (product) {
                product.status = "INACTIVE";
              }
              return draft;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("Error deleting product:", error);
        }
      },
    }),

    restoreProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/products/${id}/restore`,
        method: "PATCH",
      }),
      providesTags: [TAG_KEYS.PRODUCT],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productApi.util.updateQueryData("listProductsForAdmin", (draft) => {
            if (draft) {
              const product = draft.find((item) => item.id === id);
              if (product) {
                product.status = "INACTIVE";
              }
              return draft;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("Error restoring product:", error);
        }
      },
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
