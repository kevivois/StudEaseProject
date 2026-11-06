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
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h1>Espace recruteur</h1>
          <p>Donnez de la visibilité à vos offres et rencontrez vos prochains talents.</p>
        </div>
        <div className="segment-control" role="group" aria-label="Espace recruteur">
          <button
            onClick={() => setActiveTab('postings')}
            aria-pressed={activeTab === 'postings'}
            aria-controls="postings-panel"
          >
            Offres
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
            }}
            aria-pressed={activeTab === 'profile'}
            aria-controls="profile-panel"
          >
            Profil
          </button>
        </div>
      </div>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div id="postings-panel" hidden={activeTab !== 'postings'}>
        {activeTab === 'postings' && (loading ? (
          <div className="loading-state" role="status">
            <CircularProgress />
            <span>Chargement des offres…</span>
          </div>
        ) : (
          <JobPostingsList
            jobPostings={jobPostings}
            onEdit={handleEditPosting}
            onDelete={handleDeletePosting}
          />
        ))}
      </div>

      <div id="profile-panel" hidden={activeTab !== 'profile'}>
        {activeTab === 'profile' && (
          <CompanyProfileSection onUpdate={handleProfileUpdate} />
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
