import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const wardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWards: builder.query({
      query: ({ page, size }) => ({
        url: `/v1/private/wards`,
        method: "GET",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.WARD],
    }),
  }),
});

export const { useListWardsQuery } = wardApi;
