import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { FaTrash, FaPen } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify'; // Add this for toast notifications
import AdminSidebar from '../Layout/AdminSidebar';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        const storedToken = sessionStorage.getItem('token');
        if (!storedToken) {
            console.error('No token found in sessionStorage');
            return;
        }

        axios
            .get('${process.env.REACT_APP_API}/api/v1/users/', {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            })
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setError('Error fetching users');
            });
    };

    const handleToggleAdmin = async (userId, isAdmin) => {
        try {
            const storedToken = sessionStorage.getItem('token'); // Get token from sessionStorage
            if (!storedToken) {
                console.error('No token found in sessionStorage');
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API}/api/v1/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`,  // Include token if required
                },
                body: JSON.stringify({
                    isAdmin: !isAdmin,  // Toggle isAdmin value
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Update UI (toggle button text, etc.)
                toast.success(result.message);
                // Update the users state to reflect the new role
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, isAdmin: !user.isAdmin } : user
                    )
                );
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred.');
        }
    };

    const handleDeleteUser = (userId) => {
        const token = sessionStorage.getItem('token'); // Get the token from sessionStorage

        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }

        // Delete user from API
        fetch(`${process.env.REACT_APP_API}/api/v1/users/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    // Update state by filtering out the deleted user
                    setUsers(users.filter((user) => user._id !== userId));
                    toast.success('User deleted successfully');
                } else {
                    console.error('Error deleting user:', response.statusText);
                    toast.error('Failed to delete user');
                }
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            });
    };

    return (
        <AdminSidebar>
            <div className="container">
                <h2>User Management</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                                <td>
                                    <Button
                                        variant={user.isAdmin ? 'warning' : 'success'}
                                        onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                                    >
                                        {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="ms-2"
                                    >
                                        <FaTrash /> Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </AdminSidebar>
    );
};

export default UserManagement;
