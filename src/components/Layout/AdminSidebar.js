import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = ({ show }) => {
    return (
        <div className={`admin-sidebar ${show ? 'show' : ''}`}>
            <h5 className="sidebar-title">Admin Options</h5>
            <ul className="sidebar-menu">
                <li><Link to="/UserManagement">User Management</Link></li>
                <li><Link to="/adminfeed">Post Management</Link></li>
                <li><Link to="/createCategory">Create Category</Link></li>
                <li><Link to="/ViewCategory">View Category</Link></li>
                <li><Link to="/gourdType">Gourd Type Management</Link></li>
                <li><Link to="/gourdVariety">Gourd Variety Management</Link></li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
