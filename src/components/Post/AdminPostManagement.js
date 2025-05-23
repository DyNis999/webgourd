import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from '../Layout/AdminSidebar';
import './AdminPostManagement.css';
import { FaEdit, FaArchive } from 'react-icons/fa';

const AdminPostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [postStatus, setPostStatus] = useState('Pending');
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/posts`, {
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

    const handleOpenModal = (post) => {
        setSelectedPost(post);
        setPostStatus(post.status || 'Pending');
        setModalVisible(true);
    };

    const handleUpdateStatus = async () => {
        if (selectedPost && postStatus) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.put(
                    `${process.env.REACT_APP_API}/api/v1/posts/status/${selectedPost._id}`,
                    { status: postStatus },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                fetchPosts();
                setModalVisible(false);
            } catch (error) {
                console.error('Error updating post status:', error);
            }
        }
    };

    const handleArchivePost = async (postId) => {
    const postToArchive= posts.find((post) => post._id === postId);
    if (!postToArchive) return;

    if (window.confirm('Are you sure you want to Archive this post?')) {
        try {
            const token = sessionStorage.getItem('token');
            // 1. Archive the post
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/posts/archive`,
                postToArchive,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // 2. Delete the post
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/posts/${postId}`, {
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
                <h1 className="mb-4" style={{ fontWeight: 700, color: "#2d3748" }}>Post Management</h1>
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
                                    {post.status === 'Pending' && (
                                        <Button
                                            variant="warning"
                                            className="admin-action-btn d-flex align-items-center mb-2"
                                            onClick={() => handleOpenModal(post)}
                                        >
                                            <FaEdit className="me-2" /> Update Status
                                        </Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        className="admin-action-btn d-flex align-items-center"
                                        onClick={() => handleArchivePost(post._id)}
                                    >
                                        <FaArchive className="me-2" /> Archive
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Post Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="postStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={postStatus}
                                    onChange={(e) => setPostStatus(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalVisible(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleUpdateStatus}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </AdminSidebar>
    );
    
};

export default AdminPostManagement;
