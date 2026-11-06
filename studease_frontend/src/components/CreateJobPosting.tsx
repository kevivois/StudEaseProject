import { useNavigate } from 'react-router-dom';
import { Typography, Paper } from '@mui/material';
import JobPostingForm from '../components/JobPostingForm';
import { api } from '../lib/api';

export default function CreateJobPosting() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      let offer = (await api.offers.create(data)).offer;
      let id = offer.offer_id
      let formData = new FormData();
      if(Array.isArray(data.documents) && data.documents.length > 0){
        data.documents.forEach((file:any) => {
          formData.append("files",file)
        })
        await api.offers.files.upload(id,formData)
      }
      navigate('/employer');
    } catch (error) {
      console.error('Error creating job posting:', error);
      throw error;
    }
  };

  return (
    <div className="page-container form-page">
      <Typography variant="h4" component="h1" gutterBottom>
        Créer une nouvelle offre
      </Typography>
      <Paper className="form-panel mt-6">
        <JobPostingForm onSubmit={handleSubmit} />
      </Paper>
    </div>
  );
}