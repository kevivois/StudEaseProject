"use client";

import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import Header from '@/app/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [filtersSelected, setFilters] = useState(false);
  const [jobOffers, setJobOffers] = useState([]);

  return (
    <>
      <Header />

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Espace étudiants</h1>
      </div>

      {/* Image slightly smaller but full width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <img
          src="Sion.jpg"
          alt="Sion"
          className="w-full h-64 object-cover rounded-2xl shadow-md"
        />
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Job title, keyword or company"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 relative">
            <LocationOnIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="City or region"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center">
            Search
          </button>
          <IconButton onClick={() => setFilters(!filtersSelected)}>
            <FilterIcon color={filtersSelected ? "primary" : "inherit"} />
          </IconButton>
        </div>

        {/* Filter Panel */}
        {filtersSelected && (
          <div className="mt-4 bg-white shadow p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Options de filtres</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Filter Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Job étudiant</option>
                  <option>Stage</option>
                  <option>Mandat</option>
                  <option>Proposition de TB ou TM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Tech</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modalité</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Présentiel</option>
                  <option>Partiellement en télétravail</option>
                  <option>Télétravail possible</option>
                  <option>Uniquement télétravail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jours de travail</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Jours de la semaine</option>
                  <option>Uniquement du lundi au vendredi</option>
                  <option>Uniquement weekend</option>
                  <option>Toute la semaine lundi à dimanche</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rénumeration</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Min-max</option>
                  <option>Mensuel</option>
                  <option>Horaire</option>
                  <option>A la mission</option>
                  <option>Bénevolat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taux d'activité</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Variable</option>
                  <option>A la tâche/mission</option>
                  <option>Selon disponibilité</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>CDD</option>
                  <option>CDI</option>
                  <option>A la tâche/mission</option>
                  <option>Indépendant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée d'engagement</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Des que possible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'entreprise</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Start-up</option>
                  <option>PME</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>🇩🇪 Allemand</option>
                <option>🇬🇧 Anglais</option>
                <option>🇪🇸 Espagnol</option>
                <option>🇫🇷 Francais</option>
                <option>🇮🇹 Italien</option>
                <option>🌐 Autre langue</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Latest Offers</h2>
          <div className="flex items-center space-x-2">
          <span className="text-gray-600">Trier par:</span>
            <div className="relative">
              <select className="appearance-none bg-transparent pl-1 pr-6 py-1 text-gray-700 hover:text-gray-600 focus:outline-none focus:text-gray-600 cursor-pointer">
                <option value="pertinence">Le plus pertinent</option>
                <option value="recent">Le plus récent</option>
                <option value="ancien">Le plus ancien</option>
                <option>Le plus d'activité</option>
                <option>Le moins d'activité</option>
                <option value="endroit">Le plus proche</option>
              </select>
              <KeyboardArrowDownIcon className="pointer-events-none absolute right-0 top-1 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
