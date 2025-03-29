// src/pages/EditorPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import {
  fetchArticleById,
  createArticle,
  updateArticle,
  clearCurrentArticle,
} from "../features/articles/articlesSlice";

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentArticle, status, error } = useSelector(
    (state) => state.articles
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    body: "",
    tagList: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Load article data for editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      dispatch(fetchArticleById(id));
    } else {
      dispatch(clearCurrentArticle());
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [dispatch, id]);

  // Populate form when current article changes
  useEffect(() => {
    if (currentArticle && isEditing) {
      setFormData({
        title: currentArticle.title || "",
        description: currentArticle.description || "",
        body: currentArticle.body || "",
        tagList: currentArticle.tagList || [],
      });
    }
  }, [currentArticle, isEditing]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.body.trim()) errors.body = "Content is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tagList.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tagList: [...prev.tagList, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tagList: prev.tagList.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEditing) {
      dispatch(updateArticle({ id, articleData: formData }))
        .unwrap()
        .then((result) => {
          navigate(`/article/${result.article._id}`);
        })
        .catch((error) => {
          console.error("Failed to update article:", error);
        });
    } else {
      dispatch(createArticle(formData))
        .unwrap()
        .then((result) => {
          navigate(`/article/${result.article._id}`);
        })
        .catch((error) => {
          console.error("Failed to create article:", error);
        });
    }
  };

  if (isEditing && status === "loading" && !currentArticle) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="text-center mb-4">
            {isEditing ? "Edit Article" : "New Article"}
          </h1>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="articleTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Article Title"
                value={formData.title}
                onChange={handleChange}
                isInvalid={!!formErrors.title}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="articleDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="What's this article about?"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="articleBody">
              <Form.Label>Content (supports Markdown)</Form.Label>
              <Form.Control
                as="textarea"
                name="body"
                rows={8}
                placeholder="Write your article (in markdown)"
                value={formData.body}
                onChange={handleChange}
                isInvalid={!!formErrors.body}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.body}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="articleTags">
              <Form.Label>Tags</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Enter tags"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={(e) => e.key === "Enter" && addTag(e)}
                />
                <Button variant="outline-secondary" onClick={addTag}>
                  Add
                </Button>
              </InputGroup>

              <div className="mt-2">
                {formData.tagList.map((tag) => (
                  <span
                    key={tag}
                    className="badge bg-secondary me-1 mb-1"
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    {tag}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: "0.5rem" }}
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag} tag`}
                    ></button>
                  </span>
                ))}
              </div>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  "Publish Article"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditorPage;
