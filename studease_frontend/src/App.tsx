import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import CreateJobPosting from "./components/CreateJobPosting"
import EditJobPosting from "./components/EditJobPosting"
import UserOrCompanyProtected from './components/UserOrCompanyProtected';
import JobOfferDetails from './components/JobOfferDetails';
import Info from './pages/Info';
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<UserOrCompanyProtected />}></Route>
          <Route path="/info" element={<Info />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employer" element={<ProtectedRoute userType="company">
                <EmployerDashboard />
              </ProtectedRoute>}></Route>
            <Route path="/student" element={<ProtectedRoute userType="student">
              <JobSeekerDashboard />
            </ProtectedRoute>}></Route>
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
          <Route path="*" element={
            <div className="page-container">
              <section className="auth-card max-w-xl mx-auto my-8">
                <p className="text-primary font-semibold mb-4">404 · Page introuvable</p>
                <h1>Cette page n'existe pas.</h1>
                <p className="text-gray-600 mt-4 leading-relaxed">Le lien a peut-être changé. Retrouvez votre espace ou découvrez la plateforme depuis l'accueil.</p>
                <Link to="/" className="app-button app-button-primary mt-6">Retour à l'accueil</Link>
              </section>
            </div>
          } />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;