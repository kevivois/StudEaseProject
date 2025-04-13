"use client"

import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import Header from '@/app/components';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';

export default function CompanyDashboard() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState('Acme Corp');
    const [jobOffers, setJobOffers] = useState([]);

    useEffect(() => {
        // Retrieve job offers from localStorage on the client side
        const storedJobOffers = JSON.parse(localStorage.getItem("jobOffers")) || [
            { id: 1, title: "Software Engineer", companyName: "Acme Corp", location: "New York, NY", published: "2023-09-15" },
            { id: 2, title: "Product Manager", companyName: "Acme Corp", location: "San Francisco, CA", published: "2023-09-20" },
            { id: 3, title: "Data Scientist", companyName: "Acme Corp", location: "Austin, TX", published: "2023-09-25" },
        ];
        setJobOffers(storedJobOffers);
    }, []); // Empty dependency array ensures this runs only once on mount

    const handlePostJob = () => {
        router.push("/jobForm");
    };

    const handleEditJob = (id) => {
        router.push(`/jobForm?edit=true&id=${id}`);
    };

    return (
        <>
            <Header />
            <div className='bg-gradient-to-br from-[#7fba3c]/10 to-[#008080]/10 min-h-screen'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
                        <button
                            onClick={handlePostJob}
                            className="bg-[#7fba3c] text-white px-6 py-3 rounded-md hover:bg-[#6aa32f]"
                        >
                            Poster une annonce
                        </button>
                    </div>
                    <div className="mt-8 mb-8"> {/* Add spacing above and below the image */}
                        <img 
                            src="mattherhorn.jpg" 
                            alt="Matterhorn" 
                            className="w-full h-64 object-cover rounded-2xl shadow-md"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobOffers.map((job) => (
                            <div key={job.id} className="bg-white shadow-md rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                                <p className="text-gray-600 mt-2">Company: {job.companyName}</p>
                                <p className="text-gray-600">Location: {job.location}</p>
                                <p className="text-gray-600">Published: {job.published}</p>
                                <div className="flex justify-end items-center mt-4">
                                    <button
                                        onClick={() => handleEditJob(job.id)}
                                        className="bg-[#7fba3c] text-white px-4 py-2 rounded-md hover:bg-[#6aa32f]"
                                    >
                                        <EditIcon className="mr-2" /> Editer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}