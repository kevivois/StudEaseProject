import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import CreateJobPosting from "./components/CreateJobPosting"
import EditJobPosting from "./components/EditJobPosting"
import UserOrCompanyProtected from './components/UserOrCompanyProtected';
import JobOfferDetails from './components/JobOfferDetails';
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#7fba3c]/10 to-[#008080]/10">
        <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<UserOrCompanyProtected />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employer" element={<ProtectedRoute userType="company">
                <EmployerDashboard />
              </ProtectedRoute>}></Route>
            <Route path="/student" element={<ProtectedRoute userType="student">
              <JobSeekerDashboard />
            </ProtectedRoute>}></Route>
          <Route
            path="/profile"
            element={
              <Profile />
            }
          />
             <Route
              path="/employer/offers/new"
              element={
                <ProtectedRoute userType="company">
                  <CreateJobPosting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/offers/:id/edit"
              element={
                <ProtectedRoute userType="company">
                  <EditJobPosting />
                </ProtectedRoute>
              }
            />
          <Route
              path="/employer/offers/:id"
              element={
                <ProtectedRoute userType="company">
                  <JobOfferDetails />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={
            <div>not found</div>
          }></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;