import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { blue, purple, grey } from '@mui/material/colors';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  padding: 16px;
  border-radius: 16px;
  background-color: ${grey[100]};
`;

const StyledTypography = styled(Typography)`
  text-align: center;
  margin-bottom: 16px;
  color: ${purple[700]};
`;

const PollinationDashboard = () => {
  const [pollinationData, setPollinationData] = useState([]);

  // Fetch the pollination data
  useEffect(() => {
    const fetchPollinationData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Admincompleted/week`);
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

    // Group data by GourdType, Variety, and PlotNo
    pollinationData.forEach((item) => {
      const { gourdType, variety, week, year, plotNo, totalCompleted } = item;
      const key = `${gourdType}-${variety}- PlotNo. ${plotNo}`;

      if (!groupedData[key]) {
        groupedData[key] = [];
      }

      // Add data point for each week and year
      groupedData[key].push({
        name: `Week ${week}, ${year}`,
        totalCompleted,
      });
    });

    return groupedData;
  };

  // Generate charts for each GourdType, Variety, and PlotNo
  const renderCharts = () => {
    const groupedData = processData();

    return Object.keys(groupedData).map((key) => {
      const data = groupedData[key];

      return (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <StyledPaper elevation={3}>
            <StyledTypography variant="h6">
              {key.replace(/-/g, ' ')}
            </StyledTypography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={grey[300]} />
                <XAxis dataKey="name" stroke={grey[700]} />
                <YAxis stroke={grey[700]} />
                <Tooltip contentStyle={{ backgroundColor: grey[200], borderColor: grey[300] }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalCompleted"
                  stroke={blue[500]}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>
      );
    });
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <StyledTypography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
        Completed Pollination Dashboard
      </StyledTypography>
      <Grid container spacing={3}>
        {renderCharts()}
      </Grid>
    </Container>
  );
};

export default PollinationDashboard;