// import React, { useRef, useState, useEffect } from 'react';
// import { Box, Container, Typography, Button, Paper, Divider } from '@mui/material';
// import FailedpollinationDashboard from './FailedpollinationDashboard';
// import PollinatedFlowersByMonth from './PollinatedFlowersByWeek';
// import CompletedpollinationDashboard from './CompletedpollinationDashboard';
// import GourdTypeUserSummary from './GourdTypeUser';
// import AdminSidebar from '../Layout/AdminSidebar';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import axios from 'axios';
// import { height, styled } from '@mui/system';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// ChartJS.register(ArcElement, Tooltip, Legend);

// const StyledPaper = styled(Paper)`
//   padding: 32px 24px;
//   border-radius: 18px;
//   background-color: #fff;
//   box-shadow: 0px 4px 24px rgba(0,0,0,0.08);
//   margin-bottom: 32px;
//   min-width: 320px;
// `;

// const StyledButton = styled(Button)`
//   margin-bottom: 32px;
//   font-weight: bold;
//   align-self: flex-end;
// `;

// const HomeDashboard = () => {
//   const dashboardRef = useRef();
//   const [successRates, setSuccessRates] = useState([]);
//   const [overallSuccessRate, setOverallSuccessRate] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const pollinatedResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Adminpollination/week`);
//         const completedResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Admincompleted/week`);
//         const failedResponse = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/Adminfailed/week`);

//         const pollinatedData = pollinatedResponse.data;
//         const completedData = completedResponse.data;
//         const failedData = failedResponse.data;

//         const { rates, overallRate } = calculateSuccessRates(pollinatedData, completedData, failedData);
//         setSuccessRates(rates);
//         setOverallSuccessRate(overallRate);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       }
//     };

//     fetchData();
//   }, []);


//   const donutData = {
//     labels: successRates.map(({ gourdTypePlot }) => gourdTypePlot.replace(/-/g, ' ')),
//     datasets: [
//       {
//         label: 'Success Rate (%)',
//         data: successRates.map(({ successRate }) => Number(successRate)),
//         backgroundColor: [
//           '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#B266FF', '#FF6699', '#FF4444'
//         ],
//         borderWidth: 2,
//       },
//     ],
//   };

//   const donutOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'bottom' },
//       tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}%` } },
//     },
//     cutout: '70%',
//   };


//   const calculateSuccessRates = (pollinatedData, completedData, failedData) => {
//     const groupedData = {};
//     let totalPollinated = 0;
//     let totalCompleted = 0;

//     pollinatedData.forEach(({ gourdType, plotNo, totalPollinated: pollinated }) => {
//       const key = `${gourdType || 'Unknown GourdType'}-Plot ${plotNo || 'Undefined'}`;
//       if (!groupedData[key]) {
//         groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
//       }
//       groupedData[key].totalPollinated += pollinated || 0;
//       totalPollinated += pollinated || 0;
//     });

//     completedData.forEach(({ gourdType, plotNo, totalCompleted: completed }) => {
//       const key = `${gourdType || 'Unknown GourdType'}-Plot ${plotNo || 'Undefined'}`;
//       if (!groupedData[key]) {
//         groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
//       }
//       groupedData[key].totalCompleted += completed || 0;
//       totalCompleted += completed || 0;
//     });

//     failedData.forEach(({ gourdType, plotNo, totalFailed }) => {
//       const key = `${gourdType || 'Unknown GourdType'}-Plot ${plotNo || 'Undefined'}`;
//       if (!groupedData[key]) {
//         groupedData[key] = { totalPollinated: 0, totalCompleted: 0, totalFailed: 0 };
//       }
//       groupedData[key].totalFailed += totalFailed || 0;
//     });

//     const rates = Object.keys(groupedData).map((key) => {
//       const { totalPollinated, totalCompleted } = groupedData[key];
//       let successRate = totalPollinated > 0 ? (totalCompleted / totalPollinated) * 100 : 0;
//       successRate = Math.min(successRate, 100); // Cap at 100%
//       return { gourdTypePlot: key, successRate: successRate.toFixed(2) };
//     });

//     let overallRate = totalPollinated > 0 ? (totalCompleted / totalPollinated) * 100 : 0;
//     overallRate = Math.min(overallRate, 100); // Cap at 100%
//     return { rates, overallRate: overallRate.toFixed(2) };
//   };

//   const handlePrintAll = async () => {
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.width;
//     const imgWidth = 190;
//     const imgHeight = 120;
//     let yOffset = 10;

