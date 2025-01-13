import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Layout/Header';
import Login from './components/User/Login';
import Register from './components/User/Register';
import Home from './components/Home';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Profile from './components/User/Profile';
import CategoryCreate from './components/Category/createCategory';
import UpdateCategory from './components/Category/UpdateCategory';
import ViewCategory from './components/Category/ViewCategories';
import PostCreate from './components/Post/CreatePost';
import UpdatePost from './components/Post/UpdatePost';
import Newsfeed from './components/Post/Socialmedia';
import Userfeed from './components/Post/UserPost';
import AdminView from './components/Post/Adminview'; 
import Topcontributor from './components/Layout/Topcontributor';
import UserManagement from './components/User/AdminUserManagement';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/createCategory" element={<CategoryCreate />} />
          <Route path="/UpdateCategory/:categoryId" element={<UpdateCategory />} />
          <Route path="/ViewCategory" element={<ViewCategory />} />
          {/* Add other routes as needed */}

          <Route path="/createPost" element={<PostCreate />} />
          <Route path="/updatePost/:postId" element={<UpdatePost />} />
          <Route path="/newsfeed" element={<Newsfeed />} />
          <Route path="/Userfeed" element={<Userfeed />} />
          <Route path="/adminfeed" element={<AdminView />} /> 
          <Route path="/top-contributor" element={<Topcontributor/>} />
          <Route path="/UserManagement" element={<UserManagement/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;