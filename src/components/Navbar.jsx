// src/components/Navbar.js
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { FaPenSquare, FaUserCircle, FaCog } from "react-icons/fa";

const AppNavbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Blogify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/editor"
                  className="d-flex align-items-center"
                >
                  <FaPenSquare className="me-1" /> New Post
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/settings"
                  className="d-flex align-items-center"
                >
                  <FaCog className="me-1" /> Settings
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={`/profile/${user?.username}`}
                  className="d-flex align-items-center"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.username}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        marginRight: "5px",
                      }}
                    />
                  ) : (
                    <FaUserCircle className="me-1" />
                  )}
                  {user?.username}
                </Nav.Link>
                <Button
                  variant="outline-secondary"
                  onClick={handleLogout}
                  size="sm"
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Sign in
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Sign up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