//     if (dashboardRef.current) {
//       const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
//       const imgData = canvas.toDataURL('image/png');
//       const xOffset = (pageWidth - imgWidth) / 2;
//       pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
//     }
//     pdf.save('HomeDashboard.pdf');
//   };
//   return (
//     <AdminSidebar>
//       <Container maxWidth="xl" sx={{ padding: '40px 0' }}>
//         <Box display="flex" justifyContent="flex-end">
//           <StyledButton
//             variant="contained"
//             color="primary"
//             onClick={handlePrintAll}
//           >
//             Print Dashboard to PDF
//           </StyledButton>
//         </Box>
//         <Box
//           ref={dashboardRef}
//           sx={{
//             display: 'flex',
//             flexDirection: 'row',
//             gap: 3,
//             flexWrap: 'nowrap',
//             alignItems: 'stretch',
//             width: '100%',
//             overflowX: 'auto',
//           }}
//         >
//           {/* Main dashboard column */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: '1 1 0', width: 'calc(100% - 300px)' }}>
//             <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 2, width: '100%', minHeight: 400 }}>
//               <PollinatedFlowersByMonth />
//             </Paper>
//             <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minWidth: 400, mb: 2, minHeight: 400 }}>
//               <CompletedpollinationDashboard />
//             </Paper>
//           </Box>

//           {/* Side summary column */}
//           <Box sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 3, flex: '1 1 0',
//             width: 'calc(100% - 300px)',
//             padding: '0 20px',
//             paddingTop: '0px'
//           }}>

//             <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minWidth: 300, mb: 2, minHeight: 400 }}>
//               <GourdTypeUserSummary />
//             </Paper>

//             <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minWidth: 400, mb: 2, minHeight: 400 }}>
//               <FailedpollinationDashboard />
//             </Paper>

//           </Box>

//           <Box sx={{ flex: '1 1 0', width: '300px', display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
//             <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: '450px' }}>
//               <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                 <Doughnut data={donutData} options={donutOptions} />
//               </Box>
//               <Divider sx={{ my: 2 }} />

//               <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
//                 SUCCESS RATE
//               </Typography>
//               <Box sx={{ overflowX: 'auto', height: 350 }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
//                   <thead>
//                     <tr style={{ background: '#f0f0f0' }}>
//                       <th style={{ padding: 8, borderRadius: 4 }}>Gourd Type & Plot</th>
//                       <th style={{ padding: 8, borderRadius: 4 }}>Success Rate (%)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {successRates.map(({ gourdTypePlot, successRate }) => (
//                       <tr key={gourdTypePlot}>
//                         <td style={{ padding: 8 }}>{gourdTypePlot.replace(/-/g, ' ')}</td>
//                         <td style={{ padding: 8 }}>{successRate}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </Box>
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="h6" align="center" sx={{ marginTop: '20px' }}>
//                 Overall Success Rate: <strong>{overallSuccessRate}%</strong>
//               </Typography>
//             </Paper>
//           </Box>

//         </Box>
//       </Container>
//     </AdminSidebar>
//   );
// };

// export default HomeDashboard;

import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Divider, Switch, useTheme, ThemeProvider, createTheme } from '@mui/material';
import FailedpollinationDashboard from './FailedpollinationDashboard';
import PollinatedFlowersByMonth from './PollinatedFlowersByWeek';
import CompletedpollinationDashboard from './CompletedpollinationDashboard';
import GourdTypeUserSummary from './GourdTypeUser';
import AdminSidebar from '../Layout/AdminSidebar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { styled } from '@mui/system';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
ChartJS.register(ArcElement, Tooltip, Legend);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px 24px',
  borderRadius: 18,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 4px 24px rgba(0,0,0,0.08)',
  marginBottom: 32,
  minWidth: 320,
}));

const StyledButton = styled(Button)`
  margin-bottom: 32px;
  font-weight: bold;
  align-self: flex-end;
`;

const StatCard = styled(Paper)(({ theme }) => ({
  padding: '24px 32px',
  borderRadius: 14,
  background: theme.palette.mode === 'dark' ? '#23272f' : '#f7fafc',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 180,
}));

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        background: {
          default: '#f4f6fa',
          paper: '#fff',
        },
      }
      : {
        background: {
          default: '#181a20',
          paper: '#23272f',
        },
        text: {
          primary: '#fff',
          secondary: '#b0b0b0',
        },
      }),
  },
});

