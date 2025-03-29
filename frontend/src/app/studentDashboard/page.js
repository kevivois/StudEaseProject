"use client"

// studentDashboard.js
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import Header from '@/app/components';

function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  return (
    <>
      <Header/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <IconButton>
            <FilterIcon />
          </IconButton>
        </div>
        
        <br></br>
        <h2>Latest Offers</h2>
      </div>

    </>
  );
}

export default StudentDashboard;  // Ensure default export
