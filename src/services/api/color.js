import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const colorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllColors: builder.query({
      query: ({ page, size, sort }) => ({
        url: "/v1/public/colors",
        method: "GET",
        params: { page, size, sort },
      }),
      providesTags: [TAG_KEYS.COLOR],
    }),

    addColor: builder.mutation({
      query: (color) => ({
        url: "/v1/admin/colors",
        method: "POST",
        data: color,
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
    }),

    updateColor: builder.mutation({
      query: ({ id, ...color }) => ({
        url: `/v1/admin/colors/${id}`,
        method: "PUT",
        data: color,
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
    }),
    deleteColor: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/colors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
    }),
    getColorById: builder.query({
      query: (id) => ({
        url: `/v1/admin/colors/${id}`,
        method: "GET",
      }),
      providesTags: [TAG_KEYS.COLOR],
    }),
  }),
});

export const {
  useGetAllColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useGetColorByIdQuery,
} = colorApi;
