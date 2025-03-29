// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import articlesReducer from "../features/articles/articlesSlice";
import commentsReducer from "../features/comments/commentsSlice";
import profilesReducer from "../features/profiles/profilesSlice";
import tagsReducer from "../features/tags/tagsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
    comments: commentsReducer,
    profiles: profilesReducer,
    tags: tagsReducer,
  },
});
