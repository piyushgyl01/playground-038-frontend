// src/features/profiles/profilesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "../../services/api";

// Async thunks
export const fetchProfile = createAsyncThunk(
  "profiles/fetchProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile(username);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch profile" }
      );
    }
  }
);

export const toggleFollow = createAsyncThunk(
  "profiles/toggleFollow",
  async (username, { rejectWithValue }) => {
    try {
      const response = await profileService.toggleFollow(username);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to toggle follow" }
      );
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  status: "idle",
  error: null,
};

// Slice
const profilesSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload.profile;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to fetch profile";
      })
      // Toggle follow
      .addCase(toggleFollow.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload.profile;
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to toggle follow";
      });
  },
});

// Export actions and reducer
export const { clearProfile, clearError } = profilesSlice.actions;
export default profilesSlice.reducer;
