import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Nav, Button, Dropdown, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { getUser, logout } from '../../utils/helpers';
import { getToken } from '../../utils/helpers';


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

            await axios.post('http://localhost:4000/api/v1/users/logout', { userId }, {
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

    const fetchUser = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        };
        try {
            const { data } = await axios.get(`http://localhost:4000/api/v1/users/me`, config);
            setUser(data.user);
        } catch (error) {
            toast.error('Failed to fetch user data', {
                position: 'bottom-right'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" style={styles.navbarFixedTop}>
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img src="./images/shopit_logo.png" alt="Gourdify" className="d-inline-block align-top" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/Home">Forum</Nav.Link>
                            {user && (
                                <>
                                    <Nav.Link as={Link} to="/Gourdchat">Chat</Nav.Link>
                                    {/* <Nav.Link as={Link} to="/profile">Profile</Nav.Link> */}
                                    <Nav.Link as={Link} to="/Monitoring">Monitoring</Nav.Link>
                                </>
                            )}
                            <Nav.Link as={Link} to="/learn">Learn</Nav.Link>
                        </Nav>
                        <Nav>
                            {user ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="secondary" id="userDropdown" className="modern-dropdown-toggle">
                                        <img
                                            src={user.image || '/images/default_avatar.jpg'}
                                            alt={user.name}
                                            className="rounded-circle"
                                            width="35"
                                            height="30"
                                        />
                                        <span className="ms-2">{user.name}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="modern-dropdown-menu">
                                        <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                        {user?.isAdmin && (
                                            <Dropdown.Item as={Link} to="/admin/dashboard">
                                                Admin
                                            </Dropdown.Item>
                                        )}
                                        <Dropdown.Divider />
                                        <Dropdown.Header
                                            onClick={toggleDashboardMenu}
                                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                        >
                                            My Dashboards
                                            <FontAwesomeIcon icon={showDashboardMenu ? faCaretDown : faCaretRight} />
                                        </Dropdown.Header>
                                        {showDashboardMenu && (
                                            <>
                                                <Dropdown.Item as={Link} to="/User/Polinatedbymonth">
                                                    Pollinated
                                                </Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/User/Completedbymonth">
                                                    Completed
                                                </Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/User/Failedbymonth">
                                                    Failed
                                                </Dropdown.Item>
                                            </>
                                        )}
                                        <Dropdown.Divider />
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
    },
    body: {
        paddingTop: '56px',
    },
};

// Apply body styles
document.body.style.paddingTop = styles.body.paddingTop;

export default Header;
