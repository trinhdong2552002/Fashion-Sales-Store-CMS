import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const sizeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSizes: builder.query({
      query: ({ page, size } = {}) => ({
        url: `/v1/public/sizes`,
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.SIZE],
    }),
  }),
});

export const { useListSizesQuery } = sizeApi;
