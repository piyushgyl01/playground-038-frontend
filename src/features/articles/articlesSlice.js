// src/features/articles/articlesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { articleService } from "../../services/api";

// Async thunks
export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticles();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch articles" }
      );
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  "articles/fetchArticleById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticle(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch article" }
      );
    }
  }
);

export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await articleService.createArticle(articleData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create article" }
      );
    }
  }
);

export const updateArticle = createAsyncThunk(
  "articles/updateArticle",
  async ({ id, articleData }, { rejectWithValue }) => {
    try {
      const response = await articleService.updateArticle(id, articleData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update article" }
      );
    }
  }
);

export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (id, { rejectWithValue }) => {
    try {
      await articleService.deleteArticle(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete article" }
      );
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "articles/toggleFavorite",
  async (id, { rejectWithValue }) => {
    try {
      const response = await articleService.toggleFavorite(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to toggle favorite" }
      );
    }
  }
);

// Initial state
const initialState = {
  articles: [],
  currentArticle: null,
  status: "idle",
  error: null,
};

// Slice
const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all articles
      .addCase(fetchArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.articles = action.payload.articles;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to fetch articles";
      })
      // Fetch article by ID
      .addCase(fetchArticleById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentArticle = action.payload.article;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to fetch article";
      })
      // Create article
      .addCase(createArticle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.articles.push(action.payload.article);
        state.currentArticle = action.payload.article;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to create article";
      })
      // Update article
      .addCase(updateArticle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.articles.findIndex(
          (article) => article._id === action.payload.article._id
        );
        if (index !== -1) {
          state.articles[index] = action.payload.article;
        }
        state.currentArticle = action.payload.article;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to update article";
      })
      // Delete article
      .addCase(deleteArticle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.articles = state.articles.filter(
          (article) => article._id !== action.payload
        );
        if (
          state.currentArticle &&
          state.currentArticle._id === action.payload
        ) {
          state.currentArticle = null;
        }
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to delete article";
      })
      // Toggle favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updatedArticle = action.payload.article;
        // Update in articles list
        const index = state.articles.findIndex(
          (article) => article._id === updatedArticle._id
        );
        if (index !== -1) {
          state.articles[index] = updatedArticle;
        }
        // Update current article if it's the same one
        if (
          state.currentArticle &&
          state.currentArticle._id === updatedArticle._id
        ) {
          state.currentArticle = updatedArticle;
        }
      });
  },
});

// Export actions and reducer
export const { clearCurrentArticle, clearError } = articlesSlice.actions;
export default articlesSlice.reducer;
