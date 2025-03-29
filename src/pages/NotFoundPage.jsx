// src/pages/NotFoundPage.js
import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <Container className="text-center py-5">
      <h1 className="display-1 fw-bold">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="lead mb-5">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        as={Link}
        to="/"
        variant="primary"
        size="lg"
        className="d-inline-flex align-items-center"
      >
        <FaArrowLeft className="me-2" /> Go to Home Page
      </Button>
    </Container>
  );
};

export default NotFoundPage;
