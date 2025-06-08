// import React, { useEffect, useState } from 'react';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import axios from 'axios';
// import { Container, Grid, Typography, Paper } from '@mui/material';
// import { blue, purple, grey } from '@mui/material/colors';
// import styled from 'styled-components';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const StyledPaper = styled(Paper)`
//   padding: 16px;
//   border-radius: 16px;
//   background-color: ${grey[100]};
// `;

// const StyledTypography = styled(Typography)`
//   text-align: center;
//   margin-bottom: 16px;
//   color: ${purple[700]};
// `;

// const PollinationDashboard = () => {
//   const [pollinationData, setPollinationData] = useState([]);

//   // Fetch the pollination data
//   useEffect(() => {
//     const fetchPollinationData = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Adminpollination/week`);
//         setPollinationData(response.data);
//       } catch (error) {
//         console.error('Error fetching pollination data:', error);
//       }
//     };

//     fetchPollinationData();
//   }, []);

//   // Function to process data into a structure that can be used in Chart.js
//   const processData = () => {
//     const groupedData = {};

//     // Group data by GourdType, Variety, and PlotNo
//     pollinationData.forEach((item) => {
//       const { gourdType, week, year, plotNo, totalPollinated } = item;
//       // const key = `${gourdType}-${variety}- PlotNo. ${plotNo}`;
//        const key = `${gourdType}- PlotNo. ${plotNo}`;

//       if (!groupedData[key]) {
//         groupedData[key] = { labels: [], data: [] };
//       }

//       // Add data point for each week and year
//       groupedData[key].labels.push(`Week ${week}, ${year}`);
//       groupedData[key].data.push(totalPollinated);
//     });

//     return groupedData;
//   };

//   // Generate charts for each GourdType, Variety, and PlotNo
//   const renderCharts = () => {
//     const groupedData = processData();

//     return Object.keys(groupedData).map((key) => {
//       const { labels, data } = groupedData[key];

//       const chartData = {
//         labels,
//         datasets: [
//           {
//             label: 'Total Pollinated',
//             data,
//             borderColor: blue[500],
//             backgroundColor: blue[100],
//             tension: 0.4,
//           },
//         ],
//       };

//       const options = {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'top',
//           },
//           tooltip: {
//             mode: 'index',
//             intersect: false,
//           },
//         },
//         scales: {
//           x: {
//             ticks: { color: grey[700] },
//           },
//           y: {
//             ticks: { color: grey[700] },
//           },
//         },
//       };

//       return (
//         <Grid item xs={12} sm={6} md={4} key={key}>
//           <StyledPaper elevation={3}>
//             <StyledTypography variant="h6">
//               {key.replace(/-/g, ' ')}
//             </StyledTypography>
//             <Line data={chartData} options={options} />
//           </StyledPaper>
//         </Grid>
//       );
//     });
//   };

//   return (
//     <Container maxWidth="lg" sx={{ marginTop: 4 }}>
//       <StyledTypography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
//         Pollination Dashboard
//       </StyledTypography>
//       <Grid container spacing={3}>
//         {renderCharts()}
//       </Grid>
//     </Container>
//   );
// };

// export default PollinationDashboard;


import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Container, Typography, Paper } from '@mui/material';
import { blue, purple, grey } from '@mui/material/colors';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
const StyledPaper = styled(Paper)`
  padding: 10px;
  width: 100%;
  height: 500px;
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
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Adminpollination/week`);
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
    pollinationData.forEach(({ gourdType, week, year, plotNo, totalPollinated }) => {
      const key = `${gourdType}- PlotNo. ${plotNo}`;
      const label = `Week ${week}, ${year}`;
      if (!grouped[key]) grouped[key] = {};
      grouped[key][label] = totalPollinated;
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
      borderColor: colorPalette[idx % colorPalette.length],
      backgroundColor: colorPalette[idx % colorPalette.length] + '33',
      tension: 0.4,
      fill: false,
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
      title: { display: true, text: 'Total Pollinated per Week (All Type-Plot)' }
    },
    scales: {
      x: { ticks: { color: grey[700] } },
      y: { ticks: { color: grey[700] } },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }} style={{ height: '400px' }}>
      <StyledTypography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
        Pollination Dashboard
      </StyledTypography>
      <StyledPaper elevation={3} style={{ height: '300px' , width: '100%' }}>
        <Bar data={chartData} options={{ ...options, maintainAspectRatio: false }} />
      </StyledPaper>
    </Container>
  );
};

export default PollinationDashboard;