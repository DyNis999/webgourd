import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Nav, Button, Dropdown, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { getUser, logout } from '../../utils/helpers';

const Header = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDashboardMenu, setShowDashboardMenu] = useState(false);

    const navigate = useNavigate();

    const toggleDashboardMenu = () => {
        setShowDashboardMenu(!showDashboardMenu);
    };

    const logoutHandler = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const userId = user?.userId;
            if (!userId) throw new Error('User ID not found');

            await axios.post(`${process.env.REACT_APP_API}/api/v1/users/logout`, { userId }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            sessionStorage.removeItem('token');
            logout(() => {
                navigate('/');
                window.location.reload();
            });
            toast.success('Logged out successfully', { position: 'bottom-right' });
        } catch (error) {
            console.error('Logout error:', error.response ? error.response.data : error.message);
            toast.error('Failed to log out. Please try again.', { position: 'bottom-right' });
        }
    };

    useEffect(() => {
        const fetchedUser = getUser();
        if (fetchedUser) {
            setUser(fetchedUser);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return null;
    }

    return (
        <>
            <Navbar expand="xxl" style={styles.navbarFixedTop}>
                <Container>
                    <Navbar.Brand as={Link} to="/" style={{ color: '#FFFFFF' }}>
                        <img
                            src="./logoNBG.png"
                            alt="Gourdify"
                            className="d-inline-block align-top"
                            style={{ width: '35px', height: '35px' }} // Adjust the width and height as needed
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/Home" style={styles.navLink}>Home</Nav.Link>
                            {user && (
                                <>
                                    <Nav.Link as={Link} to="/Gourdchat" style={styles.navLink}>Chat</Nav.Link>
                                    <Nav.Link as={Link} to="/profile" style={styles.navLink}>Profile</Nav.Link>
                                    {/* <Nav.Link as={Link} to="/Monitoring" style={styles.navLink}>Monitoring</Nav.Link> */}
                                </>
                            )}
                            <Nav.Link as={Link} to="/learn" style={styles.navLink}>Learn</Nav.Link>
                        </Nav>
                        <Nav>
                            {user ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="success" id="userDropdown" className="modern-dropdown-toggle" style={styles.dropdownToggle}>
                                        <img
                                            src={user.image || '/images/default_avatar.jpg'}
                                            alt={user.name}
                                            className="rounded-circle"
                                            width="35"
                                            height="30"
                                        />
                                        <span className="ms-2" style={styles.navLink}>{user.name}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="modern-dropdown-menu">
                                        <Dropdown.Item as={Link} to="/profile" style={styles.dropdownItem}>Profile</Dropdown.Item>
                                        {user?.isAdmin && (
                                            <Dropdown.Item as={Link} to="/admin/dashboard" style={styles.dropdownItem}>
                                                Admin
                                            </Dropdown.Item>
                                        )}
                                        <Dropdown.Divider />
                                        <Dropdown.Header
                                            onClick={toggleDashboardMenu}
                                            style={{ ...styles.dropdownHeader, ...{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}
                                        >
                                            My Dashboards
                                            <FontAwesomeIcon icon={showDashboardMenu ? faCaretDown : faCaretRight} />
                                        </Dropdown.Header>
                                        {showDashboardMenu && (
                                            <>
                                                <Dropdown.Item as={Link} to="/User/Polinatedbymonth" style={styles.dropdownItem}>
                                                    Pollinated
                                                </Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/User/Completedbymonth" style={styles.dropdownItem}>
                                                    Completed
                                                </Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/User/Failedbymonth" style={styles.dropdownItem}>
                                                    Failed
                                                </Dropdown.Item>
                                            </>
                                        )}
                                        <Dropdown.Divider />
                                        <Dropdown.Item as={Link} to="/" onClick={logoutHandler} className="text-danger" style={styles.dropdownItem}>
                                            Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <Button variant="outline-light" as={Link} to="/login" style={styles.loginButton}>
                                    Login
                                </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

const styles = {
    navbarFixedTop: {
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1030,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Urbanist, sans-serif',
        backgroundColor: '#1F3B1C', // Dark green background color
        color: '#FFFFFF', // White font color
    },
    navLink: {
        color: '#FFFFFF', // Ensure nav links are white
    },
    body: {
        paddingTop: '56px',
        fontFamily: 'Urbanist, sans-serif',
    },
};

// Apply body styles
document.body.style.paddingTop = styles.body.paddingTop;

export default Header;