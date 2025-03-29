// src/pages/ArticlePage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import moment from "moment";

import {
  fetchArticleById,
  deleteArticle,
  toggleFavorite,
} from "../features/articles/articlesSlice";
import { fetchComments } from "../features/comments/commentsSlice";
import CommentsList from "../components/CommentsList";
import CommentForm from "../components/CommentForm";

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentArticle, status, error } = useSelector(
    (state) => state.articles
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  const handleFavorite = () => {
    if (isAuthenticated && currentArticle) {
      dispatch(toggleFavorite(currentArticle._id));
    }
  };

  const handleEdit = () => {
    navigate(`/editor/${currentArticle._id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteArticle(currentArticle._id))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to delete article:", err);
      });
    setShowDeleteModal(false);
  };

  // Loading state
  if (status === "loading" || !currentArticle) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <Alert variant="danger">
        {error || "Failed to load article. Please try again."}
      </Alert>
    );
  }

  const isAuthor =
    user && currentArticle.author && user._id === currentArticle.author._id;

  return (
    <div className="article-page">
      <div className="article-banner py-5 bg-dark text-white mb-4">
        <Container>
          <h1>{currentArticle.title}</h1>

          <div className="d-flex align-items-center mt-4">
            <img
              src={
                currentArticle.author?.image || "https://via.placeholder.com/50"
              }
              alt={currentArticle.author?.username}
              className="rounded-circle me-2"
              style={{ width: "50px", height: "50px" }}
            />
            <div>
              <Link
                to={`/profile/${currentArticle.author?.username}`}
                className="text-white text-decoration-none fw-bold"
              >
                {currentArticle.author?.username}
              </Link>
              <div className="text-light">
                {moment(currentArticle.createdAt).format("MMMM D, YYYY")}
              </div>
            </div>

            {isAuthenticated && (
              <div className="ms-auto">
                {isAuthor ? (
                  <>
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="me-2"
                      onClick={handleEdit}
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleDelete}
                    >
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={
                      currentArticle.favorited ? "primary" : "outline-light"
                    }
                    size="sm"
                    onClick={handleFavorite}
                  >
                    {currentArticle.favorited ? (
                      <FaHeart className="me-1" />
                    ) : (
                      <FaRegHeart className="me-1" />
                    )}
                    {currentArticle.favouritesCount || 0} Favorite
                  </Button>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>

      <Container>
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="article-body mb-5">
              <ReactMarkdown>{currentArticle.body}</ReactMarkdown>
            </div>

            <div className="mb-5">
              {currentArticle.tagList &&
                currentArticle.tagList.map((tag) => (
                  <Badge bg="secondary" className="me-1" key={tag}>
                    {tag}
                  </Badge>
                ))}
            </div>

            <hr className="my-4" />

            <div className="article-actions d-flex justify-content-center mb-5">
              {isAuthenticated && (
                <>
                  {isAuthor ? (
                    <>
                      <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={handleEdit}
                      >
                        <FaEdit className="me-1" /> Edit Article
                      </Button>
                      <Button variant="outline-danger" onClick={handleDelete}>
                        <FaTrash className="me-1" /> Delete Article
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant={
                        currentArticle.favorited ? "primary" : "outline-primary"
                      }
                      onClick={handleFavorite}
                    >
                      {currentArticle.favorited ? (
                        <FaHeart className="me-1" />
                      ) : (
                        <FaRegHeart className="me-1" />
                      )}
                      {currentArticle.favouritesCount || 0} Favorite Article
                    </Button>
                  )}
                </>
              )}
            </div>

            <hr className="my-4" />

            <div className="comments-section">
              <h3 className="mb-4">Comments</h3>

              {isAuthenticated ? (
                <CommentForm articleId={currentArticle._id} />
              ) : (
                <div className="text-center mb-4">
                  <Link to="/login" className="btn btn-outline-primary">
                    Sign in to add a comment
                  </Link>
                </div>
              )}

              <CommentsList articleId={currentArticle._id} />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this article? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ArticlePage;
