import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import OfferCard from '../components/OfferCard';
import ApplicationModal from '../components/ApplicationModal';
import StudentProfile from "../components/StudentProfile"
import OfferFilters from '../components/OfferFilters';
import ApplicationsList from '../components/ApplicationsList';
import { api } from '../lib/api';
import { Offer, Application, User } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [savedOffers, setSavedOffers] = useState<string[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<User | null>(null);

  const [loading, setLoading] = useState({
    offers: false,
    applications: false,
    profile: false,
    metadata: false,
  });

  const [error, setError] = useState({
    offers: null as string | null,
    applications: null as string | null,
    profile: null as string | null,
    metadata: null as string | null,
  });

  const [filters, setFilters] = useState({
    jobTypeId: [] as string[],
    locationId: [] as string[],
    contractTypeId: [] as string[],
    industryIds: [] as string[],
    searchTerm: '',
    isFlexible: true,
    activityRateMin: '',
    activityRateMax: '',
    workingHoursSearch: ''
  });

  // Load initial data
  useEffect(() => {
    if (user) {
      loadOffers();
      loadApplications();
      loadProfile();
      loadSavedOffers();
    }
  }, [user]);

  // Reload offers when filters change
  const loadOffers = async () => {
    try {
      setLoading(prev => ({ ...prev, offers: true }));
      setError(prev => ({ ...prev, offers: null }));
      const response = await api.offers.filter(filters);
      setOffers(response.offers);
    } catch (err) {
      setError(prev => ({ ...prev, offers: 'Error loading offers' }));
      console.error('Error loading offers:', err);
    } finally {
      setLoading(prev => ({ ...prev, offers: false }));
    }
  };

  const loadApplications = async () => {
    if (!user?.user_id) return;
    
    try {
      setLoading(prev => ({ ...prev, applications: true }));
      setError(prev => ({ ...prev, applications: null }));
      const response = await api.applications.getByUser(user.user_id);
      setApplications(response.applications);
    } catch (err) {
      setError(prev => ({ ...prev, applications: 'Error loading applications' }));
      console.error('Error loading applications:', err);
    } finally {
      setLoading(prev => ({ ...prev, applications: false }));
    }
  };

  const loadProfile = async () => {
    if (!user?.user_id) return;

    try {
      setLoading(prev => ({ ...prev, profile: true }));
      setError(prev => ({ ...prev, profile: null }));
      const profileData = await api.users.getProfile(user.user_id);
      setProfile(profileData.user);
    } catch (err) {
      setError(prev => ({ ...prev, profile: 'Error loading profile' }));
      console.error('Error loading profile:', err);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const loadSavedOffers = async () => {
    try {
      const savedOffersResponse = await api.savedOffers.getAll(user.user_id);
      setSavedOffers(Array.isArray(savedOffersResponse.saved_offers) ? savedOffersResponse.saved_offers.map((offer: any) => offer.offer_id) : []);
    } catch (err) {
      console.error('Error loading saved offers:', err);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    // For multiple select fields, ensure we handle arrays properly
    if (name === 'jobTypeId' || name === 'locationId' || name === 'contractTypeId' || name === 'industryIds') {
      // If value is empty array, clear the filter
      if (Array.isArray(value) && value.length === 0) {
        setFilters(prev => ({ ...prev, [name]: [] }));
        return;
      }
      // Otherwise set the array of selected values
      setFilters(prev => ({ ...prev, [name]: value }));
      return;
    }

    // For other fields, handle as before
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsApplicationModalOpen(true);
  };

  const handleSaveOffer = async (offerId: string) => {
    try {
      if (savedOffers.includes(offerId)) {
        await api.savedOffers.unsave(offerId);
        setSavedOffers(prev => prev.filter(id => id !== offerId));
      } else {
        await api.savedOffers.save(offerId);
        setSavedOffers(prev => [...prev, offerId]);
      }
    } catch (error) {
      console.error('Error saving/unsaving offer:', error);
    }
  };

  const handleSubmitApplication = async (data: {
    message: string;
    documents: File[];
    startDate?: string;
  }) => {
    if (!selectedOffer) return;

    try {
      // First, upload documents
      const formData = new FormData();
      data.documents.forEach(file => formData.append('files', file));
      let uploadResponse = null
      if(data.documents.length > 0){
       uploadResponse = await api.files.upload(formData);
      }
      // Then create application with document URLs
      const applicationData = {
        application_message: data.message,
        documents: uploadResponse? uploadResponse.urls : [],
      };

      await api.applications.create(selectedOffer.offer_id, applicationData);
      setIsApplicationModalOpen(false);
      loadApplications(); // Reload applications after successful submission
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
    try { 
      if (!user?.user_id) return;
      const updatedProfile = await api.users.updateProfile(user.user_id, data);
      setProfile(updatedProfile.user);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  if (!user) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Alert severity="warning">Please log in to access this page.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        className="mb-6"
      >
        <Tab icon={<SearchIcon className="h-5 w-5" />} label="Recherche" />
        <Tab icon={<BookmarkIcon className="h-5 w-5" />} label="Offres sauvegardées" />
        <Tab icon={<AssignmentIcon className="h-5 w-5" />} label="Mes candidatures" />
        <Tab icon={<PersonIcon className="h-5 w-5" />} label="Mon profil" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <OfferFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={() => loadOffers()}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            {loading.offers ? (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ) : error.offers ? (
              <Alert severity="error">{error.offers}</Alert>
            ) : (
              <div className="space-y-4">
                {Array.isArray(offers) ? offers.map((offer) => (
                  <OfferCard
                    key={offer.offer_id}
                    offer={offer}
                    onApply={handleApply}
                    onSave={handleSaveOffer}
                    isSaved={savedOffers.includes(offer.offer_id)}
                  />
                )) : null}
              </div>
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <div className="space-y-4">
          {savedOffers.length === 0 ? (
            <Alert severity="info">
              Vous n'avez pas encore sauvegardé d'offres
            </Alert>
          ) : (
            offers
              .filter((offer) => savedOffers.includes(offer.offer_id))
              .map((offer) => (
                <OfferCard
                  key={offer.offer_id}
                  offer={offer}
                  onApply={handleApply}
                  onSave={handleSaveOffer}
                  isSaved={true}
                />
              ))
          )}
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {loading.applications ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : error.applications ? (
          <Alert severity="error">{error.applications}</Alert>
        ) : (
          <ApplicationsList applications={applications} />
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        {loading.profile ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (<StudentProfile profile={profile} onUpdate={handleUpdateProfile} />
        )}
      </TabPanel>

      <ApplicationModal
        open={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        offer={selectedOffer}
        onSubmit={handleSubmitApplication}
      />
    </Container>
  );
}