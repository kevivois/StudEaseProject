import { useState } from 'react';
import { Tabs, Tab, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import OfferFilters from '../components/OfferFilters';
import ApplicationModal from '../components/ApplicationModal';
import ApplicationsList from '../components/ApplicationsList';
import { Offer, Application } from '../types/database';


// Mock data - replace with actual API calls
const mockApplications: Application[] = [
  {
    id: '1',
    user_id: '1',
    offer_id: '1',
    status: 'en_cours',
    application_message: 'Je suis très intéressé par ce poste...',
    documents: ['CV.pdf', 'LM.pdf'],
    applied_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
    employer_feedback: null,
    application_progress: ['Candidature envoyée', 'CV validé', 'Entretien planifié'],
    offer: {
      offer_id: '1',
      title: 'Développeur Full Stack',
      company_id: '1',
      job_type_id: '1',
      location_id: '1',
      remuneration_type_id: '1',
      contract_type_id: '1',
      duration_id: '1',
      application_deadline: '2024-04-01',
      start: '2024-05-01',
      end: null,
      work_location_type: 'hybrid',
      profile_description: 'Nous recherchons un développeur...',
      required_skills: ['React', 'Node.js'],
      required_documents: ['CV', 'Lettre de motivation'],
      benefits: ['Télétravail', 'Formation continue'],
      application_steps: ['Entretien RH', 'Test technique'],
      languages: ['Français', 'Anglais'],
      activity_rate_min: '80',
      activity_rate_max: '100',
      working_days_hours_description: ['Lundi-Vendredi', '8h-17h'],
      job_level: 'Junior',
      is_working_hours_flexible: true,
      contact_email: 'contact@company.com',
      contact_name: 'John Doe',
      documents_urls: [],
      created_at: '2024-03-01T10:00:00Z',
      updated_at: '2024-03-01T10:00:00Z',
      company: {
        company_id: '1',
        auth_user_id: '1',
        company_name: 'Tech Company SA',
        company_logo_url: '',
        company_type_id: '1',
        company_address: 'Rue de Lausanne 1',
        company_phone: '+41 21 000 00 00',
        company_website: 'www.company.com',
        company_description: 'Une entreprise innovante',
        created_at: '2024-03-01T10:00:00Z'
      }
    }
  }
];

function JobSeekerDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    jobTypeId: '',
    locationId: '',
    contractTypeId: '',
    industryIds: [] as string[],
    searchTerm: '',
    isFlexible: false,
    activityRateMin: '',
    activityRateMax: ''
  });

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = async (data: { message: string; documents: File[] }) => {
    // Implement application submission logic here
    console.log('Submitting application:', data);
    setIsApplicationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          className="mb-6"
        >
          <Tab label="Recherche d'offres" />
          <Tab label="Mes candidatures" />
          <Tab label="Mon profil" />
        </Tabs>

        {activeTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <OfferFilters
                jobTypes={[]}
                locations={[]}
                contractTypes={[]}
                industries={[]}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="lg:col-span-3 space-y-4">
              {/* Offer cards */}
              {[1, 2, 3].map((id) => (
                <div key={id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <WorkIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary">
                            Développeur Full Stack
                          </h3>
                          <p className="text-gray-600">Tech Company SA</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            className="text-gray-400 hover:text-primary"
                            startIcon={<BookmarkAddIcon />}
                          >
                            Sauvegarder
                          </Button>
                          <Button
                            variant="contained"
                            className="bg-primary hover:bg-primary-dark"
                            onClick={() => {
                              setSelectedOffer({} as Offer);
                              setIsApplicationModalOpen(true);
                            }}
                          >
                            Postuler
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <LocationOnIcon className="h-4 w-4 mr-1" />
                          Lausanne, VD
                        </div>
                        <div className="flex items-center">
                          <SchoolIcon className="h-4 w-4 mr-1" />
                          Master
                        </div>
                        <div className="flex items-center">
                          <AccessTimeIcon className="h-4 w-4 mr-1" />
                          Il y a 2 jours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <ApplicationsList applications={mockApplications} />
        )}

        {activeTab === 2 && (
          <div className="max-w-3xl mx-auto">
            {/* Profile content */}
          </div>
        )}
      </div>

      <ApplicationModal
        open={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        offer={selectedOffer}
        onSubmit={handleApply}
      />
    </div>
  );
}

export default JobSeekerDashboard;