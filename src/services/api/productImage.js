import axios from "axios";
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productImageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listImages: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: "/v1/file/all",
        method: "GET",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.PRODUCT_IMAGE],
    }),

    uploadImage: builder.mutation({
      async queryFn(file) {
        // Now accepts single file, not array
        const formData = new FormData();

        // Change from "files" to "fileImage" to match backend
        formData.append("fileImage", file);

        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/file/upload/image`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                // Don't set Content-Type manually, let browser set it with boundary
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
        url: `/v1/file/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_IMAGE],
    }),
  }),
});

export const {
  useListImagesQuery,
  useUploadImageMutation,
  useLazyListImagesQuery,
  useDeleteImageMutation,
} = productImageApi;
