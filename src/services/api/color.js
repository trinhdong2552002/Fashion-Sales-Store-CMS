import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const colorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listColors: builder.query({
      query: () => ({
        url: `/v1/public/colors`,
        method: "GET",
      }),
      providesTags: [TAG_KEYS.COLOR],
      transformResponse: (response) => ({
        items: Array.isArray(response.result?.items)
          ? response.result.items
          : response.result || [],
      }),
    }),
    addColor: builder.mutation({
      query: (color) => ({
        url: `/v1/admin/colors`,
        method: "POST",
        data: color,
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
      // Optimistic update
      async onQueryStarted(color, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            colorApi.util.updateQueryData("listColors", undefined, (draft) => {
              draft.items.push(data.result); // Thêm màu mới vào danh sách
            })
          );
        } catch (error) {
          // Nếu lỗi, RTK Query sẽ tự động làm mới lại nhờ invalidatesTags
          console.log("Error adding color:", error);
        }
      },
    }),
    updateColor: builder.mutation({
      query: ({ id, ...color }) => ({
        url: `/v1/admin/colors/${id}`,
        method: "PUT",
        data: color,
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
      // Optimistic update
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            colorApi.util.updateQueryData("listColors", undefined, (draft) => {
              const index = draft.items.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.items[index] = { ...draft.items[index], ...data.result };
              }
            })
          );
        } catch (error) {
          // Nếu lỗi, RTK Query sẽ tự động làm mới
          console.log("Error adding color:", error);
        }
      },
    }),
    deleteColor: builder.mutation({
      query: (id) => ({
        url: `/v1/admin/colors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            colorApi.util.updateQueryData("listColors", undefined, (draft) => {
              draft.items = draft.items.filter((item) => item.id !== id);
            })
          );
        } catch (error) {
          // Nếu lỗi, RTK Query sẽ tự động làm mới
          console.log("Error adding color:", error);
        }
      },
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
  useListColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useGetColorByIdQuery,
} = colorApi;
