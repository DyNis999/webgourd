import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { red, purple, grey } from '@mui/material/colors';
import { getToken, getUser } from '../../utils/helpers';
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

        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/failed/week/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
      const { gourdType, week, year, plotNo, totalFailed } = item;
      const key = `${gourdType}- PlotNo. ${plotNo}`;

      if (!groupedData[key]) {
        groupedData[key] = [];
      }

      groupedData[key].push({
        name: `Week ${week}, ${year}`,
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
                <Line type="monotone" dataKey="totalFailed" stroke={red[500]} activeDot={{ r: 8 }} />
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
        My Failed Pollination Dashboard
      </StyledTypography>
      <Grid container spacing={3}>
        {renderCharts()}
      </Grid>
    </Container>
  );
};

export default FailedPollinationDashboard;