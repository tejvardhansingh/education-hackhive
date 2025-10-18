import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/CoursePage';
import Course from './pages/course';
import Workshops from './pages/Workshops';
import FAQs from './pages/Faq';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const Layout = () => {
  const location = useLocation();
  const hideNav = location.pathname === '/dashboard' || location.pathname === '/course';
  return (
    <>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Single Course */}
        <Route
          path="/course"
          element={
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
