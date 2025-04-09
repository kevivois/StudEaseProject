import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { api } from '../lib/api';
import { Offer } from '../types/database';

interface Props {
  offerId?: string;
  onSubmit: (data: any) => Promise<void>;
}

export default function JobPostingForm({ offerId, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    jobTypes: any[];
    locations: any[];
    contractTypes: any[];
    industries: any[];
    remunerationTypes: any[];
    durations: any[];
  }>({
    jobTypes: [],
    locations: [],
    contractTypes: [],
    industries: [],
    remunerationTypes: [],
    durations: [],
  });

  const [formData, setFormData] = useState<Partial<Offer>>({
    title: '',
    job_type_id: '',
    location_id: '',
    contract_type_id: '',
    remuneration_type_id: '',
    duration_id: '',
    work_location_type: 'on_site',
    profile_description: '',
    required_skills: [],
    required_documents: ['CV', 'Lettre de motivation'],
    benefits: [],
    application_steps: ['Entretien RH', 'Test technique'],
    languages: [],
    activity_rate_min: '20',
    activity_rate_max: '100',
    working_days_hours_description: [],
    job_level: 'junior',
    is_working_hours_flexible: false,
    contact_email: '',
    contact_name: '',
    documents_urls: [],
  });

  useEffect(() => {
    loadMetadata();
    if (offerId) {
      loadOffer();
    }
  }, [offerId]);

  const loadMetadata = async () => {
    try {
      const [
        jobTypes,
        locations,
        contractTypes,
        industries,
        remunerationTypes,
        durations,
      ] = await Promise.all([
        api.offerMetadata.getAllJobTypes(),
        api.offerMetadata.getAllLocations(),
        api.offerMetadata.getAllContractTypes(),
        api.offerMetadata.getAllIndustries(),
        api.offerMetadata.getAllRemunerationTypes(),
        api.offerMetadata.getAllEngagementDurations(),
      ]);

      setMetadata({
        jobTypes,
        locations,
        contractTypes,
        industries,
        remunerationTypes,
        durations,
      });
    } catch (err) {
      setError('Erreur lors du chargement des données');
    }
  };
  const loadOffer = async () => {
    try {
      const offer = await api.offers.getById(offerId!);
      setFormData(offer);
    } catch (err) {
      setError("Erreur lors du chargement de l'offre");
    }
  };
  const handleSelectChange = (field: string) => (
    event: SelectChangeEvent<string>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };
  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleArrayInputChangeSelect = (field: string) => (
    event: SelectChangeEvent<string[]>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',') : value as unknown as string,
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await api.files.upload(formData);
      setFormData((prev) => ({
        ...prev,
        documents_urls: [...(prev.documents_urls || []), ...response.urls],
      }));
    } catch (err) {
      setError('Erreur lors du téléchargement des fichiers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError("Erreur lors de l'enregistrement de l'offre");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert severity="error">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Titre du poste"
          required
          value={formData.title}
          onChange={handleInputChange('title')}
          fullWidth
        />

        <FormControl fullWidth required>
          <InputLabel>Type de travail</InputLabel>
          <Select
            value={formData.job_type_id}
            onChange={handleSelectChange('job_type_id')}
            label="Type de travail"
          >
            {Array.isArray(metadata.jobTypes) ? metadata.jobTypes.map((type) => (
              <MenuItem key={type.job_type_id} value={type.job_type_id}>
                {type.job_type_name}
              </MenuItem>
            )):null}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Lieu</InputLabel>
          <Select
            value={formData.location_id}
            onChange={handleSelectChange('location_id')}
            label="Lieu"
          >
            {Array.isArray(metadata.locations) ? metadata.locations.map((location) => (
              <MenuItem key={location.location_id} value={location.location_id}>
                {`${location.city}, ${location.region}`}
              </MenuItem>
            )):null}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Type de contrat</InputLabel>
          <Select
            value={formData.contract_type_id}
            onChange={handleSelectChange('contract_type_id')}
            label="Type de contrat"
          >
            {Array.isArray(metadata.contractTypes) ? metadata.contractTypes.map((type) => (
              <MenuItem key={type.contract_type_id} value={type.contract_type_id}>
                {type.contract_type_name}
              </MenuItem>
            )):null}
          </Select>
        </FormControl>

        <TextField
          label="Taux d'activité minimum (%)"
          type="number"
          required
          value={formData.activity_rate_min}
          onChange={handleInputChange('activity_rate_min')}
          inputProps={{ min: 0, max: 100 }}
        />

        <TextField
          label="Taux d'activité maximum (%)"
          type="number"
          required
          value={formData.activity_rate_max}
          onChange={handleInputChange('activity_rate_max')}
          inputProps={{ min: 0, max: 100 }}
        />

        <FormControl fullWidth>
          <InputLabel>Type de lieu de travail</InputLabel>
          <Select
            value={formData.work_location_type}
            onChange={handleSelectChange('work_location_type')}
            label="Type de lieu de travail"
          >
            <MenuItem value="on_site">Sur site</MenuItem>
            <MenuItem value="remote">Télétravail</MenuItem>
            <MenuItem value="hybrid">Hybride</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Niveau</InputLabel>
          <Select
            value={formData.job_level}
            onChange={handleSelectChange('job_level')}
            label="Niveau"
          >
            <MenuItem value="junior">Junior</MenuItem>
            <MenuItem value="intermediate">Intermédiaire</MenuItem>
            <MenuItem value="senior">Senior</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TextField
        label="Description du profil"
        multiline
        rows={4}
        required
        value={formData.profile_description}
        onChange={handleInputChange('profile_description')}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Compétences requises</InputLabel>
        <Select
          multiple
          value={formData.required_skills}
          onChange={handleArrayInputChangeSelect('required_skills')}
          input={<OutlinedInput label="Compétences requises" />}
          renderValue={(selected: string[]) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {['React', 'Node.js', 'Python', 'Java', 'SQL'].map((skill) => (
            <MenuItem key={skill} value={skill}>
              {skill}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div>
        <Typography variant="subtitle1" gutterBottom>
          Documents de l'entreprise
        </Typography>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx"
          className="hidden"
          id="company-documents"
        />
        <label htmlFor="company-documents">
          <Button variant="outlined" component="span">
            Télécharger des documents
          </Button>
        </label>
        {formData.documents_urls && formData.documents_urls.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {Array.isArray(formData.documents_urls)? formData.documents_urls.map((url, index) => (
              <Chip
                key={index}
                label={url.split('/').pop()}
                onDelete={() => {
                  setFormData((prev) => ({
                    ...prev,
                    documents_urls: prev.documents_urls?.filter((_, i) => i !== index),
                  }));
                }}
                sx={{ m: 0.5 }}
              />
            )):null}
          </Box>
        )}
      </div>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.is_working_hours_flexible}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_working_hours_flexible: e.target.checked,
              }))
            }
          />
        }
        label="Horaires flexibles"
      />

      <div className="flex justify-end gap-2">
        <Button variant="outlined" onClick={() => window.history.back()}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark"
        >
          {offerId ? "Modifier l'offre" : "Créer l'offre"}
        </Button>
      </div>
    </form>
  );
}