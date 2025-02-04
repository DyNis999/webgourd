import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import UserPost from '../Post/UserPost'; // Import the UserPost component
import CreatePost from '../Post/CreatePost'; // Import the CreatePost component
import './Profile.css'; // Assuming you have a CSS file for styling
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    const config = {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    };
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/users/me`, config);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      toast.error('User not found', {
        position: 'bottom-right'
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="profile-container">
      <Row>
        <Col md={4} className="profile-sidebar">
          <Card className="profile-card"> {/* Add shadow to the card */}
            <Card.Body className="text-center">
              <Image
                src={user.image || '/images/default_avatar.jpg'}
                alt={user.name}
                roundedCircle
                className="profile-image"
              />
              <a href="/me/update" className="edit-profile-link">Edit Profile</a>
              <div className="profile-details"> {/* Align text to the left */}
                <Card.Text>
                  <strong>Name:</strong> {user.name}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {user.email}
                </Card.Text>
                <Card.Text>
                  <strong>Phone:</strong> {user.phone}
                </Card.Text>
                <Card.Text>
                  <strong>Country:</strong> {user.country}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
          <Card className="profile-card mt-4"> {/* Add shadow to the card */}
            <Card.Body>
              <Card.Title>Create Post</Card.Title>
              <CreatePost /> 
            </Card.Body>
          </Card>
        </Col>
        <Col md={8} className="profile-posts vertical-posts">
          <Card className="profile-card"> {/* Add shadow to the card */}
            <Card.Body>
              <Card.Title>Posts</Card.Title>
              <UserPost />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;