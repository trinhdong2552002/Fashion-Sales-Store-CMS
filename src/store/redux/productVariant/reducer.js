// store/redux/productVariant/reducer.js
import { createSlice } from "@reduxjs/toolkit";

const productVariantSlice = createSlice({
  name: "productVariant",
  initialState: {
    variants: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProductVariants: (state, action) => {
      state.variants = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setProductVariants, setLoading, setError } = productVariantSlice.actions;

export const selectProductVariants = (state) => state.productVariant.variants;
export const selectLoading = (state) => state.productVariant.loading;
export const selectError = (state) => state.productVariant.error;

export default productVariantSlice.reducer;