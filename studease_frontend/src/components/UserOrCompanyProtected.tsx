import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  StudentComponent?: React.ComponentType;
  CompanyComponent?: React.ComponentType;
}

export default function UserOrCompanyProtected({StudentComponent,CompanyComponent }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log(user.type,'student')

  if (user.type === 'student' && StudentComponent) {
    return <StudentComponent />;
  }

  if (user.type === 'company' && CompanyComponent) {
    return <CompanyComponent />;
  }

  return (<div>Forbidden</div>);
}