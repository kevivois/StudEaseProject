import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Tabs, Tab, Alert, CircularProgress } from '@mui/material';
import { api } from '../lib/api';
import JobPostingsList from '../components/JobPostingsList';
import { Offer, Application, Company } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import CompanyProfileSection from '../components/CompanyProfile';
function EmployerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeTab, setActiveTab] = useState<'postings' | 'profile'>('postings');
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.company_id) {
      setLoading(true);
      setError(null);

      const fetchData = async () => {
        try {
          const offersResponse = await api.offers.getByCompany(user.company_id);
          setJobPostings(offersResponse.offers);
        } catch (err: any) {
          if (err.response?.status === 404) {
            setError("Ressource non trouvée. Veuillez vérifier votre connexion.");
          } else {
            setError('Erreur lors du chargement des données: ' + (err.message || 'Une erreur inconnue est survenue'));
            console.error('Dashboard loading error:', err);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, activeTab, applications.length]);

  const handleEditPosting = (posting: Offer) => {
    navigate(`/employer/offers/${posting.offer_id}/edit`); // Use navigate
  };

  const handleProfileUpdate = async (data:any) => {
    await api.companies.updateProfile(user.company_id,data)
  }

  const handleDeletePosting = async (postingId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      return;
    }

    try {
      setJobPostings(prev => prev.filter(posting => posting.offer_id !== postingId)); // Optimistic update
      await api.offers.delete(postingId);
    } catch (err) {
      console.error('Error deleting posting:', err);
      // Revert optimistic update or re-fetch
      loadDashboardData();
    }
  };

  const handleViewApplication = (application: Application) => {
    navigate(`/employer/applications/${application.id}`); // Use navigate
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status } : app
        )
      ); // Optimistic update
      await api.applications.update(applicationId, { status });
    } catch (err) {
      console.error('Error updating application status:', err);
      // Revert optimistic update or re-fetch
      loadDashboardData();
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user?.id) {
        const offersResponse = await api.offers.getByCompany(user.id);
        setJobPostings(offersResponse);
        if (activeTab === 'profile') {
          const applicationsResponse = await api.applications.getByCompany(user.id);
          setApplications(applicationsResponse);
        }
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Ressource non trouvée. Veuillez vérifier votre connexion.");
      } else {
        setError('Erreur lors du chargement des données: ' + (err.message || 'Une erreur inconnue est survenue'));
        console.error('Dashboard loading error:', err);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Espace recruteur</h1>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === 'postings'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('postings')}
            aria-selected={activeTab === 'postings'}
            aria-controls="postings-panel"
          >
            Offres
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === 'profile'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setActiveTab('profile');
            }}
            aria-selected={activeTab === 'profile'}
            aria-controls="profile-panel"
          >
            Profile
          </button>
        </div>
      </div>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div id="postings-panel" hidden={activeTab !== 'postings'}>
        {activeTab === 'postings' && (
          <JobPostingsList
            jobPostings={jobPostings}
            onEdit={handleEditPosting}
            onDelete={handleDeletePosting}
          />
        )}
      </div>

      <div id="applications-panel" hidden={activeTab !== 'profile'}>
        {activeTab === 'profile' && (
          <CompanyProfileSection onUpdate={handleProfileUpdate} />
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
