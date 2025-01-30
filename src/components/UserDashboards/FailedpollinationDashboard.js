import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { red, purple } from '@mui/material/colors';
import { getToken, getUser } from '../../utils/helpers'; // Import authentication helpers

const FailedPollinationDashboard = () => {
  const [pollinationData, setPollinationData] = useState([]);

  useEffect(() => {
    const fetchPollinationData = async () => {
      try {
        const token = getToken();
        const user = getUser();

        if (!token || !user) {
          console.error('User not authenticated');
          return;
        }

        const response = await axios.get(`http://localhost:4000/api/v1/Dashboard/failed/month/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Include authentication token
        });

        setPollinationData(response.data);
      } catch (error) {
        console.error('Error fetching pollination data:', error);
      }
    };

    fetchPollinationData();
  }, []);

  const processData = () => {
    const groupedData = {};

    pollinationData.forEach((item) => {
      const { gourdType, variety, month, year, day, totalFailed } = item;
      const key = `${gourdType}-${variety}`;

      if (!groupedData[key]) {
        groupedData[key] = [];
      }

      groupedData[key].push({
        name: `${day}/${month}/${year}`,
        totalFailed,
      });
    });

    return groupedData;
  };

  const renderCharts = () => {
    const groupedData = processData();

    return Object.keys(groupedData).map((key) => {
      const data = groupedData[key];

      return (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
              {key.replace('-', ' ')}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalFailed" stroke={red[500]} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      );
    });
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold', color: purple[700], textAlign: 'center' }}>
       My Failed Pollination Dashboard
      </Typography>
      <Grid container spacing={3}>
        {renderCharts()}
      </Grid>
    </Container>
  );
};

export default FailedPollinationDashboard;
