import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import './CreatePost.css'; // Assuming you have a CSS file for styles

const UpdatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState("");
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();
    const { postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    setError("No token found in sessionStorage");
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const post = response.data;
                setTitle(post.title);
                setContent(post.content);
                setSelectedCategory({ label: post.category.name, value: post.category._id });
                setImages(post.images);
            } catch (error) {
                console.error('Error fetching post:', error.message);
            }
        };

        const fetchCategories = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    setError("No token found in sessionStorage");
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/categories/getall`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const formattedCategories = response.data.map((category) => ({
                    label: category.name,
                    value: category._id,
                }));
                setCategories(formattedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error.message);
            }
        };

        fetchPost();
        fetchCategories();
    }, [postId]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const updatePost = async (e) => {
        e.preventDefault();
        if (!title || !content || !selectedCategory) {
            setError("Please fill in all fields.");
            return;
        }

        let formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", selectedCategory.value);

        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in sessionStorage");
            }

            const response = await fetch(`${process.env.REACT_APP_API}/api/v1/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
                credentials: 'include',
            });

            if (response.status === 200) {
                toast.success("Post Updated Successfully");

                setTimeout(() => {
                    navigate("/home");
                }, 500);
            }
        } catch (error) {
            console.error('Error updating post:', error.message);
            setError(error.response?.data?.message || 'Something went wrong');
            toast.error(error.response?.data?.message || "Please try again");
        }
    };

    return (
        <div className="create-post-container">
            <h1>Update Post</h1>
            <form onSubmit={updatePost}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <Select
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        options={categories}
                        placeholder="Select a Category"
                    />
                </div>
                <div className="form-group">
                    <label>Images</label>
                    <input type="file" multiple onChange={handleImageChange} />
                    <div className="image-preview">
                        {images.length > 0 ? (
                            images.map((uri, index) => (
                                <img key={index} src={uri} alt={`Selected ${index}`} />
                            ))
                        ) : (
                            <p>Select Images</p>
                        )}
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn btn-primary">Update Post</button>
            </form>
        </div>
    );
};

export default UpdatePost;