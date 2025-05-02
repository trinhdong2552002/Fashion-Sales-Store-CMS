import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productImageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("fileImage", file);

        console.log("FormData:", formData);

        return {
          url: "/v1/file/upload/image",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [TAG_KEYS.PRODUCT_IMAGE],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Upload image success:", data);
        } catch (error) {
          console.error("Upload image error:", {
            status: error.error?.status,
            data: error.error?.data,
            message: error.error?.data?.message || error.error?.data?.error,
            originalError: error,
          });
        }
      },
    }),

    listImages: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: `/v1/file/all`,
        method: "GET",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.PRODUCT_IMAGE],
      transformResponse: (response) => {
        console.log("Raw images response:", response);
        if (!response || !response.result) {
          console.warn("Invalid response structure:", response);
          return { items: [], totalItems: 0 };
        }

        const items = Array.isArray(response.result.items)
          ? response.result.items
          : Array.isArray(response)
          ? response
          : [];
        const totalItems = response.result.totalItems || 0;

        if (items.length === 0) {
          console.warn("No images found in response");
        }

        const transformedItems = items.map((item) => ({
          id: item.id,
          fileName: item.fileName || item.name || "Unknown",
          imageUrl: item.imageUrl || item.url || "",
        }));

        return { items: transformedItems, totalItems };
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Transformed images data:", data);
        } catch (error) {
          console.error("Error fetching images:", {
            status: error.error?.status,
            data: error.error?.data,
            params: arg,
          });
        }
      },
      retry: (error) => error.status === 400,
      retryMax: 2,
    }),

    listAllImages: builder.query({
      query: () => ({
        url: `/v1/file/all`,
        method: "GET",
        params: { pageNo: 1, pageSize: 10 },
      }),
      providesTags: [TAG_KEYS.PRODUCT_IMAGE],
      transformResponse: (response) => {
        console.log("Raw images response for page 1:", response);
        if (!response || !response.result) {
          console.warn("Invalid response structure:", response);
          return { items: [], totalItems: 0 };
        }

        const items = Array.isArray(response.result.items)
          ? response.result.items
          : [];
        const totalItems = response.result.totalItems || 0;

        const transformedItems = items.map((item) => ({
          id: item.id,
          fileName: item.fileName || item.name || "Unknown",
          imageUrl: item.imageUrl || item.url || "",
        }));

        return { items: transformedItems, totalItems, totalPages: response.result.totalPages || 1 };
      },
    }),

    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/v1/file/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_IMAGE],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useListImagesQuery,
  useListAllImagesQuery,
  useLazyListImagesQuery,
  useDeleteImageMutation,
} = productImageApi;