import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Table, Button } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewCategories.css';

// Register necessary components and scales with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ViewCategories = () => {
    const [categories, setCategories] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/v1/categories/getall');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const deleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/v1/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const csvData = categories.map(category => ({
        ID: category.id,
        Name: category.name,
        Description: category.description
    }));

    return (
        <div className="view-categories-container">
            <h1 className="title">Categories</h1>
            <div className="actions">
                <CSVLink data={csvData} filename={"categories.csv"} className="btn btn-primary">
                    Download CSV
                </CSVLink>
            </div>
            <Table striped bordered hover className="categories-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <Link to={`/UpdateCategory/${category.id}`} className="action-icon edit-icon" title="Edit">
                                    <FaEdit />
                                </Link>
                                <Button variant="danger" className="action-icon delete-icon" onClick={() => deleteCategory(category.id)} title="Delete">
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ViewCategories;