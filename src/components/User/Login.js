import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Col, Row, Spinner, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { authenticate, getUser, errMsg, successMsg } from '../../utils/helpers';
import './auth.css'; // Updated CSS file name

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(""); // <-- Add this line
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '/Home';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.email.includes('@')) {
      errMsg('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      errMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setWarning(""); // Clear previous warning
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      console.log('Submitting login form with data:', formData);

      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/users/login`, formData, config);
      console.log('API Response:', data);

      successMsg('Login successful!');
      authenticate(data, () => {
        navigate(redirect);
        window.location.reload(); // Refresh the page after redirect
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      console.error('Login error:', msg);
      errMsg(msg);

      // Show warning if account is denied (archived)
      if (msg.toLowerCase().includes('archived')) {
        setWarning(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getUser()) {
      console.log('User is already logged in. Redirecting to:', redirect);
      navigate(redirect);
    }
  }, [navigate, redirect]);

return (
    <div
      className="login-bg"
      style={{
        minHeight: '100vh',
        backgroundImage: `url('/images/WELCOME TO GOURDTIFY APP.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container>
        <Row className="align-items-center" style={{ minHeight: '100vh' }}>
          {/* Empty column for spacing on the left */}
          <Col md={6} lg={7}></Col>
          <Col md={6} lg={5}>
            <Card className="card-custom p-4 mt-4">
              <Card.Body>
                <h2 className="text-center">Login</h2>
                {warning && (
                  <Alert variant="warning" className="text-center">
                    {warning}
                  </Alert>
                )}
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
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

                    <div className="text-center">
                      <Button variant="primary" type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                      </Button>
                    </div>
                  </Form>
                )}

                <p className="mt-3 text-center">
                  Don't have an account? <Link to="/register">Register here</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Login;