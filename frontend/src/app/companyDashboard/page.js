"use client"

// studentDashboard.js
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import Header from '@/app/components';
import AddIcon from '@mui/icons-material/Add';


export default function CompanyDashboard() {
    return (
        <>
            <Header/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
                    <div className="flex space-x-4">
                        <button
                            className={`px-4 py-2 rounded-md `}
                        >
                        Job Postings
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md `}
                        >
                            Applications
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}