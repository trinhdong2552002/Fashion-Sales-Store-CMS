import axios from "axios";
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tag-keys.js";

export const productImageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFiles: builder.query({
      query: ({ page, size, sort }) => ({
        url: "/v1/admin/files/all",
        params: { page, size, sort },
      }),
      providesTags: [TAG_KEYS.FILE],
    }),

    uploadMultipleFiles: builder.mutation({
      async queryFn(file) {
        const formData = new FormData();

        for (let i = 0; i < file.length; i++) {
          formData.append("files", file[i]);
        }

        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/admin/files/upload/images`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                // Don't set Content-Type manually, let browser set it with boundary
              },
            },
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
      invalidatesTags: [TAG_KEYS.FILE],
    }),

    deleteFile: builder.mutation({
      query: (id) => ({
        url: `/v1/admin/files/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.FILE],
    }),
  }),
});

export const {
  useGetAllFilesQuery,
  useUploadMultipleFilesMutation,
  useDeleteFileMutation,
} = productImageApi;
