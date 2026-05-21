import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const colorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllColors: builder.query({
      query: ({ page, size, sort }) => ({
        url: "/v1/public/colors",
        params: { page, size, sort },
      }),
      providesTags: [TAG_KEYS.COLOR],
    }),

    addColor: builder.mutation({
      query: (color) => ({
        url: "/v1/admin/colors",
        method: "POST",
        data: color.name,
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
    }),

    updateColor: builder.mutation({
      query: ({ colorId, ...color }) => ({
        url: `/v1/admin/colors/${colorId}`,
        method: "PUT",
        data: color,
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
    }),

    deleteColor: builder.mutation({
      query: ({ colorId }) => ({
        url: `/v1/admin/colors/${colorId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
    }),
  }),
});

export const {
  useGetAllColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorApi;
