import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { user } = useAuth();

  if (!user?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{element}</>;
};

export default PrivateRoute; 