const HomeDashboard = () => {
  const [mode, setMode] = useState('light');
  const theme = createTheme(getDesignTokens(mode));
  const dashboardRef = useRef();
  const [successRates, setSuccessRates] = useState([]);
  const [overallSuccessRate, setOverallSuccessRate] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

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

    // Fetch user and post counts
    const fetchCounts = async () => {
      try {
        const userRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/users/count`);
        const postRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/Dashboard/posts/count`);
        setUserCount(userRes.data.count || 0);
        setPostCount(postRes.data.count || 0);
      } catch (err) {
        setUserCount(0);
        setPostCount(0);
      }
    };

    fetchData();
    fetchCounts();
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
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
    height: 250,
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
      let successRate = totalPollinated > 0 ? (totalCompleted / totalPollinated) * 100 : 0;
      successRate = Math.min(successRate, 100); // Cap at 100%
      return { gourdTypePlot: key, successRate: successRate.toFixed(2) };
    });

    let overallRate = totalPollinated > 0 ? (totalCompleted / totalPollinated) * 100 : 0;
    overallRate = Math.min(overallRate, 100); // Cap at 100%
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
    <ThemeProvider theme={theme}>
      <AdminSidebar>
        <Container maxWidth={false} // <-- Make container full width
          sx={{
            width: '100%', 
            padding: '40px 0',
            bgcolor: 'background.default',
            minHeight: '100vh'
          }}>


          <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handlePrintAll}
            >
              Print Dashboard to PDF
            </StyledButton>

          </Box>


          <Box flexDirection="column" gap={2} mb={3} >
            {/* Theme Switch at the left above counters */}
            <Box display="flex" alignItems="center" mb={2} >
              <Switch
                checked={mode === 'dark'}
                onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
                color="default"
                inputProps={{ 'aria-label': 'toggle theme' }}
                sx={{ mr: 1 }}
              />
              <Typography variant="body1" color="text.primary" fontWeight="bold">

                {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Typography>
            </Box>

            {/* User and Post Count Cards in a row */}
            <Box display="flex" gap={3} justifyContent="flex-start" flexWrap="wrap">
              <StatCard
                elevation={3}
                sx={{
                  minWidth: 200,
                  p: 3,
                  borderRadius: 4,
                  border: '1px solid #e0e0e0',
                  boxShadow: '0px 2px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  backgroundColor: 'background.paper',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <PeopleIcon color="primary" />
                  <Typography variant="subtitle2" color="primary" fontWeight="bold">
                    Users
                  </Typography>
                </Box>
                <Typography variant="h4" color="text.primary" fontWeight="bold">
                  {userCount}
                </Typography>
              </StatCard>

              <StatCard
                elevation={3}
                sx={{
                  minWidth: 200,
                  p: 3,
                  borderRadius: 4,
                  border: '1px solid #e0e0e0',
                  boxShadow: '0px 2px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  backgroundColor: 'background.paper',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <ArticleIcon color="secondary" />
                  <Typography variant="subtitle2" color="secondary" fontWeight="bold">
                    Posts
                  </Typography>
                </Box>
                <Typography variant="h4" color="text.primary" fontWeight="bold">
                  {postCount}
                </Typography>
              </StatCard>
            </Box>
          </Box>



          <Box
            ref={dashboardRef}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              flexWrap: 'nowrap',
              alignItems: 'stretch',
              width: '100%',
              // overflowX: 'auto',
            }}
          >
            {/* Main dashboard column */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3, flex: '1 1 0',
              width: 'calc(100% - 300px)',
              padding: '0 20px',
              paddingTop: '0px'
            }}>
              <StyledPaper elevation={3}>
                <PollinatedFlowersByMonth />
              </StyledPaper>
              <StyledPaper elevation={3}>
                <CompletedpollinationDashboard />
              </StyledPaper>
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
              <StyledPaper elevation={3}>
                <GourdTypeUserSummary />
              </StyledPaper>
              <StyledPaper elevation={3}>
                <FailedpollinationDashboard />
              </StyledPaper>
            </Box>

            <Box sx={{ flex: '1 1 0', width: '300px', display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              <StyledPaper elevation={3} sx={{ width: '450px' }}>
                <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Doughnut data={donutData} options={donutOptions} />
                </Box>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
                  SUCCESS RATE
                </Typography>
                <Box sx={{ overflowX: 'auto', height: 350 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
                    <thead>
                      <tr style={{ background: theme.palette.mode === 'dark' ? '#23272f' : '#f0f0f0' }}>
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
              </StyledPaper>
            </Box>
          </Box>
        </Container>
      </AdminSidebar>
    </ThemeProvider>
  );
};

export default HomeDashboard;