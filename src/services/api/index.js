import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

// Create a standalone axios instance to handle the refresh call cleanly
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }) => {
    // 1. Get tokens
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // 2. Prepare headers
    const requestConfig = {
      url,
      method,
      data,
      params,
      headers: {
        ...headers,
        // Only attach token if it exists
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      baseURL: import.meta.env.VITE_API_URL,
    };

    try {
      // 3. Attempt the Initial Request
      const result = await axios(requestConfig);
      return { data: result.data };
    } catch (axiosError) {
      const error = axiosError.response;
      const status = error?.status || 500;

      // 4. INTERCEPTOR LOGIC: Handle 401 (Unauthorized)
      // Check if error is 401 AND we haven't already tried to refresh (prevents infinite loops)
      // Also ensure we aren't trying to refresh the refresh endpoint itself!
      if (status === 401 && url !== "/v1/auth/refresh-token" && refreshToken) {
        try {
          // A. Call the Refresh Endpoint
          // We use a separate axios call here to avoid passing the old interceptors
          const refreshResult = await axiosInstance.post(
            "/v1/auth/refresh-token",
            {
              refreshToken: refreshToken,
            }
          );

          // B. Extract the new tokens
          const newAccessToken = refreshResult?.result?.accessToken;
          console.log("New access token:", newAccessToken);
          const newRefreshToken = refreshResult?.result?.refreshToken;

          if (newAccessToken) {
            // C. Update Local Storage
            localStorage.setItem("accessToken", newAccessToken);
            // Only update refresh token if the server gave us a new one
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // D. RETRY the Original Request
            // We must update the header with the NEW token
            requestConfig.headers.Authorization = `Bearer ${newAccessToken}`;

            const retryResult = await axios(requestConfig);
            return { data: retryResult.data };
          }
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/";

          return {
            error: {
              status: 401,
              data: { message: "Phiên đăng nhập hết hạn." },
            },
          };
        }
      }

      // 5. Handle Standard Errors (Not 401, or no refresh token available)
      if (status === 401) {
        // If we got here, it means we had no refresh token, or the URL was already refresh-token
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }

      return {
        error: {
          status: status,
          data: error?.data || axiosError.message,
        },
      };
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
