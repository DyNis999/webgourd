import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import { getUser } from '../../utils/helpers';
import './Profile.css'; // Assuming you have a CSS file for styling

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUser(fetchedUser);
      console.log('Fetched user:', fetchedUser);
    }
  }, []);

  if (!user) {
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
        </Col>
        <Col md={8} className="profile-posts">
          <Card className="profile-card"> {/* Add shadow to the card */}
            <Card.Body>
              <Card.Title>Posts</Card.Title>
              {/* Add content for posts here */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;