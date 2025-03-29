// src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-5 py-3 bg-light">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            <Link to="/" className="text-decoration-none">
              <h5 className="mb-0 text-success">Blogify</h5>
            </Link>
            <p className="text-muted small mb-0">
              A place to share knowledge and ideas.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="text-muted small mb-0">
              &copy; {currentYear} Blogify. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;