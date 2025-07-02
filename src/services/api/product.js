import { baseApi } from "/src/services/api/index.js";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProductsForAdmin: builder.query({
      query: ({ categoryId, status } = {}) => {
        const params = {};
        if (categoryId) params.categoryId = categoryId;
        if (status) params.status = status;
        return {
          url: `/v1/admin/products`,
          method: "GET",
          params,
        };
      },
      providesTags: [TAG_KEYS.PRODUCT],
      transformResponse: (response, meta, arg) => {
        let items = Array.isArray(response.result?.items)
          ? response.result.items
          : [];
        const { categoryId, status } = arg || {};

        if (categoryId) {
          items = items.filter((item) => item.category?.id === categoryId);
        }
        if (status) {
          items = items.filter((item) => item.status === status);
        }

        return { items };
      },
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),

    listProductsByCategoryForUser: builder.query({
      query: (categoryId) => {
        if (!categoryId) throw new Error("Category ID is required");
        return {
          url: `/v1/products`,
          method: "GET",
          params: { categoryId, status: "ACTIVE" },
        };
      },
      providesTags: [TAG_KEYS.PRODUCT],
    }),

    listProductsByCategoryForAdmin: builder.query({
      query: ({ categoryId, status } = {}) => {
        const params = { categoryId };
        if (status) params.status = status;
        return {
          url: `/v1/admin/products`,
          method: "GET",
          params,
        };
      },
      providesTags: [TAG_KEYS.PRODUCT],
    }),

    searchProducts: builder.query({
      query: (params) => {
        const { q, pageNo = 1, pageSize = 10 } = params || {};
        if (!q) throw new Error("Search term is required");
        return {
          url: `/v1/products/search`,
          method: "GET",
          params: { q, pageNo, pageSize },
        };
      },
      providesTags: [TAG_KEYS.PRODUCT],
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),

    getProductById: builder.query({
      query: (id) => {
        if (!id) throw new Error("Product ID is required");
        return {
          url: `/v1/products/${id}`,
          method: "GET",
        };
      },
      providesTags: [TAG_KEYS.PRODUCT],
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),

    addProduct: builder.mutation({
      query: (product) => ({
        url: `/v1/products`,
        method: "POST",
        data: {
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          price: product.price,
          quantity: product.quantity,
          colorIds: product.colorIds,
          sizeIds: product.sizeIds,
          imageIds: product.imageIds,
        },
      }),
      async onQueryStarted(product, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const newProductId = data.result?.id || Date.now();

          const newProduct = {
            id: newProductId,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            status: "ACTIVE",
            category: product.categoriesData?.items?.find(
              (cat) => cat.id === product.categoryId
            ) || { id: product.categoryId, name: "Unknown" },
            colors:
              product.colorsData?.items?.filter((color) =>
                product.colorIds.includes(color.id)
              ) || [],
            sizes:
              product.sizesData?.items?.filter((size) =>
                product.sizeIds.includes(size.id)
              ) || [],
            productImages:
              product.imagesData?.filter((image) =>
                product.imageIds.includes(image.id)
              ) || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "Unknown",
            updatedBy: "Unknown",
            averageRating: 0,
            soldQuantity: 0,
            totalReviews: 0,
          };

          const statuses = [undefined, "ACTIVE"];
          const categoryIds = [undefined, product.categoryId];

          for (const status of statuses) {
            for (const categoryId of categoryIds) {
              dispatch(
                productApi.util.updateQueryData(
                  "listProductsForAdmin",
                  { categoryId, status },
                  (draft) => {
                    if (
                      (status === undefined || status === "ACTIVE") &&
                      (categoryId === undefined ||
                        categoryId === product.categoryId)
                    ) {
                      draft.items.push(newProduct);
                    }
                  }
                )
              );
            }
          }
        } catch (error) {
          console.log("Error adding product:", error);
        }
      },
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/v1/products/${id}`,
        method: "PUT",
        data: {
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          price: product.price,
          quantity: product.quantity,
          colorIds: product.colorIds,
          sizeIds: product.sizeIds,
          imageIds: product.imageIds,
        },
      }),
      async onQueryStarted({ id, ...product }, { dispatch, queryFulfilled }) {
        const patchResults = [];
        const statuses = [undefined, "ACTIVE", "INACTIVE"];
        const categoryIds = [undefined, product.categoryId];

        for (const status of statuses) {
          for (const categoryId of categoryIds) {
            const patchResult = dispatch(
              productApi.util.updateQueryData(
                "listProductsForAdmin",
                { categoryId, status },
                (draft) => {
                  const index = draft.items.findIndex((item) => item.id === id);
                  if (index !== -1) {
                    const currentStatus = draft.items[index].status;
                    const currentCategoryId = draft.items[index].category?.id;
                    if (
                      (status === undefined || status === currentStatus) &&
                      (categoryId === undefined ||
                        categoryId === currentCategoryId)
                    ) {
                      draft.items[index] = {
                        ...draft.items[index],
                        ...product,
                      };
                    }
                    if (
                      product.categoryId &&
                      product.categoryId !== currentCategoryId &&
                      categoryId !== undefined &&
                      categoryId === currentCategoryId
                    ) {
                      draft.items.splice(index, 1);
                    }
                  }
                }
              )
            );
            patchResults.push(patchResult);
          }
        }

        try {
          await queryFulfilled;
        } catch (error) {
          patchResults.forEach((patchResult) => patchResult.undo());
          console.log("Error updating product:", error);
        }
      },
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/v1/products/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults = [];
        const statuses = [undefined, "ACTIVE", "INACTIVE"];
        const categoryIds = [undefined];

        let productCategoryId = undefined;
        const cacheState = productApi.endpoints.listProductsForAdmin.select({})(
          {
            api: { getState: () => ({ api: { queries: {} } }) },
          }
        ).data;
        if (cacheState?.items) {
          const product = cacheState.items.find((item) => item.id === id);
          if (product) {
            productCategoryId = product.category?.id;
            categoryIds.push(productCategoryId);
          }
        }

        for (const status of statuses) {
          for (const categoryId of categoryIds) {
            const patchResult = dispatch(
              productApi.util.updateQueryData(
                "listProductsForAdmin",
                { categoryId, status },
                (draft) => {
                  const index = draft.items.findIndex((item) => item.id === id);
                  if (index !== -1) {
                    const currentStatus = draft.items[index].status;
                    const currentCategoryId = draft.items[index].category?.id;

                    if (
                      (status === undefined || status === currentStatus) &&
                      (categoryId === undefined ||
                        categoryId === currentCategoryId)
                    ) {
                      if (status === undefined) {
                        draft.items[index].status = "INACTIVE";
                      } else if (
                        status === "ACTIVE" &&
                        currentStatus === "ACTIVE"
                      ) {
                        draft.items.splice(index, 1);
                      } else if (
                        status === "INACTIVE" &&
                        currentStatus === "ACTIVE"
                      ) {
                        draft.items[index].status = "INACTIVE";
                      }
                    }
                  }
                }
              )
            );
            patchResults.push(patchResult);
          }
        }

        try {
          await queryFulfilled;
        } catch (error) {
          patchResults.forEach((patchResult) => patchResult.undo());
          console.log("Error deleting product:", error);
        }
      },
    }),

    restoreProduct: builder.mutation({
      query: (id) => ({
        url: `/v1/products/${id}/restore`,
        method: "PATCH",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults = [];
        const statuses = [undefined, "ACTIVE", "INACTIVE"];
        const categoryIds = [undefined];

        let productCategoryId = undefined;
        const cacheState = productApi.endpoints.listProductsForAdmin.select({})(
          {
            api: { getState: () => ({ api: { queries: {} } }) },
          }
        ).data;
        if (cacheState?.items) {
          const product = cacheState.items.find((item) => item.id === id);
          if (product) {
            productCategoryId = product.category?.id;
            categoryIds.push(productCategoryId);
          }
        }

        for (const status of statuses) {
          for (const categoryId of categoryIds) {
            const patchResult = dispatch(
              productApi.util.updateQueryData(
                "listProductsForAdmin",
                { categoryId, status },
                (draft) => {
                  const index = draft.items.findIndex((item) => item.id === id);
                  if (index !== -1) {
                    const currentStatus = draft.items[index].status;
                    const currentCategoryId = draft.items[index].category?.id;

                    if (
                      (status === undefined || status === currentStatus) &&
                      (categoryId === undefined ||
                        categoryId === currentCategoryId)
                    ) {
                      if (status === undefined) {
                        draft.items[index].status = "ACTIVE";
                      } else if (
                        status === "INACTIVE" &&
                        currentStatus === "INACTIVE"
                      ) {
                        draft.items.splice(index, 1);
                      } else if (
                        status === "ACTIVE" &&
                        currentStatus === "INACTIVE"
                      ) {
                        draft.items[index].status = "ACTIVE";
                      }
                    }
                  }
                }
              )
            );
            patchResults.push(patchResult);
          }
        }

        try {
          await queryFulfilled;
        } catch (error) {
          patchResults.forEach((patchResult) => patchResult.undo());
          console.log("Error restoring product:", error);
        }
      },
    }),
  }),
});

export const {
  useListProductsForAdminQuery,
  // useListProductsForUserQuery,
  useListProductsByCategoryForUserQuery,
  useListProductsByCategoryForAdminQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} = productApi;
