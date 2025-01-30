import React from 'react';
import { Container } from 'react-bootstrap';
import FailedpollinationDashboard from './FailedpollinationDashboard';
import PollinatedFlowersByMonth from './PollinatedFlowersByMonth';
import CompletedpollinationDashboard from './CompletedpollinationDashboard';
import AdminSidebar from '../Layout/AdminSidebar';

const HomeDashboard = () => {
  return (
    <AdminSidebar>
      <Container fluid>
        <PollinatedFlowersByMonth />
        <CompletedpollinationDashboard />
        <FailedpollinationDashboard />
      </Container>
    </AdminSidebar>
  );
};

export default HomeDashboard;
