// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { FaEdit, FaTrash } from 'react-icons/fa';
// import { Table, Button } from 'react-bootstrap';
// import { CSVLink } from 'react-csv';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './ViewCategories.css';

// // Register necessary components and scales with Chart.js
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const ViewCategories = () => {
//     const [categories, setCategories] = useState([]);
//     const chartRef = useRef(null);

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get('http://localhost:4000/api/v1/categories/getall');
//             setCategories(response.data);
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//         }
//     };

//     const deleteCategory = async (id) => {
//         try {
//             await axios.delete(`http://localhost:4000/api/v1/categories/${id}`);
//             fetchCategories();
//         } catch (error) {
//             console.error('Error deleting category:', error);
//         }
//     };

//     const csvData = categories.map(category => ({
//         ID: category.id,
//         Name: category.name,
//         Description: category.description
//     }));

//     return (
//         <div className="view-categories-container">
//             <h1 className="title">Categories</h1>
//             <div className="actions">
//                 <CSVLink data={csvData} filename={"categories.csv"} className="btn btn-primary">
//                     Download CSV
//                 </CSVLink>
//             </div>
//             <Table striped bordered hover className="categories-table">
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Name</th>
//                         <th>Description</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {categories.map((category) => (
//                         <tr key={category.id}>
//                             <td>{category.id}</td>
//                             <td>{category.name}</td>
//                             <td>{category.description}</td>
//                             <td>
//                                 <Link to={`/UpdateCategory/${category.id}`} className="action-icon edit-icon" title="Edit">
//                                     <FaEdit />
//                                 </Link>
//                                 <Button variant="danger" className="action-icon delete-icon" onClick={() => deleteCategory(category.id)} title="Delete">
//                                     <FaTrash />
//                                 </Button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </div>
//     );
// };

// export default ViewCategories;
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaTrash, FaPen, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/v1/categories/getall');
                setCategories(response.data);
            } catch (err) {
                setError('Error fetching categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const deleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/v1/categories/${id}`);
            setCategories(categories.filter((category) => category._id !== id));
            toast.success('Category deleted successfully');
        } catch (err) {
            toast.error('Error deleting category');
        }
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setCategoryName(category.name);
        setCategoryDescription(category.description);
        setModalVisible(true);
    };

    const updateCategory = async () => {
        if (!selectedCategory) return;

        const updatedCategory = {
            _id: selectedCategory._id,
            name: categoryName || selectedCategory.name,
            description: categoryDescription || selectedCategory.description,
        };

        try {
            const response = await axios.put(
                `http://localhost:4000/api/v1/categories/${selectedCategory._id}`,
                updatedCategory
            );
            setCategories(categories.map((category) =>
                category._id === response.data._id ? response.data : category
            ));
            toast.success('Category updated successfully');
            setModalVisible(false);
        } catch (err) {
            toast.error('Error updating category');
        }
    };

    const addCategory = async () => {
        const newCategory = { name: categoryName, description: categoryDescription };

        try {
            const response = await axios.post('http://localhost:4000/api/v1/categories/create', newCategory);
            setCategories([...categories, response.data]);
            toast.success('Category created successfully');
            setCreateModalVisible(false);
        } catch (err) {
            toast.error('Error creating category');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Category Management</h2>
            <Button variant="success" onClick={() => setCreateModalVisible(true)}>
                <FaPlus /> Add Category
            </Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    className="me-2"
                                    onClick={() => openEditModal(category)}
                                >
                                    <FaPen />
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => deleteCategory(category._id)}
                                >
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Edit Modal */}
            <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={updateCategory}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Create Modal */}
            <Modal show={createModalVisible} onHide={() => setCreateModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="success" onClick={addCategory}>
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ViewCategories;
