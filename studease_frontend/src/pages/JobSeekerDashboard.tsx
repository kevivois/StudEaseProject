import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Props {
  profile?: boolean;
  type?: 'job' | 'internship' | 'project';
}

function JobSeekerDashboard({ profile = false, type = 'job' }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [activeTab, setActiveTab] = useState(profile ? 'profile' : 'search');

  const getTitle = () => {
    switch (type) {
      case 'internship':
        return 'Stages';
      case 'project':
        return 'Mandats/Projets';
      default:
        return 'Jobs étudiants';
    }
  };

  const renderHero = () => (
    <div className="bg-gradient-brand text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Trouvez le {type === 'internship' ? 'stage' : type === 'project' ? 'projet' : 'job'} idéal
        </h1>
        <p className="text-xl mb-8">
          Accédez instantanément à des opportunités qualifiées dans votre domaine
        </p>
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Titre, mot-clé ou entreprise"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <LocationOnIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ville ou région"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
              />
            </div>
            <button className="bg-primary text-white px-8 py-2 rounded-full hover:bg-primary-dark transition-colors">
              Rechercher
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <PersonIcon className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Jean Dupont</h2>
          <p className="text-gray-600">Étudiant en informatique</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Informations de contact</h3>
          <div className="space-y-2">
            <p><strong>Email:</strong> jean.dupont@example.com</p>
            <p><strong>Téléphone:</strong> +41 XX XXX XX XX</p>
            <p><strong>Localisation:</strong> Lausanne, Suisse</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Résumé professionnel</h3>
          <p className="text-gray-700">
            Étudiant en Master en informatique avec une spécialisation en développement web.
            À la recherche d'opportunités pour mettre en pratique mes compétences.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Compétences</h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git'].map((skill) => (
              <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button className="w-full bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors">
          Modifier le profil
        </button>
      </div>
    </div>
  );

  const renderContent = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Type de contrat</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary" />
                <span className="ml-2 text-gray-700">Temps plein</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary" />
                <span className="ml-2 text-gray-700">Temps partiel</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary" />
                <span className="ml-2 text-gray-700">Stage</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Niveau d'études</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary" />
                <span className="ml-2 text-gray-700">Bachelor</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary" />
                <span className="ml-2 text-gray-700">Master</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary" />
                <span className="ml-2 text-gray-700">Doctorat</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Trier par:</span>
              <button className="flex items-center text-gray-700 hover:text-primary">
                Pertinence
                <KeyboardArrowDownIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

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
                        {type === 'internship' ? 'Stage en développement' : 
                         type === 'project' ? 'Projet web React' : 
                         'Développeur étudiant'}
                      </h3>
                      <p className="text-gray-600">Entreprise Tech SA</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-primary">
                        <BookmarkAddIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary">
                        <OpenInNewIcon className="h-5 w-5" />
                      </button>
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
    </main>
  );

  return (
    <div>
      {profile ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === 'profile'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profil
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === 'applications'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('applications')}
            >
              Mes candidatures
            </button>
          </div>
          {activeTab === 'profile' ? renderProfile() : renderContent()}
        </div>
      ) : (
        <>
          {renderHero()}
          {renderContent()}
        </>
      )}
    </div>
  );
}

export default JobSeekerDashboard;