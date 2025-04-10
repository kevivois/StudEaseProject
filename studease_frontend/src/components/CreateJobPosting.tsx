import { useNavigate } from 'react-router-dom';
import { Typography, Paper } from '@mui/material';
import JobPostingForm from '../components/JobPostingForm';
import { api } from '../lib/api';

export default function CreateJobPosting() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      await api.offers.create(data);
      navigate('/employer');
    } catch (error) {
      console.error('Error creating job posting:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Typography variant="h4" component="h1" gutterBottom>
        Créer une nouvelle offre
      </Typography>
      <Paper className="p-6 mt-6">
        <JobPostingForm onSubmit={handleSubmit} />
      </Paper>
    </div>
  );
}