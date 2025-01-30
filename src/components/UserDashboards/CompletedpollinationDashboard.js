import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { blue, purple } from '@mui/material/colors';
import { getUser, getToken } from '../../utils/helpers'; // Ensure correct path

const PollinationDashboard = () => {
  const [pollinationData, setPollinationData] = useState([]);
  const user = getUser();
  const token = getToken();

  useEffect(() => {
    const fetchPollinationData = async () => {
      if (!user || !user.userId) {
        console.error('User not found.');
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/Dashboard/completed/month/${user.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPollinationData(response.data);
      } catch (error) {
        console.error('Error fetching pollination data:', error);
      }
    };

    fetchPollinationData();
  }, [user, token]);

  const processData = () => {
    const groupedData = {};
    pollinationData.forEach(({ gourdType, variety, month, year, totalCompleted }) => {
      const key = `${gourdType}-${variety}`;
      if (!groupedData[key]) groupedData[key] = [];
      groupedData[key].push({ name: `${month}/${year}`, totalCompleted });
    });
    return groupedData;
  };

  const renderCharts = () => {
    const groupedData = processData();
    return Object.keys(groupedData).map((key) => (
      <Grid item xs={12} sm={6} md={4} key={key}>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>{key.replace('-', ' ')}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={groupedData[key]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalCompleted" stroke={blue[500]} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold', color: purple[700], textAlign: 'center' }}>
       My Completed Pollination Dashboard
      </Typography>
      <Grid container spacing={3}>{renderCharts()}</Grid>
    </Container>
  );
};

export default PollinationDashboard;