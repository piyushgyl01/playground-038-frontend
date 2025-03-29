// src/features/comments/commentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commentService } from "../../services/api";

// Async thunks
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (articleId, { rejectWithValue }) => {
    try {
      const response = await commentService.getComments(articleId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch comments" }
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ articleId, body }, { rejectWithValue }) => {
    try {
      const response = await commentService.addComment(articleId, body);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add comment" }
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ articleId, commentId }, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(articleId, commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete comment" }
      );
    }
  }
);

// Initial state
const initialState = {
  comments: [],
  status: "idle",
  error: null,
};

// Slice
const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload.comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to fetch comments";
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments.push(action.payload.comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to add comment";
      })
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to delete comment";
      });
  },
});

// Export actions and reducer
export const { clearComments, clearError } = commentsSlice.actions;
export default commentsSlice.reducer;
