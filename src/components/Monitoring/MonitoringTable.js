import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FaTrash, FaPen, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { getUser } from '../../utils/helpers';
import { toast } from 'react-toastify';

const MonitoringList = () => {
    const [monitorings, setMonitorings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [selectedMonitoring, setSelectedMonitoring] = useState(null);
    const [fruitsHarvested, setFruitsHarvested] = useState(0);
    const [fruitHarvestedImages, setFruitHarvestedImages] = useState([]);
    const [dateOfFinalization, setDateOfFinalization] = useState('');
    const [gourdTypes, setGourdTypes] = useState([]);
    const [gourdVarieties, setGourdVarieties] = useState([]);
    const [gourdVarietiesFiltered, setGourdVarietiesFiltered] = useState([]);
    const [gourdType, setGourdType] = useState('');
    const [gourdVariety, setGourdVariety] = useState('');
    const [pollinatedFlowers, setPollinatedFlowers] = useState(0);
    const [dateOfPollination, setDateOfPollination] = useState('');
    const [pollinatedFlowerImages, setPollinatedFlowerImages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchedUser = getUser();
        if (fetchedUser) {
            setCurrentUser(fetchedUser);
        } else {
            console.error('No current user found');
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser || !currentUser.id) return;

            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:4000/api/v1/Monitoring/${currentUser.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMonitorings(response.data);
            } catch (err) {
                setError('Error fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    useEffect(() => {
        const fetchGourdData = async () => {
            const token = sessionStorage.getItem('token');
            try {
                const [gourdTypesResponse, gourdVarietiesResponse] = await Promise.all([
                    axios.get('http://localhost:4000/api/v1/gourdType/getall', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:4000/api/v1/gourdVariety/getall', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setGourdTypes(gourdTypesResponse.data);
                setGourdVarieties(gourdVarietiesResponse.data);
            } catch (err) {
                setError('Error fetching gourd types or varieties');
            }
        };

        fetchGourdData();
    }, []);

    useEffect(() => {
        if (gourdType) {
            const filteredVarieties = gourdVarieties.filter(variety => variety.gourdType && variety.gourdType.name === gourdType);
            setGourdVarietiesFiltered(filteredVarieties);
            setGourdVariety(''); // Reset the selected variety when the type changes
        } else {
            setGourdVarietiesFiltered(gourdVarieties);  // Display all varieties if no type is selected
        }
    }, [gourdType, gourdVarieties]);

    const deleteMonitoring = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`http://localhost:4000/api/v1/Monitoring/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMonitorings(monitorings.filter((monitoring) => monitoring._id !== id));
            toast.success('Monitoring record deleted successfully');
        } catch (err) {
            toast.error('Error deleting monitoring record');
        }
    };

    const openModal = (monitoring) => {
        setSelectedMonitoring(monitoring);
        setFruitsHarvested(monitoring.fruitsHarvested);
        setFruitHarvestedImages(monitoring.fruitHarvestedImages || []);
        setDateOfFinalization(monitoring.dateOfFinalization || '');
        setModalVisible(true);
    };

    const updateMonitoring = async (id) => {
        // Prepare FormData
        const updatedMonitoring = new FormData();
        updatedMonitoring.append('fruitsHarvested', fruitsHarvested);
        updatedMonitoring.append('dateOfFinalization', dateOfFinalization);
        updatedMonitoring.append('status', fruitsHarvested > 0 ? 'Completed' : 'Failed');

        // If there are images to upload, append them to FormData
        Array.from(fruitHarvestedImages).forEach((file) => {
            updatedMonitoring.append('fruitHarvestedImages', file);  // Append file to FormData
        });

        console.log("Updated monitoring:", updatedMonitoring);

        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:4000/api/v1/Monitoring/${id}`,
                updatedMonitoring,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',  // Ensure multipart/form-data for file uploads
                    },
                }
            );
            // Update the list of monitorings with the new data from the API
            setMonitorings(
                monitorings.map((monitoring) =>
                    monitoring._id === response.data._id ? response.data : monitoring
                )
            );
            setModalVisible(false);  // Close the modal after update
            toast.success('Monitoring updated successfully');
        } catch (err) {
            console.error(err); // Log error response
            toast.error('Error updating monitoring');
        }
    };

    const createMonitoring = async () => {
        const selectedGourdType = gourdTypes.find(type => type.name === gourdType);
        const selectedGourdVariety = gourdVarieties.find(variety => variety.name === gourdVariety);
        
        const formData = new FormData();
        formData.append('gourdType', selectedGourdType._id); // Use ObjectId instead of string
        formData.append('variety', selectedGourdVariety._id); 
        formData.append("dateOfPollination", new Date().toISOString().split("T")[0]);
        formData.append("pollinatedFlowers", pollinatedFlowers);

        // Handle pollinated flower images if provided
        Array.from(pollinatedFlowerImages).forEach((file) => {
            formData.append("pollinatedFlowerImages", file);
        });

        // Handle fruits harvested as nullable
        formData.append("fruitsHarvested", fruitsHarvested || null);

        // Handle fruit harvested images if provided
        Array.from(fruitHarvestedImages).forEach((file) => {
            formData.append("fruitHarvestedImages", file);
        });

        // Handle date of finalization as nullable
        formData.append("dateOfFinalization", dateOfFinalization || null);

        formData.append("status", "In Progress");

        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:4000/api/v1/Monitoring",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setMonitorings([...monitorings, response.data]);
            setCreateModalVisible(false);
            toast.success("Monitoring record created successfully");
        } catch (err) {
            console.error(err);
            toast.error("Error creating monitoring record");
        }
    };

    if (loading) return <Spinner animation="border" variant="primary" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-4">
            <h2>Monitoring List</h2>
            <Button className="mb-3" onClick={() => setCreateModalVisible(true)}>
                <FaPlus /> Add Monitoring
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Gourd Type</th>
                        <th>Variety</th>
                        <th>Date of Pollination</th>
                        <th>Pollinated Flowers</th>
                        <th>Fruits Harvested</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {monitorings.map((monitoring) => (
                        <tr key={monitoring._id}>
                            <td>{monitoring.userID?.name || 'Unknown'}</td>
                            <td>{monitoring.gourdType?.name || 'Unknown'}</td>
                            <td>{monitoring.variety?.name || 'Unknown'}</td>
                            <td>{monitoring.dateOfPollination || 'N/A'}</td>
                            <td>{monitoring.pollinatedFlowers || 0}</td>
                            <td>{monitoring.fruitsHarvested}</td>
                            <td>{monitoring.status}</td>
                            <td>
                                <Button variant="primary" onClick={() => openModal(monitoring)} className="me-2">
                                    <FaPen />
                                </Button>
                                <Button variant="danger" onClick={() => deleteMonitoring(monitoring._id)}>
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
                    <Modal.Title>Edit Monitoring</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="fruitsHarvested">
                            <Form.Label>Fruits Harvested</Form.Label>
                            <Form.Control
                                type="number"
                                value={fruitsHarvested}
                                onChange={(e) => setFruitsHarvested(Number(e.target.value))}
                            />
                        </Form.Group>
                        <Form.Group controlId="fruitHarvestedImages" className="mt-3">
                            <Form.Label>Fruit Harvested Images</Form.Label>
                            <Form.Control type="file" multiple onChange={(e) => setFruitHarvestedImages(e.target.files)} />
                        </Form.Group>
                        <Form.Group controlId="dateOfFinalization" className="mt-3">
                            <Form.Label>Date of Finalization</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateOfFinalization}
                                onChange={(e) => setDateOfFinalization(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalVisible(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => updateMonitoring(selectedMonitoring._id)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Create Modal */}
            {/* Create Monitoring Modal */}
            <Modal show={createModalVisible} onHide={() => setCreateModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Monitoring</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Gourd Type Selection */}
                        <Form.Group controlId="gourdType">
                            <Form.Label>Gourd Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={gourdType}
                                onChange={(e) => setGourdType(e.target.value)}
                            >
                                <option value="">Select Gourd Type</option>
                                {gourdTypes.map((type) => (
                                    <option key={type._id} value={type.name}>
                                        {type.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="gourdVariety">
                            <Form.Label>Gourd Variety</Form.Label>
                            <Form.Control
                                as="select"
                                value={gourdVariety}
                                onChange={(e) => setGourdVariety(e.target.value)}
                            >
                                <option value="">Select Gourd Variety</option>
                                {gourdVarietiesFiltered.length === 0 ? (
                                    <option>No varieties available</option>
                                ) : (
                                    gourdVarietiesFiltered.map((variety) => (
                                        <option key={variety._id} value={variety.name}>
                                            {variety.name}
                                        </option>
                                    ))
                                )}

                            </Form.Control>
                        </Form.Group>

                        {/* Date of Pollination */}
                        <Form.Group controlId="dateOfPollination" className="mt-3">
                            <Form.Label>Date of Pollination</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateOfPollination}
                                onChange={(e) => setDateOfPollination(e.target.value)}
                            />
                        </Form.Group>

                        {/* Pollinated Flowers */}
                        <Form.Group controlId="pollinatedFlowers" className="mt-3">
                            <Form.Label>Pollinated Flowers</Form.Label>
                            <Form.Control
                                type="number"
                                value={pollinatedFlowers}
                                onChange={(e) => setPollinatedFlowers(Number(e.target.value))}
                            />
                        </Form.Group>

                        {/* Pollinated Flower Images */}
                        <Form.Group controlId="pollinatedFlowerImages" className="mt-3">
                            <Form.Label>Pollinated Flower Images</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={(e) => setPollinatedFlowerImages(e.target.files)}
                            />
                        </Form.Group>

                        {/* Fruits Harvested */}
                        <Form.Group controlId="fruitsHarvested" className="mt-3">
                            <Form.Label>Fruits Harvested</Form.Label>
                            <Form.Control
                                type="number"
                                value={fruitsHarvested}
                                onChange={(e) => setFruitsHarvested(Number(e.target.value))}
                            />
                        </Form.Group>

                        {/* Fruit Harvested Images */}
                        <Form.Group controlId="fruitHarvestedImages" className="mt-3">
                            <Form.Label>Fruit Harvested Images</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={(e) => setFruitHarvestedImages(e.target.files)}
                            />
                        </Form.Group>

                        {/* Date of Finalization */}
                        <Form.Group controlId="dateOfFinalization" className="mt-3">
                            <Form.Label>Date of Finalization</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateOfFinalization}
                                onChange={(e) => setDateOfFinalization(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCreateModalVisible(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createMonitoring}>
                        Create Monitoring
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default MonitoringList;
