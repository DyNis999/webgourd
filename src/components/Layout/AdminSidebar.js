import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faNewspaper,
    faList,
    faSeedling,
    faLeaf,
    faTachometerAlt,
    faArrowLeft,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed((prev) => !prev);
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar container */}
            <Sidebar collapsed={collapsed} style={{ backgroundColor: '#f0f0f0' }}>
                <Menu
                    menuItemStyles={{
                        button: {
                            [`&.active`]: {
                                backgroundColor: '#8a8a8a',
                                color: '#ffffff',
                            },
                        },
                    }}
                >
                    <div
                        className="sidebar-header"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px',
                            backgroundColor: '#d3d3d3', // Light gray background
                            textAlign: 'center',
                        }}
                    >
                        <h5 className="sidebar-title" style={{ margin: 0, color: '#333' }}>
                            {collapsed ? "GFT" : "Gourdtify"}
                        </h5>
                        <button
                            onClick={toggleSidebar}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}
                        >
                            <FontAwesomeIcon icon={collapsed ? faArrowRight : faArrowLeft} />
                        </button>
                    </div>
                    <MenuItem component={<Link to="/admin/dashboard" />}>
                        <FontAwesomeIcon icon={faTachometerAlt} /> {!collapsed && "Dashboard"}
                    </MenuItem>
                    <MenuItem component={<Link to="/UserManagement" />}>
                        <FontAwesomeIcon icon={faUsers} /> {!collapsed && "Users"}
                    </MenuItem>
                    <MenuItem component={<Link to="/adminfeed" />}>
                        <FontAwesomeIcon icon={faNewspaper} /> {!collapsed && "Posts"}
                    </MenuItem>
                    <MenuItem component={<Link to="/ViewCategory" />}>
                        <FontAwesomeIcon icon={faList} /> {!collapsed && "Categories"}
                    </MenuItem>
                    <MenuItem component={<Link to="/gourdType" />}>
                        <FontAwesomeIcon icon={faSeedling} /> {!collapsed && "Gourd Types"}
                    </MenuItem>
                    <MenuItem component={<Link to="/gourdVariety" />}>
                        <FontAwesomeIcon icon={faLeaf} /> {!collapsed && "Gourd Varieties"}
                    </MenuItem>
                </Menu>
            </Sidebar>

            {/* Main content area */}
            <div
                style={{
                    flex: 1,
                    padding: '20px',
                    overflowY: 'auto', // Enables scrolling for the content area
                }}
            >
                {children} {/* Render children content here */}
            </div>
        </div>
    );
};


export default AdminSidebar;
