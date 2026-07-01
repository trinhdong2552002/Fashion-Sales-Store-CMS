import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tag-keys.js";

export const sizeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSizes: builder.query({
      query: ({ page, size }) => ({
        url: "/v1/public/sizes",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.SIZE],
    }),
  }),
});

export const { useGetAllSizesQuery } = sizeApi;
