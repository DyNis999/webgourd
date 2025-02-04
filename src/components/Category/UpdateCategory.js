import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Category.css';

const UpdateCategory = () => {
    const { categoryId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/categories/${categoryId}`);
                if (response.data) {
                    setName(response.data.name);
                    setDescription(response.data.description);
                }
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    console.error('Server error: Unable to fetch category details!', error);
                    alert('Server error: Unable to fetch category details!');
                } else {
                    console.error('There was an error fetching the category details!', error);
                    alert('There was an error fetching the category details!');
                }
                setName('');
                setDescription('');
            }
        };
        fetchCategoryDetails();
    }, [categoryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${process.env.REACT_APP_API}/api/v1/categories/${categoryId}`, { name, description });
            console.log('Category updated:', response.data);
            alert('Category updated successfully!');
        } catch (error) {
            console.error('There was an error updating the category!', error);
        }
    };

    return (
        <div className="create-category-container">
            <h2>Update Category</h2>
            <form onSubmit={handleSubmit} className="create-category-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name || ''}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Update</button>
            </form>
        </div>
    );
};

export default UpdateCategory;