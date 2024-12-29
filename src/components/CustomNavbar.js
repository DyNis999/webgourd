import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Nav, Button, Dropdown, Container } from 'react-bootstrap';  // Use react-bootstrap components

import { getUser, logout } from '../../utils/helpers';

const Header = () => {
    const [user, setUser] = useState(null); // Initially null to indicate loading
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    // Logout handler
    const logoutHandler = () => {
        logout(navigate('/'));
        toast.success('Logged out successfully', {
            position: 'bottom-right',
        });
    };

    // Fetch user information on mount
    useEffect(() => {
        const fetchedUser = getUser();
        if (fetchedUser) {
            setUser(fetchedUser);
        }
        setLoading(false); // Done loading user data
    }, []);

    // Render nothing while loading the user data
    if (loading) {
        return null; // Or you can show a loader here if desired
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img src="./images/shopit_logo.png" alt="Gourdify" className="d-inline-block align-top" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="#chat">Chat</Nav.Link>
                        <Nav.Link as={Link} to="#profile">Profile</Nav.Link>
                    </Nav>
                    <Nav>
                        {/* If user is logged in, show dropdown */}
                        {user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="secondary" id="userDropdown">
                                    <img
                                        src={user.image} // Assuming user.image is a URL
                                        alt={user.name}
                                        className="rounded-circle"
                                        width="30"
                                        height="30"
                                    />
                                    <span className="ms-2">{user.name}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {user.role === 'admin' && (
                                        <Dropdown.Item as={Link} to="/dashboard">
                                            Dashboard
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Item as={Link} to="/" onClick={logoutHandler} className="text-danger">
                                        Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Button variant="outline-light" as={Link} to="/login">
                                Login
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
