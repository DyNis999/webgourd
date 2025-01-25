import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaTrash, FaPen, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../Layout/AdminSidebar';

const GourdTypeList = () => {
    const [gourdTypes, setGourdTypes] = useState([]);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [gourdTypeName, setGourdTypeName] = useState('');
    const [gourdTypeDescription, setGourdTypeDescription] = useState('');
    const [selectedGourdType, setSelectedGourdType] = useState(null);
    const token = sessionStorage.getItem('token'); // Fetch token from session storage

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/v1/gourdType/getall`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setGourdTypes(response.data);
            } catch (err) {
                setError('Error fetching gourd types');
            }
        };
        fetchData();
    }, [token]);

    const deleteGourdType = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/v1/gourdType/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGourdTypes(gourdTypes.filter((type) => type._id !== id));
            toast.success('Gourd type deleted successfully');
        } catch (err) {
            toast.error('Error deleting gourd type');
        }
    };

    const openEditModal = (gourdType) => {
        setSelectedGourdType(gourdType);
        setGourdTypeName(gourdType.name);
        setGourdTypeDescription(gourdType.description);
        setModalVisible(true);
    };

    const updateGourdType = async () => {
        if (!selectedGourdType) return;

        const updatedGourdType = {
            _id: selectedGourdType._id,
            name: gourdTypeName || selectedGourdType.name,
            description: gourdTypeDescription || selectedGourdType.description,
        };

        try {
            const response = await axios.put(
                `http://localhost:4000/api/v1/gourdType/${selectedGourdType._id}`,
                updatedGourdType,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGourdTypes(gourdTypes.map((type) =>
                type._id === response.data._id ? response.data : type
            ));
            toast.success('Gourd type updated successfully');
            setModalVisible(false);
        } catch (err) {
            toast.error('Error updating gourd type');
        }
    };

    const addGourdType = async () => {
        const newGourdType = { name: gourdTypeName, description: gourdTypeDescription };

        try {
            const response = await axios.post(`http://localhost:4000/api/v1/gourdType/create`, newGourdType, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGourdTypes([...gourdTypes, response.data]);
            toast.success('Gourd type created successfully');
            setCreateModalVisible(false);
        } catch (err) {
            toast.error('Error creating gourd type');
        }
    };

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <AdminSidebar>
            <div className="container mt-4">
                <h2 className="mb-4">Gourd Type Management</h2>
                <Button variant="success" onClick={() => setCreateModalVisible(true)}>
                    <FaPlus /> Add Gourd Type
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
                        {gourdTypes.map((type) => (
                            <tr key={type._id}>
                                <td>{type.name}</td>
                                <td>{type.description}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => openEditModal(type)}
                                    >
                                        <FaPen />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => deleteGourdType(type._id)}
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
                        <Modal.Title>Edit Gourd Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={gourdTypeName}
                                    onChange={(e) => setGourdTypeName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={gourdTypeDescription}
                                    onChange={(e) => setGourdTypeDescription(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={updateGourdType}>
                                Save Changes
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Create Modal */}
                <Modal show={createModalVisible} onHide={() => setCreateModalVisible(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Gourd Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={gourdTypeName}
                                    onChange={(e) => setGourdTypeName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={gourdTypeDescription}
                                    onChange={(e) => setGourdTypeDescription(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="success" onClick={addGourdType}>
                                Create
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </AdminSidebar>
    );
};

export default GourdTypeList;
