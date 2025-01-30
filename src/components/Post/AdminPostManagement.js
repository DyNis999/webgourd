import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from '../Layout/AdminSidebar';
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
            const response = await axios.get('http://localhost:4000/api/v1/posts', {
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
                    `http://localhost:4000/api/v1/posts/status/${selectedPost._id}`,
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

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.delete(`http://localhost:4000/api/v1/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchPosts(); // Refresh post list
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return loading ? (

        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    ) : (
        <AdminSidebar>
        <div className="container mt-5">
       
                <h1>Post Management</h1>
                <Table striped bordered hover responsive>
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
                                <td>{post.title}</td>
                                <td>{post.user?.name}</td>
                                <td>{post.content}</td>
                                <td>{post.status}</td>
                                <td>
                                    {post.images && post.images.length > 0 ? (
                                        post.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Post ${index + 1}`}
                                                style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                                            />
                                        ))
                                    ) : (
                                        <span>No images available</span>
                                    )}
                                </td>
                                <td>
                                    {post.status === 'Pending' && (
                                        <Button variant="warning" onClick={() => handleOpenModal(post)}>
                                            Update Status
                                        </Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeletePost(post._id)}
                                        className="ml-2"
                                    >
                                        Delete
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
