import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { blue, purple } from '@mui/material/colors';

const PollinationDashboard = () => {
  const [pollinationData, setPollinationData] = useState([]);

  // Fetch the pollination data
  useEffect(() => {
    const fetchPollinationData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Adminpollination/month`);
        setPollinationData(response.data);
      } catch (error) {
        console.error('Error fetching pollination data:', error);
      }
    };

    fetchPollinationData();
  }, []);

  // Function to process data into a structure that can be used in Recharts
  const processData = () => {
    const groupedData = {};

    // Group data by GourdType and Variety
    pollinationData.forEach((item) => {
      const { gourdType, variety, month, year, day, totalPollinated } = item;
      const key = `${gourdType}-${variety}`;

      if (!groupedData[key]) {
        groupedData[key] = [];
      }

      // Add data point for each month and year
      groupedData[key].push({
        name: `${day}/${month}/${year}`,
        totalPollinated,
      });
    });

    return groupedData;
  };

  // Generate charts for each GourdType and Variety
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
                <Line
                  type="monotone"
                  dataKey="totalPollinated"
                  stroke={blue[500]}
                  activeDot={{ r: 8 }}
                />
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
        Pollination 
      </Typography>
      <Grid container spacing={3}>
        {renderCharts()}
      </Grid>
    </Container>
  );
};

export default PollinationDashboard;
