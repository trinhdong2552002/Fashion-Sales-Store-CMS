import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const wardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWards: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: `/v1/wards`,
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.WARD],
    }),
  }),
});

export const { useListWardsQuery } = wardApi;
