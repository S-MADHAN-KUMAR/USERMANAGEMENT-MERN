import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';  // Make sure to import useSelector

const ProtectedRoute = ({ children, isProtectedForLoggedIn = false }) => {
  const { currentUser } = useSelector((state) => state.user); // Get current user from Redux store
  
  if (isProtectedForLoggedIn) {
    // Redirect to homepage if the user is already logged in and is trying to access a login page
    if (currentUser) {
      return <Navigate to="/" />;
    }
  } else {
    // Redirect to login page if the user is not logged in and is trying to access a protected page
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
  }

  return children; // Render the children (Login page or Product page) based on the condition
};

export default ProtectedRoute;
