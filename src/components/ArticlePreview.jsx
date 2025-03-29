// src/components/ArticlePreview.js
import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../features/articles/articlesSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import moment from "moment";

const ArticlePreview = ({ article }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleFavorite = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      dispatch(toggleFavorite(article._id));
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <img
              src={article.author?.image || "https://via.placeholder.com/40"}
              alt={article.author?.username}
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <div>
              <Link
                to={`/profile/${article.author?.username}`}
                className="text-decoration-none fw-bold"
              >
                {article.author?.username}
              </Link>
              <div className="text-muted small">
                {moment(article.createdAt).format("MMMM D, YYYY")}
              </div>
            </div>
          </div>

          <Button
            variant={article.favorited ? "primary" : "outline-primary"}
            size="sm"
            onClick={handleFavorite}
            className="d-flex align-items-center"
            disabled={!isAuthenticated}
          >
            {article.favorited ? (
              <FaHeart className="me-1" />
            ) : (
              <FaRegHeart className="me-1" />
            )}
            {article.favouritesCount || 0}
          </Button>
        </div>

        <Link
          to={`/article/${article._id}`}
          className="text-decoration-none text-dark"
        >
          <Card.Title className="mb-2">{article.title}</Card.Title>
          <Card.Text className="text-muted mb-3">
            {article.description || article.body?.substring(0, 150)}...
          </Card.Text>
        </Link>

        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/article/${article._id}`} className="text-decoration-none">
            Read more...
          </Link>

          <div>
            {article.tagList &&
              article.tagList.map((tag) => (
                <Badge bg="secondary" className="me-1" key={tag}>
                  {tag}
                </Badge>
              ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArticlePreview;
