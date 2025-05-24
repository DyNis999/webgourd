import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faNewspaper, faList, faSeedling, faLeaf, faTachometerAlt, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed((prev) => !prev);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar container */}
            <div
                style={{
                    width: collapsed ? '80px' : '250px',
                    backgroundColor: '#000000',
                    height: '100%',
                    transition: 'width 1s ease',
                }}
            >
                <div
                    className="sidebar-header"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        backgroundColor: '#212529',
                        textAlign: 'center',
                        transition: 'padding 0.3s ease',
                    }}
                >
                    <h5
                        className="sidebar-title"
                        style={{
                            margin: 0,
                            color: '#fff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            transition: 'opacity 0.3s ease',
                            opacity: collapsed ? 0 : 1,
                        }}
                    >
                        Gourdtify Admin
                    </h5>
                    <button
                        onClick={toggleSidebar}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        <FontAwesomeIcon icon={collapsed ? faArrowRight : faArrowLeft} />
                    </button>
                </div>
                <Menu
                    menuItemStyles={{
                        button: {
                            [`&:hover`]: {
                                backgroundColor: '#343a40', // Change to your desired hover color
                                color: '#fff', // Ensure text remains white on hover
                            },
                            [`&.active`]: {
                                backgroundColor: '#212529',
                                color: '#fff',
                            },
                            color: '#fff', // Ensures default text is white
                        },
                    }}
                >
                    <MenuItem component={<Link to="/admin/dashboard" />}>
                        <div style={menuItemStyle}>
                            <div style={iconBoxStyle}>
                                <FontAwesomeIcon icon={faTachometerAlt} />
                            </div>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    transition: 'opacity 0.3s ease',
                                    opacity: collapsed ? 0 : 1,
                                    color: '#fff',
                                }}
                            >
                                Dashboard
                            </span>
                        </div>
                    </MenuItem>
                    <MenuItem component={<Link to="/UserManagement" />}>
                        <div style={menuItemStyle}>
                            <div style={iconBoxStyle}>
                                <FontAwesomeIcon icon={faUsers} />
                            </div>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    transition: 'opacity 0.3s ease',
                                    opacity: collapsed ? 0 : 1,
                                    color: '#fff',
                                }}
                            >
                                Users
                            </span>
                        </div>
                    </MenuItem>
                          <MenuItem component={<Link to="/ArchiveUser" />}>
                        <div style={menuItemStyle}>
                            <div style={iconBoxStyle}>
                                <FontAwesomeIcon icon={faNewspaper} />
                            </div>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    transition: 'opacity 0.3s ease',
                                    opacity: collapsed ? 0 : 1,
                                    color: '#fff',
                                }}
                            >
                                Archive User
                            </span>
                        </div>
                    </MenuItem>
                    <MenuItem component={<Link to="/PostManagement" />}>
                        <div style={menuItemStyle}>
                            <div style={iconBoxStyle}>
                                <FontAwesomeIcon icon={faNewspaper} />
                            </div>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    transition: 'opacity 0.3s ease',
                                    opacity: collapsed ? 0 : 1,
                                    color: '#fff',
                                }}
                            >
                                Posts
                            </span>
                        </div>
                    </MenuItem>
                                <MenuItem component={<Link to="/ArchivePost" />}>
                        <div style={menuItemStyle}>
                            <div style={iconBoxStyle}>
                                <FontAwesomeIcon icon={faNewspaper} />
                            </div>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    transition: 'opacity 0.3s ease',
                                    opacity: collapsed ? 0 : 1,
                                    color: '#fff',
                                }}
                            >
                                Archive Posts
                            </span>
                        </div>
                    </MenuItem>
                    <MenuItem component={<Link to="/ViewCategory" />}>
                        <div style={menuItemStyle}>
                            <div style={iconBoxStyle}>
                                <FontAwesomeIcon icon={faList} />
                            </div>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    transition: 'opacity 0.3s ease',
                                    opacity: collapsed ? 0 : 1,
                                    color: '#fff',
                                }}
                            >
                                Categories
                            </span>
                        </div>
                    </MenuItem>
                    <MenuItem component={<Link to="/gourdType" />}>
                        <div style={menuItemStyle}>
                            <div style={iconBoxStyle}>
                                <FontAwesomeIcon icon={faSeedling} />
                            </div>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    transition: 'opacity 0.3s ease',
                                    opacity: collapsed ? 0 : 1,
                                    color: '#fff',
                                }}
                            >
                                Gourd Types
                            </span>
                        </div>
                    </MenuItem>
                    <MenuItem component={<Link to="/gourdVariety" />}>
                        <div style={menuItemStyle}>
                            <div style={iconBoxStyle}>
                                <FontAwesomeIcon icon={faLeaf} />
                            </div>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    transition: 'opacity 0.3s ease',
                                    opacity: collapsed ? 0 : 1,
                                    color: '#fff',
                                }}
                            >
                                Gourd Varieties
                            </span>
                        </div>
                    </MenuItem>
                </Menu>
            </div>

            {/* Main content area */}
            <div
                style={{
                    flex: 1,
                    padding: '20px',
                    overflowY: 'auto',
                }}
            >
                {children} {/* Render children content here */}
            </div>
        </div>
    );
};

const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    transition: 'padding 0.3s ease',
};

const iconBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    backgroundColor: '#008000',
    borderRadius: '5px',
    color: '#fff',
    marginRight: '10px',
};

export default AdminSidebar;