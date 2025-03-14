import React, { useRef, useState, useEffect } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import FailedpollinationDashboard from './FailedpollinationDashboard';
import PollinatedFlowersByMonth from './PollinatedFlowersByWeek';
import CompletedpollinationDashboard from './CompletedpollinationDashboard';
import AdminSidebar from '../Layout/AdminSidebar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

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
      const key = `${gourdType || 'Unknown GourdType'}-${variety || 'Unknown Variety'}-Plot ${plotNo || 'Undefined'}`;
      if (!groupedData[key]) {
        groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
      }
      groupedData[key].totalPollinated += pollinated || 0;
      totalPollinated += pollinated || 0;
    });

    // Add completed data
    completedData.forEach(({ gourdType, variety, plotNo, totalCompleted: completed }) => {
      const key = `${gourdType || 'Unknown GourdType'}-${variety || 'Unknown Variety'}-Plot ${plotNo || 'Undefined'}`;
      if (!groupedData[key]) {
        groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
      }
      groupedData[key].totalCompleted += completed || 0;
      totalCompleted += completed || 0;
    });

    // Add failed data
    failedData.forEach(({ gourdType, variety, plotNo, totalFailed }) => {
      const key = `${gourdType || 'Unknown GourdType'}-${variety || 'Unknown Variety'}-Plot ${plotNo || 'Undefined'}`;
      if (!groupedData[key]) {
        groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
      }
      groupedData[key].totalFailed += totalFailed || 0;
    });

    // Calculate success rates
    const rates = Object.keys(groupedData).map((key) => {
      const { totalPollinated, totalCompleted } = groupedData[key];
      const successRate = totalPollinated > 0 ? (totalCompleted / totalPollinated) * 100 : 0;
      return { gourdTypeVarietyPlot: key, successRate: successRate.toFixed(2) };
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
      <Container fluid ref={dashboardRef}>
        <Button
          variant="primary"
          onClick={handlePrintAll}
          style={{ marginBottom: '20px' }}
        >
          Print All Dashboards to PDF
        </Button>
        <div className="dashboard-section">
          <PollinatedFlowersByMonth />
        </div>
        <div className="dashboard-section">
          <CompletedpollinationDashboard />
        </div>
        <div className="dashboard-section">
          <FailedpollinationDashboard />
        </div>
        <div className="dashboard-section">
          <h4 className="text-center mb-4">SUCCESS RATE</h4>
          <Table striped bordered hover responsive className="table-success-rate">
            <thead className="table-dark">
              <tr>
                <th>Gourd Type, Variety & Plot</th>
                <th>Success Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {successRates.map(({ gourdTypeVarietyPlot, successRate }) => (
                <tr key={gourdTypeVarietyPlot}>
                  <td>{gourdTypeVarietyPlot.replace(/-/g, ' ')}</td>
                  <td>{successRate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h5 className="text-center mt-4">Overall Success Rate: <strong>{overallSuccessRate}%</strong></h5>
        </div>
      </Container>
    </AdminSidebar>
  );
};

export default HomeDashboard;