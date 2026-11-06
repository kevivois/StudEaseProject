import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress } from '@mui/material';

interface Props {
  children: React.ReactNode;
  userType?: 'student' | 'company';
}

export default function ProtectedRoute({ children, userType }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-state" role="status"><CircularProgress /><span>Chargement de votre espace…</span></div>;
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