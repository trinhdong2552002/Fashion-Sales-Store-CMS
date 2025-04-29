import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }) => {
    console.log("Base query function called with params:", {
      url,
      method,
      data,
      params,
      headers,
    });

    try {
      const publicEndpoints = [
        "/v1/auth/login",
      ];

      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      console.log(`Token trước khi gửi request (${url}):`, token);
      console.log(`Refresh token trước khi gửi request (${url}):`, refreshToken);
      console.log("Token sau khi gửi request:", token);

      if (!publicEndpoints.includes(url) && !token) {
        return {
          error: {
            status: 401,
            data: { message: "Không tìm thấy token, vui lòng đăng nhập lại" },
          },
        };
      }

      const config = {
        url,
        method,
        data,
        params,
        headers: {
          ...headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        baseURL: import.meta.env.VITE_API_URL,
      };

      if (data instanceof FormData) {
        delete config.headers["Content-Type"];
        console.log("FormData detected, Content-Type will be set by axios");
      }

      console.log("Final axios config before request:", config);
      console.log("Full request URL:", `${config.baseURL}${config.url}`);

      const result = await axios(config);
      console.log("Axios response received:", result);

      if (result.status >= 400) {
        console.log("Axios response error:", result);
        console.log("Server received path:", result.data?.path || "N/A");
        return {
          error: {
            status: result.status,
            data: result.data,
          },
        };
      }

      console.log("Axios response success:", result.data);
      return { data: result.data };
    } catch (axiosError) {
      const error = {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      };

      console.error("Axios error:", error);

      if (
        error.status === 401 &&
        (error.data?.message ===
          "Không tìm thấy token, vui lòng đăng nhập lại" ||
          error.data?.message?.includes("Invalid token") ||
          error.data?.message?.includes("Expired token"))
      ) {
        console.log("Xóa token do lỗi 401:", error.data?.message);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }

      return { error };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Product",
    "ProductVariant",
    "ProductImage",
    "Color",
    "Size",
    "Role",
    "Categories",
    "Ward",
    "District",
    "Province",
    "Order",
    "OrderItem",
    "Promotion",
  ],
});
