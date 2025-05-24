import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { blue, purple, grey } from '@mui/material/colors';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

  // Function to process data into a structure that can be used in Chart.js
  const processData = () => {
    const groupedData = {};

    // Group data by GourdType, Variety, and PlotNo
    pollinationData.forEach((item) => {
      const { gourdType, variety, week, year, plotNo, totalCompleted } = item;
      // const key = `${gourdType}-${variety}- PlotNo. ${plotNo}`;
       const key = `${gourdType}- PlotNo. ${plotNo}`;

      if (!groupedData[key]) {
        groupedData[key] = { labels: [], data: [] };
      }

      // Add data point for each week and year
      groupedData[key].labels.push(`Week ${week}, ${year}`);
      groupedData[key].data.push(totalCompleted);
    });

    return groupedData;
  };

  // Generate charts for each GourdType, Variety, and PlotNo
  const renderCharts = () => {
    const groupedData = processData();

    return Object.keys(groupedData).map((key) => {
      const { labels, data } = groupedData[key];

      const chartData = {
        labels,
        datasets: [
          {
            label: 'Total Completed',
            data,
            borderColor: blue[500],
            backgroundColor: blue[100],
            tension: 0.4,
          },
        ],
      };

      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            ticks: { color: grey[700] },
          },
          y: {
            ticks: { color: grey[700] },
          },
        },
      };

      return (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <StyledPaper elevation={3}>
            <StyledTypography variant="h6">
              {key.replace(/-/g, ' ')}
            </StyledTypography>
            <Line data={chartData} options={options} />
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