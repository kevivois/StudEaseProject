import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
  userType?: 'student' | 'company';
}

export default function ProtectedRoute({ children, userType }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userType && user.type !== userType) {
    return <Navigate to="/" replace />;
  }else if(!userType){
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}