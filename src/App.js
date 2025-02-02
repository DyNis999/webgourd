import React, { useState, useEffect } from 'react'; import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Layout/Header';
import Login from './components/User/Login';
import Register from './components/User/Register';
import Home from './components/Home';
import "react-toastify/dist/ReactToastify.css";
import Profile from './components/User/Profile';
import CategoryCreate from './components/Category/createCategory';
import UpdateCategory from './components/Category/UpdateCategory';
import ViewCategory from './components/Category/ViewCategories';
import PostCreate from './components/Post/CreatePost';
import UpdatePost from './components/Post/UpdatePost';
import Newsfeed from './components/Post/Socialmedia';
import Userfeed from './components/Post/UserPost';
import Topcontributor from './components/Layout/Topcontributor';
import UserManagement from './components/User/AdminUserManagement';
import ChatScreen from './components/chat/chatapp';
import Chatbox from './components/chat/Chatbox';
import GourdChat from './components/chat/GourdChat';
import Landing from './components/Layout/Landingpage';
import GourdType from './components/Monitoring/GourdTypeCreate';
import GourdVariety from './components/Monitoring/GourdVarietyCreate';
import MonitoringList from './components/Monitoring/MonitoringTable';
import PollinatedBymonth from './components/AdminDashboards/PollinatedFlowersByMonth';
import Completed from './components/AdminDashboards/CompletedpollinationDashboard';
import Failed from './components/AdminDashboards/FailedpollinationDashboard';
import UserPollinatedBymonth from './components/UserDashboards/PollinatedFlowersByMonth';
import UserCompleted from './components/UserDashboards/CompletedpollinationDashboard';
import UserFailed from './components/UserDashboards/FailedpollinationDashboard';
import AdminPostManagement from './components/Post/AdminPostManagement';
import AdminDashboard from './components/AdminDashboards/HomeDashboard';
import LearnHome from './components/Learn/LearnHome';
import GourdUses from './components/Learn/GourdUses';
import HistoryGourd from './components/Learn/HistoryGourd';
import Botany from './components/Learn/Botany';
import UpdateProfile from './components/User/UpdateProfile';
import { getToken } from './utils/helpers';

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing isAuthenticated={isAuthenticated} />} /> 
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} exact="true" />
          <Route path="/learn" element={<LearnHome />} />
          <Route path="/gourduses" element={<GourdUses />} />
          <Route path="/historygourd" element={<HistoryGourd />} />
          <Route path="/botany" element={<Botany />} />

          <Route path="/createCategory" element={<CategoryCreate />} />
          <Route path="/UpdateCategory/:categoryId" element={<UpdateCategory />} />
          <Route path="/ViewCategory" element={<ViewCategory />} />
          {/* Add other routes as needed */}

          <Route path="/createPost" element={<PostCreate />} />
          <Route path="/updatePost/:postId" element={<UpdatePost />} />
          <Route path="/newsfeed" element={<Newsfeed />} />
          <Route path="/Userfeed" element={<Userfeed />} />
          <Route path="/top-contributor" element={<Topcontributor />} />
          <Route path="/UserManagement" element={<UserManagement />} />

          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/Gourdchat" element={<GourdChat />} />
          {/* <Route path="/chatbox" element={<Chatbox/>} /> */}
          <Route path="/user-chat/:userId/:userName" element={<Chatbox />} />
          <Route path="/user-chat/:chatId/:userId/:userName" element={<Chatbox />} />

          <Route path="/gourdType" element={<GourdType />} />
          <Route path="/gourdVariety" element={<GourdVariety />} />
          <Route path="/Monitoring" element={<MonitoringList />} />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/Polinatedbymonth" element={<PollinatedBymonth />} />
          <Route path="/Completedbymonth" element={<Completed />} />
          <Route path="/Failedbymonth" element={<Failed />} />
          {/* User Dashboard */}
          <Route path="/User/Polinatedbymonth" element={<UserPollinatedBymonth />} />
          <Route path="/User/Completedbymonth" element={<UserCompleted />} />
          <Route path="/User/Failedbymonth" element={<UserFailed />} />
          <Route path="/PostManagement" element={<AdminPostManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;