import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface JobPosting {
  id: number;
  title: string;
  location: string;
  type: string;
  posted: string;
  applicants: number;
  status: 'active' | 'draft' | 'closed';
}

function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<'postings' | 'applications'>('postings');

  const jobPostings: JobPosting[] = [
    {
      id: 1,
      title: "Stage en développement web",
      location: "Lausanne, VD",
      type: "100%",
      posted: "Il y a 2 jours",
      applicants: 12,
      status: 'active'
    },
    {
      id: 2,
      title: "Développeur étudiant",
      location: "Genève, GE",
      type: "50%",
      posted: "Il y a 1 jour",
      applicants: 8,
      status: 'active'
    },
    {
      id: 3,
      title: "Projet Bachelor",
      location: "Remote",
      type: "Flexible",
      posted: "Brouillon",
      applicants: 0,
      status: 'draft'
    }
  ];

  const applications = [
    {
      id: 1,
      name: "Marie Martin",
      position: "Stage en développement web",
      appliedDate: "2024-02-28",
      status: "En cours",
      education: "Master en informatique",
      location: "Lausanne"
    },
    {
      id: 2,
      name: "Lucas Dubois",
      position: "Stage en développement web",
      appliedDate: "2024-02-27",
      status: "Entretien",
      education: "Bachelor en informatique",
      location: "Remote"
    },
    {
      id: 3,
      name: "Emma Blanc",
      position: "Développeur étudiant",
      appliedDate: "2024-02-26",
      status: "Nouveau",
      education: "Master en informatique",
      location: "Genève"
    }
  ];

  const renderJobPostings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Offres publiées</h2>
        <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors">
          <AddIcon className="h-5 w-5" />
          <span>Nouvelle offre</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lieu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publication
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidatures
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobPostings.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.posted}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.applicants}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' :
                    job.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status === 'active' ? 'Active' :
                     job.status === 'draft' ? 'Brouillon' :
                     'Fermée'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary-dark mr-3">
                    <EditIcon className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <DeleteIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Candidatures</h2>

      <div className="grid grid-cols-1 gap-6">
        {applications.map((application) => (
          <div key={application.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <PersonIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{application.name}</h3>
                    <p className="text-primary">{application.position}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    application.status === 'Nouveau' ? 'bg-green-100 text-green-800' :
                    application.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <AccessTimeIcon className="h-4 w-4 mr-2" />
                    Postulé le {application.appliedDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <LocationOnIcon className="h-4 w-4 mr-2" />
                    {application.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <SchoolIcon className="h-4 w-4 mr-2" />
                    {application.education}
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors">
                    Voir le dossier
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50">
                    Télécharger CV
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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

      {activeTab === 'postings' ? renderJobPostings() : renderApplications()}
    </div>
  );
}

export default EmployerDashboard;