import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Col, Row, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './auth.css'; // Updated CSS file name

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    image: null,
    street: '',
    apartment: '',
    zip: '',
    city: '',
    country: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg'); // Default preview
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result); // Set preview
        }
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/users/register`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct header is set
        },
      });

      console.log(response.data); // Log the response
      // Redirect to login page using Link component
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="card-custom p-4 mt-4">
            <Card.Body>
              <h2 className="text-center">Register</h2>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="image">
                  <Form.Label>Profile Image</Form.Label>
                  <div className="d-flex align-items-center">
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="rounded-circle mr-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <Form.Control type="file" onChange={handleFileChange} />
                  </div>
                </Form.Group>

                {/* Additional Address Fields */}
                <Form.Group controlId="street">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="apartment">
                  <Form.Label>Apartment</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="zip">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Zip code"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Centered Button */}
                <div className="text-center">
                  <Button variant="primary" type="submit" className="mt-3 auth-button">
                    Register
                  </Button>
                </div>
              </Form>
              <p className="mt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
  );
};

export default Register;
