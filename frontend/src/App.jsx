import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import for Routes in v6
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './pages/ProtectedRoute '
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<ProtectedRoute isProtectedForLoggedIn={true} ><Register /></ProtectedRoute>} />
                
                <Route path="/login" element={<ProtectedRoute isProtectedForLoggedIn={true}><Login /></ProtectedRoute>} />
        
        <Route path="/profile" element={<ProtectedRoute ><Profile /></ProtectedRoute>} />


        {/* adminRoutes */}
        <Route path="/admindashboard" element={<ProtectedRoute ><AdminDashboard /></ProtectedRoute>}  />

      </Routes>
    </Router>
  );
};

export default App;
