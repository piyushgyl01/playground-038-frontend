// src/App.js
import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';

// Components
import AppNavbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArticlePage from './pages/ArticlePage';
import EditorPage from './pages/EditorPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const dispatch = useDispatch();

  // Check for current user on initial load
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <div className="flex-grow-1">
          <Container>
            <Suspense fallback={
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            }>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/article/:id" element={<ArticlePage />} />
                <Route
                  path="/editor"
                  element={<PrivateRoute element={<EditorPage />} />}
                />
                <Route
                  path="/editor/:id"
                  element={<PrivateRoute element={<EditorPage />} />}
                />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route
                  path="/settings"
                  element={<PrivateRoute element={<SettingsPage />} />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Container>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;