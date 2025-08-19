import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const sizeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSizes: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: `/v1/sizes`,
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.SIZE],
    }),
  }),
});

export const { useListSizesQuery } = sizeApi;
