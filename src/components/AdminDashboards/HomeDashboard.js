import React from 'react';
import { Container } from 'react-bootstrap';
import FailedpollinationDashboard from './FailedpollinationDashboard';
import PollinatedFlowersByMonth from './PollinatedFlowersByMonth';
import CompletedpollinationDashboard from './CompletedpollinationDashboard';

const HomeDashboard = () => {
  return (
    <Container fluid>
      <PollinatedFlowersByMonth />
      <CompletedpollinationDashboard />
      <FailedpollinationDashboard />
    </Container>
  );
};

export default HomeDashboard;
