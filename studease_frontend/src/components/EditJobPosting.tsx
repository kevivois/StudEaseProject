import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Paper } from '@mui/material';
import JobPostingForm from '../components/JobPostingForm';
import { api } from '../lib/api';

export default function EditJobPosting() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (data: any) => {
    try {
      await api.offers.update(id!, data);
      if(Array.isArray(data.documents) && data.documents.length > 0){
        let formData = new FormData()
        Array.from(data.documents).forEach((file:any) => {
          formData.append("files",file)
        })
        await api.offers.files.upload(id!,formData)
      }
      navigate('/employer');
    } catch (error) {
      console.error('Error updating job posting:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Typography variant="h4" component="h1" gutterBottom>
        Modifier l'offre
      </Typography>
      <Paper className="p-6 mt-6">
        <JobPostingForm offerId={id} onSubmit={handleSubmit} />
      </Paper>
    </div>
  );
}