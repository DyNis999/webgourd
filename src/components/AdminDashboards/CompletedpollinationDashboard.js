import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Container, Typography, Paper } from '@mui/material';
import { blue, purple, grey } from '@mui/material/colors';
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

const PollinationDashboard = () => {
  const [pollinationData, setPollinationData] = useState([]);

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

  // Prepare all unique week-year labels, sorted
  const getAllLabels = () => {
    const labelSet = new Set();
    pollinationData.forEach(({ week, year }) => {
      labelSet.add(`Week ${week}, ${year}`);
    });
    // Sort by year then week
    return Array.from(labelSet).sort((a, b) => {
      const [_, wA, yA] = a.match(/Week (\d+), (\d+)/);
      const [__, wB, yB] = b.match(/Week (\d+), (\d+)/);
      return yA - yB || wA - wB;
    });
  };

  // Group data by type-plot
  const processData = () => {
    const grouped = {};
    pollinationData.forEach(({ gourdType, week, year, plotNo, totalCompleted }) => {
      const key = `${gourdType}- PlotNo. ${plotNo}`;
      const label = `Week ${week}, ${year}`;
      if (!grouped[key]) grouped[key] = {};
      grouped[key][label] = totalCompleted;
    });
    return grouped;
  };

  // Build datasets for Chart.js
  const buildDatasets = (labels, groupedData) => {
    const colorPalette = [
      blue[500], purple[500], '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];
    return Object.keys(groupedData).map((key, idx) => ({
      label: key.replace(/-/g, ' '),
      data: labels.map(label => groupedData[key][label] || 0),
      backgroundColor: colorPalette[idx % colorPalette.length],
      stack: 'Stack 0',
    }));
  };

  const labels = getAllLabels();
  const groupedData = processData();
  const datasets = buildDatasets(labels, groupedData);

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
      title: { display: true, text: 'Total Completed per Week (All Type-Plot)' }
    },
    scales: {
      x: { stacked: true, ticks: { color: grey[700] } },
      y: { stacked: true, ticks: { color: grey[700] } },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <StyledTypography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
        Completed Pollination Dashboard
      </StyledTypography>
      <StyledPaper elevation={3}>
        <Bar data={chartData} options={options} />
      </StyledPaper>
    </Container>
  );
};

export default PollinationDashboard;