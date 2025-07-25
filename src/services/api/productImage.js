import axios from "axios";
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
    }),

    uploadImages: builder.mutation({
      async queryFn(files) {
        const formData = new FormData();
        for (let file of files) {
          formData.append("files", file);
        }

        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/admin/files/upload/images`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          return { data: response.data };
        } catch (error) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
      invalidatesTags: [TAG_KEYS.PRODUCT_IMAGE],
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
  useListImagesQuery,
  useUploadImagesMutation,
  useLazyListImagesQuery,
  useDeleteImageMutation,
} = productImageApi;
