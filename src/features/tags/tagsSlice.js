// src/features/tags/tagsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tagService } from "../../services/api";

// Async thunks
export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await tagService.getTags();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch tags" }
      );
    }
  }
);

// Initial state
const initialState = {
  tags: [],
  status: "idle",
  error: null,
};

// Slice
const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tags
      .addCase(fetchTags.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tags = action.payload.tags;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to fetch tags";
      });
  },
});

// Export actions and reducer
export const { clearError } = tagsSlice.actions;
export default tagsSlice.reducer;
