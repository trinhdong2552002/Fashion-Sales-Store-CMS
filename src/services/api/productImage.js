import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productImageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listImages: builder.query({
      query: ({ page, size, fileType }) => ({
        url: `/v1/admin/files/all`,
        method: "GET",
        params: { page, size, fileType },
      }),
      providesTags: [TAG_KEYS.PRODUCT_IMAGE],
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

    uploadImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("fileImage", file);

        console.log("FormData:", formData);

        return {
          url: "/v1/admin/files/upload/images",
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

    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/v1/admin/files/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_IMAGE],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useListImagesQuery,
  useLazyListImagesQuery,
  useDeleteImageMutation,
} = productImageApi;
