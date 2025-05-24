import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { FaTrash, FaPen } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify'; // Add this for toast notifications
import AdminSidebar from '../Layout/AdminSidebar';
import { FaEdit, FaArchive } from 'react-icons/fa';


const UserArchive = () => {
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
            .get(`${process.env.REACT_APP_API}/api/v1/users/archive`, {
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



    // const handleDeleteUser = (userId) => {
    //     const token = sessionStorage.getItem('token'); // Get the token from sessionStorage

    //     if (!token) {
    //         console.error('No token found in sessionStorage');
    //         return;
    //     }

    //     // Delete user from API
    //     fetch(`${process.env.REACT_APP_API}/api/v1/users/${userId}`, {
    //         method: 'DELETE',
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     })
    //         .then((response) => {
    //             if (response.ok) {
    //                 // Update state by filtering out the deleted user
    //                 setUsers(users.filter((user) => user._id !== userId));
    //                 toast.success('User deleted successfully');
    //             } else {
    //                 console.error('Error deleting user:', response.statusText);
    //                 toast.error('Failed to delete user');
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error deleting user:', error);
    //             toast.error('Failed to delete user');
    //         });
    // };


    const handleArchiveUser = async (userId) => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }

        // Find the user object to archive
        const userToArchive = users.find((user) => user._id === userId);
        if (!userToArchive) {
            toast.error('User not found');
            return;
        }

        try {
            // 1. Restore the user
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/users/restore`,
                userToArchive,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // 2. Delete the user
            const response = await fetch(`${process.env.REACT_APP_API}/api/v1/users/archive/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setUsers(users.filter((user) => user._id !== userId));
                toast.success('User Archive successfully');
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error archiving or deleting user:', error);
            toast.error('Failed to archive or delete user');
        }
    };

    return (
        <AdminSidebar>
            <div className="container">
                <h2>User Archive</h2>
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
                                        variant="warning"
                                        onClick={() => handleArchiveUser(user._id)}
                                        className="ms-2"
                                    >
                                        <FaArchive /> Retrive
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

export default UserArchive;