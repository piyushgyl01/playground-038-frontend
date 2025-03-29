// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Nav,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import { fetchProfile, toggleFollow } from "../features/profiles/profilesSlice";
import { fetchArticles } from "../features/articles/articlesSlice";
import ArticlePreview from "../components/ArticlePreview";

const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const {
    profile,
    status: profileStatus,
    error: profileError,
  } = useSelector((state) => state.profiles);
  const { articles, status: articlesStatus } = useSelector(
    (state) => state.articles
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("authored");

  useEffect(() => {
    if (username) {
      dispatch(fetchProfile(username));
      dispatch(fetchArticles());
    }
  }, [dispatch, username]);

  const handleFollow = () => {
    if (isAuthenticated && profile) {
      dispatch(toggleFollow(profile.username));
    }
  };

  // Filter articles based on active tab and profile
  const filteredArticles = () => {
    if (!articles || !profile) return [];

    return articles.filter((article) => {
      if (activeTab === "authored") {
        // Show articles authored by the profile
        return article.author && article.author.username === profile.username;
      } else if (activeTab === "favorited") {
        // This would require backend support to get favorited articles
        // For now, we'll just show a placeholder message in the UI
        return false;
      }
      return false;
    });
  };

  // Loading state for profile
  if (profileStatus === "loading" && !profile) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Error state
  if (profileStatus === "failed") {
    return (
      <Alert variant="danger">
        {profileError || "Failed to load profile. Please try again."}
      </Alert>
    );
  }

  // If profile not found
  if (!profile) {
    return (
      <Alert variant="warning">
        Profile not found. The user might not exist.
      </Alert>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header py-5 bg-light mb-4">
        <Container className="text-center">
          <img
            src={profile.image || "https://via.placeholder.com/150"}
            alt={profile.username}
            className="rounded-circle mb-3"
            style={{ width: "150px", height: "150px" }}
          />
          <h2>{profile.name || profile.username}</h2>
          {profile.bio && <p className="text-muted">{profile.bio}</p>}

          {isAuthenticated && user.username !== profile.username && (
            <Button
              variant={profile.following ? "secondary" : "outline-secondary"}
              onClick={handleFollow}
              className="mt-2"
            >
              {profile.following ? (
                <>
                  <FaUserMinus className="me-1" /> Unfollow
                </>
              ) : (
                <>
                  <FaUserPlus className="me-1" /> Follow
                </>
              )}
            </Button>
          )}
        </Container>
      </div>

      <Container>
        <Nav
          variant="tabs"
          className="mb-4"
          activeKey={activeTab}
          onSelect={setActiveTab}
        >
          <Nav.Item>
            <Nav.Link eventKey="authored">Articles</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="favorited">Favorited Articles</Nav.Link>
          </Nav.Item>
        </Nav>

        <Row>
          <Col md={12}>
            {articlesStatus === "loading" ? (
              <div className="text-center my-4">
                <Spinner animation="border" role="status" size="sm">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                {activeTab === "authored" ? (
                  filteredArticles().length > 0 ? (
                    filteredArticles().map((article) => (
                      <ArticlePreview key={article._id} article={article} />
                    ))
                  ) : (
                    <div className="text-center text-muted my-5">
                      <p>No articles found.</p>
                    </div>
                  )
                ) : (
                  <div className="text-center text-muted my-5">
                    <p>Favorited articles feature is coming soon.</p>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;
