import { createSlice } from "@reduxjs/toolkit";

const branchesSlice = createSlice({
  name: "branches",
  initialState: {
    branches: [],
    loading: false,
    error: null,
  },
  reducers: {
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setBranches, setLoading, setError } = branchesSlice.actions;

export const selectBranches = (state) => state.branches.branches;
export const selectLoading = (state) => state.branches.loading;
export const selectError = (state) => state.branches.error;

export default branchesSlice.reducer;