// src/pages/SettingsPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { updateUser, logout } from "../features/auth/authSlice";

const SettingsPage = () => {
  const { user, status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    image: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        image: user.image || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");

    // Only send non-empty fields that have changed
    const updatedFields = {};
    Object.keys(formData).forEach((key) => {
      // Skip password if it's empty
      if (key === "password" && !formData[key]) return;

      // Only include changed fields
      if (user[key] !== formData[key]) {
        updatedFields[key] = formData[key];
      }
    });

    // Don't submit if nothing has changed
    if (Object.keys(updatedFields).length === 0) {
      setSuccessMessage("No changes to save.");
      return;
    }

    dispatch(updateUser(updatedFields))
      .unwrap()
      .then(() => {
        setSuccessMessage("Profile updated successfully!");
        // Clear password field after successful update
        setFormData((prev) => ({ ...prev, password: "" }));
      })
      .catch((error) => {
        console.error("Failed to update profile:", error);
      });
  };

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to logout:", error);
      });
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Your Settings</h1>

      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="profileImage">
              <Form.Label>Profile Picture URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                placeholder="URL of profile picture"
                value={formData.image}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                rows={3}
                placeholder="Short bio about you"
                value={formData.bio}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="New password (leave blank to keep current)"
                value={formData.password}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Minimum 8 characters. Leave blank to keep your current password.
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-3">
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
                    Updating...
                  </>
                ) : (
                  "Update Settings"
                )}
              </Button>

              <hr />

              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SettingsPage;
