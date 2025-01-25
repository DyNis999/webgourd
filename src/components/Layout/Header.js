import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Nav, Button, Dropdown, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { getUser, logout } from '../../utils/helpers';
import AdminSidebar from './AdminSidebar';

const Header = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDashboardMenu, setShowDashboardMenu] = useState(false);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

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

    useEffect(() => {
        const fetchedUser = getUser();
        if (fetchedUser) {
            setUser(fetchedUser);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = getStyles();
        document.head.appendChild(style);
    }, []);

    if (loading) {
        return null;
    }

    return (
        <>
            <style>
                {getStyles()}
            </style>
            {user?.isAdmin && <AdminSidebar show={showSidebar} />}
            <Navbar bg="dark" variant="dark" expand="lg" className="navbar-fixed-top">
                <Container>
                    {user?.isAdmin && (
                        <Button
                            variant="outline-light"
                            onClick={toggleSidebar}
                            className="me-2"
                            style={{ zIndex: 1100 }}
                        >
                            ☰
                        </Button>
                    )}
                    <Navbar.Brand as={Link} to="/">
                        <img src="./images/shopit_logo.png" alt="Gourdify" className="d-inline-block align-top" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/Home">Home</Nav.Link>
                            {user && (
                                <>
                                    <Nav.Link as={Link} to="/Gourdchat">Chat</Nav.Link>
                                    <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
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

const getStyles = () => `
.navbar-fixed-top {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1030;
}

body {
    padding-top: 56px;
}

.admin-sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    width: 250px;
    height: calc(100vh - 60px);
    background-color:rgb(42, 50, 58);
    padding: 20px;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    overflow-y: auto;
}

.admin-sidebar.show {
    transform: translateX(0);
}

.sidebar-title {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color:rgb(242, 244, 246);
}

.sidebar-menu {
    list-style: none;
    padding: 0;
}

.sidebar-menu li {
    margin-bottom: 10px;
}

.sidebar-menu a {
    color:rgb(208, 214, 220);
    text-decoration: none;
    font-size: 1rem;
}

.sidebar-menu a:hover {
    text-decoration: underline;
    color: #007bff;
}

.main-content {
    transition: margin-left 0.3s ease-in-out;
    margin-left: 0;
    padding: 20px;
}

.main-content.content-shifted {
    margin-left: 250px;
}

.modern-dropdown-toggle {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 20px;
    background-color: #343a40;
    border: none;
    color: #fff;
    transition: background-color 0.3s, transform 0.3s;
}

.modern-dropdown-toggle:hover {
    background-color: #495057;
    transform: scale(1.05);
}

.modern-dropdown-menu {
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    overflow: hidden;
    animation: fadeIn 0.3s ease-in-out;
}

.modern-dropdown-menu .dropdown-item {
    padding: 10px 20px;
    color: #212529;
    transition: background-color 0.3s;
}

.modern-dropdown-menu .dropdown-item:hover {
    background-color: #f8f9fa;
}

.modern-dropdown-menu .dropdown-header {
    font-size: 1rem;
    color: #6c757d;
    padding: 10px 20px;
    background-color: #e9ecef;
}

.modern-dropdown-menu .dropdown-divider {
    margin: 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

export default Header;