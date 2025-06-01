import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Divider } from '@mui/material';
import FailedpollinationDashboard from './FailedpollinationDashboard';
import PollinatedFlowersByMonth from './PollinatedFlowersByWeek';
import CompletedpollinationDashboard from './CompletedpollinationDashboard';
import GourdTypeUserSummary from './GourdTypeUser';
import AdminSidebar from '../Layout/AdminSidebar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { height, styled } from '@mui/system';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const StyledPaper = styled(Paper)`
  padding: 32px 24px;
  border-radius: 18px;
  background-color: #fff;
  box-shadow: 0px 4px 24px rgba(0,0,0,0.08);
  margin-bottom: 32px;
  min-width: 320px;
`;

const StyledButton = styled(Button)`
  margin-bottom: 32px;
  font-weight: bold;
  align-self: flex-end;
`;

const HomeDashboard = () => {
  const dashboardRef = useRef();
  const [successRates, setSuccessRates] = useState([]);
  const [overallSuccessRate, setOverallSuccessRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollinatedResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Adminpollination/week`);
        const completedResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Admincompleted/week`);
        const failedResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Adminfailed/week`);

        const pollinatedData = pollinatedResponse.data;
        const completedData = completedResponse.data;
        const failedData = failedResponse.data;

        const { rates, overallRate } = calculateSuccessRates(pollinatedData, completedData, failedData);
        setSuccessRates(rates);
        setOverallSuccessRate(overallRate);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);


  const donutData = {
    labels: successRates.map(({ gourdTypePlot }) => gourdTypePlot.replace(/-/g, ' ')),
    datasets: [
      {
        label: 'Success Rate (%)',
        data: successRates.map(({ successRate }) => Number(successRate)),
        backgroundColor: [
          '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#B266FF', '#FF6699', '#FF4444'
        ],
        borderWidth: 2,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}%` } },
    },
    cutout: '70%',
  };


  const calculateSuccessRates = (pollinatedData, completedData, failedData) => {
    const groupedData = {};
    let totalPollinated = 0;
    let totalCompleted = 0;

    pollinatedData.forEach(({ gourdType, plotNo, totalPollinated: pollinated }) => {
      const key = `${gourdType || 'Unknown GourdType'}-Plot ${plotNo || 'Undefined'}`;
      if (!groupedData[key]) {
        groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
      }
      groupedData[key].totalPollinated += pollinated || 0;
      totalPollinated += pollinated || 0;
    });

    completedData.forEach(({ gourdType, plotNo, totalCompleted: completed }) => {
      const key = `${gourdType || 'Unknown GourdType'}-Plot ${plotNo || 'Undefined'}`;
      if (!groupedData[key]) {
        groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
      }
      groupedData[key].totalCompleted += completed || 0;
      totalCompleted += completed || 0;
    });

    failedData.forEach(({ gourdType, plotNo, totalFailed }) => {
      const key = `${gourdType || 'Unknown GourdType'}-Plot ${plotNo || 'Undefined'}`;
      if (!groupedData[key]) {
        groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
      }
      groupedData[key].totalFailed += totalFailed || 0;
    });

    const rates = Object.keys(groupedData).map((key) => {
      const { totalPollinated, totalCompleted } = groupedData[key];
      const successRate = totalPollinated > 0 ? (totalCompleted / totalPollinated) * 100 : 0;
      return { gourdTypePlot: key, successRate: successRate.toFixed(2) };
    });

    const overallRate = totalPollinated > 0 ? (totalCompleted / totalPollinated) * 100 : 0;

    return { rates, overallRate: overallRate.toFixed(2) };
  };

  const handlePrintAll = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const imgWidth = 190;
    const imgHeight = 120;
    let yOffset = 10;

    if (dashboardRef.current) {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const xOffset = (pageWidth - imgWidth) / 2;
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
    }
    pdf.save('HomeDashboard.pdf');
  };
  return (
    <AdminSidebar>
      <Container maxWidth="xl" sx={{ padding: '40px 0' }}>
        <Box display="flex" justifyContent="flex-end">
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handlePrintAll}
          >
            Print Dashboard to PDF
          </StyledButton>
        </Box>
        <Box
          ref={dashboardRef}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            flexWrap: 'nowrap',
            alignItems: 'stretch',
            width: '100%',
            overflowX: 'auto',
          }}
        >
          {/* Main dashboard column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: '1 1 0', width: 'calc(100% - 300px)' }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 2, width: '100%', minHeight: 400 }}>
              <PollinatedFlowersByMonth />
            </Paper>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minWidth: 400, mb: 2, minHeight: 400 }}>
              <CompletedpollinationDashboard />
            </Paper>
          </Box>

          {/* Side summary column */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3, flex: '1 1 0',
            width: 'calc(100% - 300px)',
            padding: '0 20px',
            paddingTop: '0px'
          }}>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minWidth: 300, mb: 2, minHeight: 400 }}>
              <GourdTypeUserSummary />
            </Paper>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minWidth: 400, mb: 2, minHeight: 400 }}>
              <FailedpollinationDashboard />
            </Paper>

          </Box>

          <Box sx={{ flex: '1 1 0', width: '300px', display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: '450px' }}>
              <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={donutData} options={donutOptions} />
              </Box>
              <Divider sx={{ my: 2 }} />

              <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
                SUCCESS RATE
              </Typography>
              <Box sx={{ overflowX: 'auto',  height: 350 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                      <th style={{ padding: 8, borderRadius: 4 }}>Gourd Type & Plot</th>
                      <th style={{ padding: 8, borderRadius: 4 }}>Success Rate (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {successRates.map(({ gourdTypePlot, successRate }) => (
                      <tr key={gourdTypePlot}>
                        <td style={{ padding: 8 }}>{gourdTypePlot.replace(/-/g, ' ')}</td>
                        <td style={{ padding: 8 }}>{successRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" align="center" sx={{ marginTop: '20px' }}>
                Overall Success Rate: <strong>{overallSuccessRate}%</strong>
              </Typography>
            </Paper>
          </Box>

        </Box>
      </Container>
    </AdminSidebar>
  );
};

export default HomeDashboard;