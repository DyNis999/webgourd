import React, { useState } from 'react';
import axios from 'axios';
import './Category.css'; // Import the CSS file

const CreateCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/v1/categories/create', { name, description });
            console.log('Category created:', response.data);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('There was an error creating the category!', error);
        }
    };

    return (
        <div className="create-category-container"> {/* Add a class name */}
            <h2>Create Category</h2>
            <form onSubmit={handleSubmit} className="create-category-form"> {/* Add a class name */}
                <div className="form-group"> {/* Add a class name */}
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group"> {/* Add a class name */}
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Create</button> {/* Add a class name */}
            </form>
        </div>
    );
};

export default CreateCategory;