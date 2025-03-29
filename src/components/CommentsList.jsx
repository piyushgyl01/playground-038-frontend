// src/components/CommentsList.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import moment from "moment";
import { deleteComment } from "../features/comments/commentsSlice";

const CommentsList = ({ articleId }) => {
  const { comments, status, error } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleDelete = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      dispatch(deleteComment({ articleId, commentId }));
    }
  };

  if (status === "loading" && !comments.length) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status" size="sm">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (status === "failed") {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!comments.length) {
    return <p className="text-muted text-center my-4">No comments yet.</p>;
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <Card key={comment._id} className="mb-3">
          <Card.Body>
            <Card.Text>{comment.body}</Card.Text>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between align-items-center bg-light">
            <div className="d-flex align-items-center">
              <img
                src={comment.author?.image || "https://via.placeholder.com/30"}
                alt={comment.author?.username}
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
              <div>
                <Link
                  to={`/profile/${comment.author?.username}`}
                  className="text-decoration-none fw-bold"
                >
                  {comment.author?.username}
                </Link>
                <div className="text-muted small">
                  {moment(comment.createdAt).format("MMM D, YYYY")}
                </div>
              </div>
            </div>

            {user && comment.author && user._id === comment.author._id && (
              <Button
                variant="link"
                className="text-danger p-0"
                onClick={() => handleDelete(comment._id)}
              >
                <FaTrash size={14} />
              </Button>
            )}
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};

export default CommentsList;
