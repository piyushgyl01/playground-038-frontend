// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import { Row, Col, Nav, Card, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../features/articles/articlesSlice";
import { fetchTags } from "../features/tags/tagsSlice";
import ArticlePreview from "../components/ArticlePreview";
import TagList from "../components/TagList";

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    articles,
    status: articleStatus,
    error: articleError,
  } = useSelector((state) => state.articles);
  const { tags, status: tagStatus } = useSelector((state) => state.tags);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("global");
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    dispatch(fetchArticles());
    dispatch(fetchTags());
  }, [dispatch]);

  // Handle tab changes
  const handleTabSelect = (eventKey) => {
    setActiveTab(eventKey);
    setSelectedTag(null);
  };

  // Handle tag selection
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setActiveTab("tag");
  };

  // Filter articles based on selected tab and tag
  const filteredArticles = () => {
    if (activeTab === "tag" && selectedTag) {
      return articles.filter(
        (article) => article.tagList && article.tagList.includes(selectedTag)
      );
    }
    // For now, we're just showing all articles since we don't have feed API
    return articles;
  };

  // Loading state
  if (articleStatus === "loading" && articles.length === 0) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="py-5 bg-light text-center mb-4">
        <h1 className="display-4">Blogify</h1>
        <p className="lead">A place to share knowledge and ideas.</p>
      </div>

      <Row>
        <Col md={9}>
          {articleError && <Alert variant="danger">{articleError}</Alert>}

          <Nav
            variant="tabs"
            className="mb-4"
            activeKey={activeTab}
            onSelect={handleTabSelect}
          >
            <Nav.Item>
              <Nav.Link eventKey="global">Global Feed</Nav.Link>
            </Nav.Item>
            {isAuthenticated && (
              <Nav.Item>
                <Nav.Link eventKey="feed">Your Feed</Nav.Link>
              </Nav.Item>
            )}
            {selectedTag && (
              <Nav.Item>
                <Nav.Link eventKey="tag">#{selectedTag}</Nav.Link>
              </Nav.Item>
            )}
          </Nav>

          {filteredArticles().length > 0 ? (
            filteredArticles().map((article) => (
              <ArticlePreview key={article._id} article={article} />
            ))
          ) : (
            <div className="text-center my-5">
              <p className="text-muted">No articles found.</p>
            </div>
          )}
        </Col>

        <Col md={3}>
          <Card className="p-3 mb-3">
            <Card.Title>Popular Tags</Card.Title>
            {tagStatus === "loading" ? (
              <div className="text-center">
                <Spinner animation="border" size="sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <TagList tags={tags} onTagSelect={handleTagSelect} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
