import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faNewspaper, faList, faSeedling, faLeaf, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import './AdminSidebar.css';

const AdminSidebar = ({ show }) => {
    return (
        <div className={`admin-sidebar ${show ? 'show' : ''}`}>
            <h5 className="sidebar-title">Admin</h5>
            <ul className="sidebar-menu">
                <li><Link to="/UserManagement"><FontAwesomeIcon icon={faUsers} /> User </Link></li>
                <li><Link to="/adminfeed"><FontAwesomeIcon icon={faNewspaper} /> Post </Link></li>
                <li><Link to="/ViewCategory"><FontAwesomeIcon icon={faList} /> Category </Link></li>
                <li><Link to="/gourdType"><FontAwesomeIcon icon={faSeedling} /> Gourd Type </Link></li>
                <li><Link to="/gourdVariety"><FontAwesomeIcon icon={faLeaf} /> Gourd Variety </Link></li>
                <li><Link to="/admin/dashboard"><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</Link></li>
            </ul>
        </div>
    );
};

export default AdminSidebar;