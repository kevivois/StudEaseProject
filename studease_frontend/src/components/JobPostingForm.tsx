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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { api } from '../lib/api';
import { Offer } from '../types/database';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  offerId?: string;
  onSubmit: (data: any) => Promise<void>;
}

type MetadataType = {
  jobTypes: any[];
  locations: any[];
  contractTypes: any[];
  industries: any[];
  remunerationTypes: any[];
  durations: any[];
};

export default function JobPostingForm({ offerId, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let location = useLocation()
  let navigate = useNavigate()

  const handleBackClick = () => {
    navigate('/employer');  // Utilisation de `navigate` pour rediriger vers /employers
  };
  const [metadata, setMetadata] = useState<MetadataType>({
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
    application_deadline: '',
    start: '',
    end: '',
    work_location_type: '',
    profile_description: '',
    required_skills: [],
    required_documents: ['CV', 'Lettre de motivation'],
    benefits: [],
    application_steps: [],
    languages: [],
    activity_rate_min: '',
    activity_rate_max: '',
    working_days_hours_description: [],
    job_level: '',
    is_working_hours_flexible: false,
    contact_email: '',
    contact_name: '',
    documents_urls: [],
  });

  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState([false, false, false, false]);


  const steps = [
    "Informations sur l'entreprise",
    "Détails du poste",
    "Profil recherché",
    "Conditions de travail",
  ];

  useEffect(() => {
    loadMetadata();
    if (offerId) {
      loadOffer();
    }
  }, [offerId]);

  const loadMetadata = async () => {
    try {
      const [
        jobTypesResponse,
        locationsResponse,
        contractTypesResponse,
        industriesResponse,
        remunerationTypesResponse,
        durationsResponse,
      ] = await Promise.all([
        api.offerMetadata.getAllJobTypes(),
        api.offerMetadata.getAllLocations(),
        api.offerMetadata.getAllContractTypes(),
        api.offerMetadata.getAllIndustries(),
        api.offerMetadata.getAllRemunerationTypes(),
        api.offerMetadata.getAllEngagementDurations(),
      ]);
  
      const metadata: MetadataType = {
        jobTypes: jobTypesResponse.data ?? [],
        locations: locationsResponse.data ?? [],
        contractTypes: contractTypesResponse.data ?? [],
        industries: industriesResponse.data ?? [],
        remunerationTypes: remunerationTypesResponse.data ?? [],
        durations: durationsResponse.data ?? [],
      };
  
      setMetadata(metadata);
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert severity="error">{error}</Alert>}
      <Button onClick={() => handleBackClick()}>Retour</Button>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <>
          <TextField
            label="Titre du poste"
            fullWidth
            required
            value={formData.title}
            onChange={handleInputChange('title')}
          />

          <FormControl fullWidth required>
            <InputLabel>Type de travail</InputLabel>
            <Select value={formData.job_type_id} onChange={handleSelectChange('job_type_id')}>
              {metadata.jobTypes.map((jt: any) => (
                <MenuItem key={jt.job_type_id} value={jt.job_type_id}>
                  {jt.job_type_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Lieu</InputLabel>
            <Select value={formData.location_id} onChange={handleSelectChange('location_id')}>
              {metadata.locations.map((loc: any) => (
                <MenuItem key={loc.location_id} value={loc.location_id}>
                  {`${loc.city}, ${loc.region}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Type de contrat</InputLabel>
            <Select value={formData.contract_type_id} onChange={handleSelectChange('contract_type_id')}>
              {metadata.contractTypes.map((ct: any) => (
                <MenuItem key={ct.contract_type_id} value={ct.contract_type_id}>
                  {ct.contract_type_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Durée</InputLabel>
            <Select value={formData.duration_id} onChange={handleSelectChange('duration_id')}>
              {metadata.durations.map((d: any) => (
                <MenuItem key={d.duration_id} value={d.duration_id}>
                  {d.duration_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={handleNext}>
            Suivant
          </Button>
        </>
      )}

      {activeStep === 1 && (
        <>
          <TextField
            label="Date de début"
            type="date"
            value={formData.start ?? ''}
            onChange={handleInputChange('start')}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="Date de fin"
            type="date"
            value={formData.end ?? ''}
            onChange={handleInputChange('end')}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Date limite de candidature"
            type="date"
            value={formData.application_deadline ?? ''}
            onChange={handleInputChange('application_deadline')}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Button variant="contained" color="primary" onClick={handleBack}>
            Précédent
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            Suivant
          </Button>
        </>
      )}

      {activeStep === 2 && (
        <>
          <TextField
            label="Description du profil recherché"
            multiline
            rows={4}
            fullWidth
            value={formData.profile_description}
            onChange={handleInputChange('profile_description')}
          />

          <Button variant="contained" color="primary" onClick={handleBack}>
            Précédent
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            Suivant
          </Button>
        </>
      )}

      {activeStep === 3 && (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_working_hours_flexible || false}
                onChange={(e) =>
                  setFormData({ ...formData, is_working_hours_flexible: e.target.checked })
                }
              />
            }
            label="Horaires flexibles"
          />

          <TextField
            label="Taux d'activité minimum (%)"
            type="number"
            value={formData.activity_rate_min}
            onChange={handleInputChange('activity_rate_min')}
            fullWidth
          />

          <TextField
            label="Taux d'activité maximum (%)"
            type="number"
            value={formData.activity_rate_max}
            onChange={handleInputChange('activity_rate_max')}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleBack}>
            Précédent
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {offerId ? 'Mettre à jour l’offre' : 'Publier l’offre'}
          </Button>
        </>
      )}
    </Box>
  );
}
