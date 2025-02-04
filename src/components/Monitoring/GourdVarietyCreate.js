import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaTrash, FaPen, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../Layout/AdminSidebar';

const VarietyList = () => {
    const [varieties, setVarieties] = useState([]);
    const [gourdTypes, setGourdTypes] = useState([]);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [varietyName, setVarietyName] = useState('');
    const [varietyDescription, setVarietyDescription] = useState('');
    const [gourdType, setGourdType] = useState('');
    const [selectedVariety, setSelectedVariety] = useState(null);
    const token = sessionStorage.getItem('token'); // Fetch token from session storage

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [varietiesResponse, gourdTypesResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API}/api/v1/gourdVariety/getall`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${process.env.REACT_APP_API}/api/v1/gourdType/getall`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setVarieties(varietiesResponse.data);
                setGourdTypes(gourdTypesResponse.data);
            } catch (err) {
                setError('Error fetching data.');
            }
        };

        fetchData();
    }, [token]);

    const deleteVariety = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/gourdVariety/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVarieties(varieties.filter((variety) => variety._id !== id));
            toast.success('Variety deleted successfully');
        } catch (err) {
            toast.error('Error deleting variety');
        }
    };

    const openModal = (variety) => {
        setSelectedVariety(variety);
        setVarietyName(variety.name);
        setVarietyDescription(variety.description);
        setGourdType(variety.gourdType?._id || '');
        setModalVisible(true);
    };

    const updateVariety = async () => {
        if (!selectedVariety) return;

        const updatedVariety = {
            name: varietyName,
            description: varietyDescription,
            gourdType,
        };

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/gourdVariety/${selectedVariety._id}`,
                updatedVariety,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setVarieties(varieties.map((variety) =>
                variety._id === response.data._id ? response.data : variety
            ));
            setModalVisible(false);
            toast.success('Variety updated successfully');
        } catch (err) {
            toast.error('Error updating variety');
        }
    };

    const addVariety = async () => {
        const newVariety = {
            name: varietyName,
            description: varietyDescription,
            gourdType,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/gourdVariety/create`, newVariety, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVarieties([...varieties, response.data]);
            setCreateModalVisible(false);
            toast.success('Variety created successfully');
        } catch (err) {
            toast.error('Error creating variety');
        }
    };

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <AdminSidebar>
        <div className="container mt-4">
            <h2>Variety List</h2>
            <Button variant="success" onClick={() => setCreateModalVisible(true)}>
                <FaPlus /> Add Variety
            </Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Gourd Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {varieties.map((variety) => (
                        <tr key={variety._id}>
                            <td>{variety.name}</td>
                            <td>{variety.description}</td>
                            <td>{variety.gourdType?.name || 'Unknown'}</td>
                            <td className="text-center">
                                <Button variant="primary" onClick={() => openModal(variety)} className="me-2">
                                    <FaPen />
                                </Button>
                                <Button variant="danger" onClick={() => deleteVariety(variety._id)}>
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
                    <Modal.Title>Edit Variety</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="varietyName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={varietyName}
                                onChange={(e) => setVarietyName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="varietyDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={varietyDescription}
                                onChange={(e) => setVarietyDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="gourdType" className="mt-3">
                            <Form.Label>Gourd Type</Form.Label>
                            <Form.Select
                                value={gourdType}
                                onChange={(e) => setGourdType(e.target.value)}
                            >
                                <option value="">Select Gourd Type</option>
                                {gourdTypes.map((gourd) => (
                                    <option key={gourd._id} value={gourd._id}>
                                        {gourd.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalVisible(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateVariety}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Create Modal */}
            <Modal show={createModalVisible} onHide={() => setCreateModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Variety</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="varietyName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={varietyName}
                                onChange={(e) => setVarietyName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="varietyDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={varietyDescription}
                                onChange={(e) => setVarietyDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="gourdType" className="mt-3">
                            <Form.Label>Gourd Type</Form.Label>
                            <Form.Select
                                value={gourdType}
                                onChange={(e) => setGourdType(e.target.value)}
                            >
                                <option value="">Select Gourd Type</option>
                                {gourdTypes.map((gourd) => (
                                    <option key={gourd._id} value={gourd._id}>
                                        {gourd.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCreateModalVisible(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addVariety}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        </AdminSidebar>
    );
};

export default VarietyList;
