import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }) => {
    const publicEndpoints = [
      "/v1/auth/login",
    ];

    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!publicEndpoints.includes(url) && !token && !refreshToken) {
      console.log("No token found for non-public endpoint:", url);
      return {
        error: {
          status: 401,
          data: { message: "Không tìm thấy token, vui lòng đăng nhập lại" },
        },
      };
    }

    try {
      const result = await axios({
        url,
        method,
        data,
        params,
        headers: {
          ...headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        baseURL: import.meta.env.VITE_API_URL,
      });

      if (result.status >= 400) {
        console.log("Server error response:", result.data);
        return {
          error: {
            status: result.status,
            data: result.data,
          },
        };
      }

      return { data: result.data };
    } catch (axiosError) {
      const error = {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      };

      console.error("Axios error:", error);

      if (error.status === 401) {
        console.log("Handling 401 error:", error.data?.message);
        // Nếu token không hợp lệ, xóa token cũ và yêu cầu đăng nhập lại
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return { error };
      }

      return { error };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
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
    "Address",
    "Order",
    "OrderItem",
    "Branches",
    "Promotion",
  ],
});
