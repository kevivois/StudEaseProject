import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function UserOrCompanyProtected() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if(user.type == "student"){
    return <Navigate to='/student'state={{ from: location }} replace />;
  }else if (user.type == "company"){
    return <Navigate to='/employer' state={{ from: location }} replace />;
  }

  return <Navigate to='/login' state={{ from: location }} replace />;
}