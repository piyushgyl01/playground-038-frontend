// src/components/CommentForm.js
import React, { useState } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../features/comments/commentsSlice';

const CommentForm = ({ articleId }) => {
  const [body, setBody] = useState('');
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (body.trim()) {
      dispatch(addComment({ articleId, body }))
        .unwrap()
        .then(() => {
          setBody('');
        })
        .catch((error) => {
          console.error('Failed to add comment:', error);
        });
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="commentBody">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write a comment..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src={user?.image || 'https://via.placeholder.com/30'}
                alt={user?.username}
                className="rounded-circle me-2"
                style={{ width: '30px', height: '30px' }}
              />
              <span className="text-muted">{user?.username}</span>
            </div>
            <Button 
              variant="primary" 
              type="submit"
              disabled={status === 'loading' || !body.trim()}
            >
              {status === 'loading' ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CommentForm;