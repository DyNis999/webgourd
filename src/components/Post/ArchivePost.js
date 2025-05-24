import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from '../Layout/AdminSidebar';
import './AdminPostManagement.css';
import { FaEdit, FaArchive } from 'react-icons/fa';

const ArchivePost = () => {
 const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/posts/archive`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    const handleArchivePost = async (postId) => {
    const postToArchive= posts.find((post) => post._id === postId);
    if (!postToArchive) return;

    if (window.confirm('Are you sure you want to Retrive this post?')) {
        try {
            const token = sessionStorage.getItem('token');
            // 1. Archive the post
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/posts`,
                postToArchive,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // 2. Delete the post
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/posts/archive/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPosts(); // Refresh post list
        } catch (error) {
            console.error('Error archiving or deleting post:', error);
        }
    }
};

    return loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#f5f6fa' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    ) : (
        <AdminSidebar>
            <div className="admin-post-container">
                <h1 className="mb-4" style={{ fontWeight: 700, color: "#2d3748" }}>Archive Posts</h1>
                <Table striped bordered hover responsive className="admin-post-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Content</th>
                            <th>Status</th>
                            <th>Images</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post._id}>
                                <td style={{ verticalAlign: 'middle' }}>{post.title}</td>
                                <td style={{ verticalAlign: 'middle' }}>{post.user?.name}</td>
                                <td style={{ verticalAlign: 'middle', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.content}</td>
                                <td style={{ verticalAlign: 'middle' }}>
                                    <span className={`badge ${post.status === 'Approved' ? 'bg-success' : post.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td>
                                    {post.images && post.images.length > 0 ? (
                                        post.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Post ${index + 1}`}
                                                className="admin-post-image"
                                                style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                                            />
                                        ))
                                    ) : (
                                        <span className="text-muted">No images</span>
                                    )}
                                </td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="admin-action-btn d-flex align-items-center"
                                        onClick={() => handleArchivePost(post._id)}
                                    >
                                        <FaArchive className="me-2" /> Retrive
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

export default ArchivePost;
