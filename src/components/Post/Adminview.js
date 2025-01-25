import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import AdminSidebar from '../Layout/AdminSidebar';

const AdminView = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch posts from an API or database
        fetch('http://localhost:4000/api/v1/posts')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    const handleDelete = (postId) => {
        const token = sessionStorage.getItem('token'); // Get the token from sessionStorage

        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }

        // Delete post from an API or database
        fetch(`http://localhost:4000/api/v1/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the request headers
            },
        })
            .then(response => {
                if (response.ok) {
                    setPosts(posts.filter(post => post.id !== postId));
                } else {
                    console.error('Error deleting post:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting post:', error));
    };

    return (
        <AdminSidebar>
        <div className="container mt-4">
            <h1>Admin View</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Image</th>
                        <th>Author</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{post.content}</td>
                            <td>
                                {post.images && post.images.length > 0 ? (
                                    post.images.map((image, index) => (
                                        <img key={index} src={image} alt={post.title} style={{ width: '50px', height: '50px', marginRight: '5px' }} />
                                    ))
                                ) : (
                                    'No Image'
                                )}
                            </td>
                            <td>{post.user.name}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(post.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        </AdminSidebar>
    );
};

export default AdminView;