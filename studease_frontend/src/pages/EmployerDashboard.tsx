import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Alert, CircularProgress } from '@mui/material';
import { api } from '../lib/api';
import JobPostingsList from '../components/JobPostingsList';
import ApplicationsOverview from '../components/ApplicationsOverview';
import { Offer, Application } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

function EmployerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'postings' | 'applications'>('postings');
  const [jobPostings, setJobPostings] = useState<Offer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load job postings
      if (user?.id) {
        const [offersResponse, applicationsResponse] = await Promise.all([
          api.offers.getByCompany(user.id),
          // Fetch applications for all company offers
          api.applications.getByCompany(user.id) // This should be modified to get company applications
        ]);

        setJobPostings(offersResponse);
        setApplications(applicationsResponse);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPosting = async (posting: Offer) => {
    try {
      // Navigate to edit page or open modal
      window.location.href = `/employer/offers/${posting.offer_id}/edit`;
    } catch (err) {
      console.error('Error editing posting:', err);
    }
  };

  const handleDeletePosting = async (postingId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      return;
    }

    try {
      await api.offers.delete(postingId);
      setJobPostings(prev => prev.filter(posting => posting.offer_id !== postingId));
    } catch (err) {
      console.error('Error deleting posting:', err);
    }
  };

  const handleViewApplication = (application: Application) => {
    // Navigate to application detail page
    window.location.href = `/employer/applications/${application.id}`;
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await api.applications.update(applicationId, { status });
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

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
          >
            Offres
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === 'applications'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('applications')}
          >
            Candidatures
          </button>
        </div>
      </div>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {activeTab === 'postings' ? (
        <JobPostingsList
          jobPostings={jobPostings}
          onEdit={handleEditPosting}
          onDelete={handleDeletePosting}
        />
      ) : (
        <ApplicationsOverview
          applications={applications}
          onViewApplication={handleViewApplication}
          onUpdateStatus={handleUpdateApplicationStatus}
        />
      )}
    </div>
  );
}

export default EmployerDashboard;