import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Container, Typography, Paper } from '@mui/material';
import { blue, purple, grey, green, orange, red, teal, pink } from '@mui/material/colors';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const colorPalette = [
  blue[500], purple[500], green[500], orange[500], red[500], teal[500], pink[500], '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
];

const GourdTypeUserSummary = () => {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/GourdTypeUserSummary`);
        setSummaryData(response.data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };
    fetchSummary();
  }, []);

  // Prepare unique gourd types and users
  const gourdTypes = Array.from(new Set(summaryData.map(item => item.y)));
  const users = Array.from(new Set(summaryData.map(item => item.color)));

  // Prepare datasets for each user (stacked)
  const datasets = users.map((user, idx) => ({
    label: user || 'Unknown User',
    data: gourdTypes.map(gourd =>
      (summaryData.find(item => item.y === gourd && item.color === user)?.x) || 0
    ),
    backgroundColor: colorPalette[idx % colorPalette.length],
    stack: 'Stack 0',
  }));

  const chartData = {
    labels: gourdTypes,
    datasets,
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Gourd Type & User Summary (Stacked)' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { stacked: true, ticks: { color: grey[700] } },
      y: { stacked: true, ticks: { color: grey[700] } },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <StyledTypography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
        Gourd Type & User Summary
      </StyledTypography>
      <StyledPaper elevation={3}>
        <Bar data={chartData} options={options} />
      </StyledPaper>
    </Container>
  );
};

export default GourdTypeUserSummary;