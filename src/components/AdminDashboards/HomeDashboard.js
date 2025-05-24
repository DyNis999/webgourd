import React, { useRef, useState, useEffect } from 'react';
import { Container, Grid, Typography, Button, Table, Paper } from '@mui/material';
import FailedpollinationDashboard from './FailedpollinationDashboard';
import PollinatedFlowersByMonth from './PollinatedFlowersByWeek';
import CompletedpollinationDashboard from './CompletedpollinationDashboard';
import AdminSidebar from '../Layout/AdminSidebar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)`
  padding: 24px;
  border-radius: 16px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  margin-bottom: 20px;
  font-weight: bold;
`;

const StyledTable = styled(Table)`
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
`;

const HomeDashboard = () => {
  const dashboardRef = useRef();
  const [successRates, setSuccessRates] = useState([]);
  const [overallSuccessRate, setOverallSuccessRate] = useState(0);

  // Fetch data for success rate calculation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollinatedResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Adminpollination/week`);
        const completedResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Admincompleted/week`);
        const failedResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Adminfailed/week`);

        const pollinatedData = pollinatedResponse.data;
        const completedData = completedResponse.data;
        const failedData = failedResponse.data;

        // Calculate success rates
        const { rates, overallRate } = calculateSuccessRates(pollinatedData, completedData, failedData);
        setSuccessRates(rates);
        setOverallSuccessRate(overallRate);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to calculate success rates
  const calculateSuccessRates = (pollinatedData, completedData, failedData) => {
    const groupedData = {};
    let totalPollinated = 0;
    let totalCompleted = 0;

    // Group pollinated data by GourdType, Variety, and PlotNo
    pollinatedData.forEach(({ gourdType, variety, plotNo, totalPollinated: pollinated }) => {
      // const key = `${gourdType || 'Unknown GourdType'}-${variety || 'Unknown Variety'}-Plot ${plotNo || 'Undefined'}`;
       const key = `${gourdType || 'Unknown GourdType'}-Plot ${plotNo || 'Undefined'}`;
      if (!groupedData[key]) {
        groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
      }
      groupedData[key].totalPollinated += pollinated || 0;
      totalPollinated += pollinated || 0;
    });

    // Add completed data
    completedData.forEach(({ gourdType, variety, plotNo, totalCompleted: completed }) => {
      // const key = `${gourdType || 'Unknown GourdType'}-${variety || 'Unknown Variety'}-Plot ${plotNo || 'Undefined'}`;
       const key = `${gourdType || 'Unknown GourdType'}-Plot ${plotNo || 'Undefined'}`;
      if (!groupedData[key]) {
        groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
      }
      groupedData[key].totalCompleted += completed || 0;
      totalCompleted += completed || 0;
    });

    // Add failed data
    failedData.forEach(({ gourdType, variety, plotNo, totalFailed }) => {
      // const key = `${gourdType || 'Unknown GourdType'}-${variety || 'Unknown Variety'}-Plot ${plotNo || 'Undefined'}`;
       const key = `${gourdType || 'Unknown GourdType'}-Plot ${plotNo || 'Undefined'}`;
      if (!groupedData[key]) {
        groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
      }
      groupedData[key].totalFailed += totalFailed || 0;
    });

    // Calculate success rates
    const rates = Object.keys(groupedData).map((key) => {
      const { totalPollinated, totalCompleted } = groupedData[key];
      const successRate = totalPollinated > 0 ? (totalCompleted / totalPollinated) * 100 : 0;
      return { gourdTypePlot: key, successRate: successRate.toFixed(2) };
    });

    // Calculate overall success rate
    const overallRate = totalPollinated > 0 ? (totalCompleted / totalPollinated) * 100 : 0;

    return { rates, overallRate: overallRate.toFixed(2) };
  };

  // Function to capture and print all dashboards
  const handlePrintAll = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait mode, A4 size
    const pageWidth = pdf.internal.pageSize.width; // Width of the page
    const imgWidth = 190; // Width of the image in the PDF
    const imgHeight = 120; // Fixed height for each dashboard
    let yOffset = 10; // Initial vertical offset

    if (dashboardRef.current) {
      const dashboardElements = dashboardRef.current.querySelectorAll('.dashboard-section');
      for (const element of dashboardElements) {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        // Center the image horizontally
        const xOffset = (pageWidth - imgWidth) / 2;
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight + 10; // Add spacing between dashboards

        // Add a new page if the content exceeds the page height
        if (yOffset + imgHeight > pdf.internal.pageSize.height) {
          pdf.addPage();
          yOffset = 10; // Reset vertical offset for the new page
        }
      }
    }

    pdf.save('HomeDashboard.pdf');
  };

  return (
    <AdminSidebar>
      <Container ref={dashboardRef} sx={{ padding: '20px' }}>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handlePrintAll}
        >
          Print All Dashboards to PDF
        </StyledButton>
        <Grid container spacing={3}>
          <Grid item xs={12} className="dashboard-section">
            <PollinatedFlowersByMonth />
          </Grid>
          <Grid item xs={12} className="dashboard-section">
            <CompletedpollinationDashboard />
          </Grid>
          <Grid item xs={12} className="dashboard-section">
            <FailedpollinationDashboard />
          </Grid>
          <Grid item xs={12} className="dashboard-section">
            <StyledPaper>
              <Typography variant="h5" align="center" gutterBottom>
                SUCCESS RATE
              </Typography>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Gourd Type & Plot</th>
                    <th>Success Rate (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {successRates.map(({ gourdTypePlot, successRate }) => (
                    <tr key={gourdTypePlot}>
                      <td>{gourdTypePlot.replace(/-/g, ' ')}</td>
                      <td>{successRate}</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
              <Typography variant="h6" align="center" sx={{ marginTop: '20px' }}>
                Overall Success Rate: <strong>{overallSuccessRate}%</strong>
              </Typography>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </AdminSidebar>
  );
};

export default HomeDashboard;