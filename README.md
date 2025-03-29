# Blogify Frontend

A modern React-based frontend for the Blogify blogging platform. This application provides a clean, responsive interface for reading and writing articles, following users, and engaging with content through comments.

## Technology Stack

- **Framework**: React with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Bootstrap 5 + Custom CSS
- **HTTP Client**: Axios
- **UI Components**: React Bootstrap
- **Markdown Rendering**: React Markdown
- **Icons**: React Icons
- **Date Formatting**: Moment.js

## Features

- **User Authentication**
  - Sign up, login, and logout
  - Token-based authentication with automatic refresh
  - Profile settings management

- **Article Management**
  - Create, read, update, and delete articles
  - Rich text editing with Markdown support
  - Tag articles with categories
  - Favorite/unfavorite articles

- **Social Features**
  - View user profiles
  - Follow/unfollow users
  - Comment on articles
  - Delete your own comments

- **Discovery**
  - Global feed of all articles
  - Filter articles by tag
  - Popular tags sidebar

- **Responsive Design**
  - Mobile-friendly interface
  - Optimized for all screen sizes

## Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd blogify-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory based on `.env.example`

4. Start the development server:
   ```
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API URL - Backend server address
VITE_API_URL=https://your-backend-url.com/api

# Environment
REACT_APP_ENV=development
```

## Project Structure

```
src/
├── app/            # Redux store configuration
├── components/     # Reusable UI components
├── features/       # Redux slices for different features
├── pages/          # Page components
├── services/       # API service functions
├── App.jsx         # Main application component
├── main.jsx        # Application entry point
```

## Feature Slices

The application uses Redux Toolkit with a feature-based architecture:

- `auth` - User authentication and profile management
- `articles` - Article CRUD operations
- `comments` - Comment functionality
- `profiles` - User profile data
- `tags` - Tag management

## API Integration

This frontend connects to the Blogify backend API. The application uses axios for API calls with interceptors to handle authentication token refreshing.

## Deployment

This project can be deployed to any static site hosting service like Vercel, Netlify, or GitHub Pages.

1. Build the project:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting provider.
