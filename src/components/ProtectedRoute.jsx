// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get token and user from localStorage
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  // Parse user safely
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Failed to parse user data:', error);
  }

  // Check 1: No token or user = Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check 2: If allowedRoles specified, verify user's role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    
    // Check if user's role is in allowed roles
    const hasAccess = allowedRoles.some(
      allowedRole => allowedRole.toLowerCase() === userRole
    );

    if (!hasAccess) {
      // User doesn't have permission - show 403
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // All checks passed - allow access
  return children;
};

export default ProtectedRoute;