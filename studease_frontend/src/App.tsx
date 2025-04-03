import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#7fba3c]/10 to-[#008080]/10">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center">
                <SchoolIcon className="h-8 w-8 text-[#7fba3c]" />
                <span className="ml-2 text-2xl font-bold text-gradient">StudEase</span>
              </Link>
              <nav className="hidden md:flex space-x-8">
                {user?.type === 'student' && (
                  <>
                    <Link to="/jobs" className="text-gray-700 hover:text-[#7fba3c]">
                      Jobs étudiants
                    </Link>
                    <Link to="/internships" className="text-gray-700 hover:text-[#7fba3c]">
                      Stages
                    </Link>
                    <Link to="/projects" className="text-gray-700 hover:text-[#7fba3c]">
                      Projets
                    </Link>
                  </>
                )}
                {user?.type === 'company' && (
                  <Link to="/employer" className="text-gray-700 hover:text-[#7fba3c]">
                    Tableau de bord
                  </Link>
                )}
              </nav>
              <div className="flex items-center space-x-4">
                <button className="text-gray-700 hover:text-[#7fba3c]">FR</button>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-[#7fba3c]"
                    >
                      {user.type === 'student'
                        ? `${user.firstName} ${user.lastName}`
                        : user.companyName}
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="bg-[#008080] text-white px-4 py-2 rounded-full hover:bg-[#006666] transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="bg-[#008080] text-white px-4 py-2 rounded-full hover:bg-[#006666] transition-colors"
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute userType="student">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute userType="student">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships"
            element={
              <ProtectedRoute userType="student">
                <JobSeekerDashboard type="internship" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute userType="student">
                <JobSeekerDashboard type="project" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute userType="student">
                <JobSeekerDashboard profile={true} />
              </ProtectedRoute>
            }
          />

          {/* Employer routes */}
          <Route
            path="/employer"
            element={
              <ProtectedRoute userType="company">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;