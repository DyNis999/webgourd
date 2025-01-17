import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Nav, Button, Dropdown, Container } from 'react-bootstrap';

import { getUser, logout } from '../../utils/helpers';

const Header = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Logout handler
    const logoutHandler = () => {
        logout(() => {
            navigate('/');
            window.location.reload(); // Refresh the page after redirect
        });
        toast.success('Logged out successfully', {
            position: 'bottom-right',
        });
    };

    // Fetch user information on mount
    useEffect(() => {
        const fetchedUser = getUser();
        if (fetchedUser) {
            setUser(fetchedUser);
            console.log('Fetched user:', fetchedUser);
        }
        setLoading(false);
    }, []);

    // Render nothing while loading user data
    if (loading) {
        return null; // You can show a loader here if desired
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
                        {user && (
                            <>
                                <Nav.Link as={Link} to="/Gourdchat">Chat</Nav.Link>
                                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                            </>
                        )}
                        <Nav.Link as={Link} to="/learn">Learn</Nav.Link>
                    </Nav>
                    <Nav>
                        {user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="secondary" id="userDropdown">
                                    <img
                                        src={user.image || '/images/default_avatar.jpg'} // Use default image if user.image is not available
                                        alt={user.name}
                                        className="rounded-circle"
                                        width="35"
                                        height="30"
                                    />
                                    <span className="ml-2">{user.name}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {user.isAdmin && ( // Check if user.isAdmin is true
                                        <Dropdown drop="right">
                                            <Dropdown.Toggle as="div" className="dropdown-item">
                                                Admin Options
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                            <Dropdown.Item as={Link} to="/UserManagement">
                                                   User Management
                                                </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/adminfeed">
                                                    Post Management
                                                </Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/createCategory">
                                                    Create Category
                                                </Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/ViewCategory">
                                                    View Category
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                    <Dropdown.Item as={Link} to="/profile">
                                        Profile
                                    </Dropdown.Item>
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