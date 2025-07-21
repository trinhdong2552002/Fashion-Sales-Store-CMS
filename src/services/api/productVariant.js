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
        url: `/v1/admin/product-variants/${id}`,
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
        url: `/v1/admin/product-variants/${id}/restore`,
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
  useListAllProduct_VariantsByProductQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useRestoreProductVariantMutation,
} = productVariantApi;
