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
  Divider,
  IconButton
} from '@mui/material';
import { api } from '../lib/api';
import { Offer, Industry } from '../types/database';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { AddCard, DeleteOutline } from '@mui/icons-material';

interface Props {
  offerId?: string;
  onSubmit: (data: any) => Promise<void>;
}

type MetadataType = {
  jobTypes: any[];
  locations: any[];
  contractTypes: any[];
  industries: Industry[];
  remunerationTypes: any[];
  durations: any[];
};

export default function JobPostingForm({ offerId, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState<MetadataType>({
    jobTypes: [],
    locations: [],
    contractTypes: [],
    industries: [],
    remunerationTypes: [],
    durations: [],
  });

  const [newWorkingHours, setNewWorkingHours] = useState('');

  const handleAddWorkingHours = () => {
    if(newWorkingHours == '') return
    setFormData((prev: any) => ({
      ...prev,
      working_days_hours_description: [
        ...(prev.working_days_hours_description || []),
        newWorkingHours,
      ],
    }));
    // Reset the input fields
    setNewWorkingHours(
     ''
    );
  };
  const handleRemoveWorkingHours = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      working_days_hours_description: prev.working_days_hours_description.filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };


  const [formData, setFormData] = useState<Partial<Offer>>({
    title: '',
    job_type_id: '',
    location_id: '',
    contract_type_id: '',
    remuneration_type_id: '',
    duration_id: '',
    application_deadline: '',
    startDate: '',
    endDate: '',
    work_location_type: 'on_site',
    profile_description: '',
    required_skills: [],
    required_documents: ['CV', 'Lettre de motivation'],
    benefits: [],
    application_steps: ['Entretien RH', 'Test technique', 'Entretien final'],
    languages: [],
    activity_rate_min: 20,
    activity_rate_max: 100,
    working_days_hours_description: [],
    job_level: 'junior',
    is_working_hours_flexible: false,
    contact_email: '',
    contact_name: '',
    documents_urls: [],
    documents:[],
    max_appliants:1,
    industries: [], // Add this field to store industry IDs
  });

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Informations de base",
    "Description du poste",
    "Conditions de travail",
    "Contact et documents"
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
    } catch (err: any) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    }
  };

  const loadOffer = async () => {
    try {
      let data = await api.offers.getById(offerId!);
      data = data.offer.offer
      const formData: Partial<Offer> = {
        title: data.title,
        job_type_id: data.job_type_id,
        location_id: data.location_id,
        contract_type_id: data.contract_type_id,
        remuneration_type_id: data.remuneration_type_id,
        duration_id: data.duration_id,
        application_deadline: data.application_deadline,
        startDate: data.start,  // correspondance personnalisée
        endDate: data.end,      // correspondance personnalisée
        work_location_type: data.work_location_type || 'on_site',
        profile_description: data.profile_description,
        required_skills: data.required_skills || [],
        required_documents: data.required_documents || ['CV', 'Lettre de motivation'],
        benefits: data.benefits || [],
        application_steps: data.application_steps || ['Entretien RH', 'Test technique', 'Entretien final'],
        languages: data.languages || [],
        activity_rate_min: parseInt(data.activity_rate_min),
        activity_rate_max: parseInt(data.activity_rate_max),
        working_days_hours_description: data.working_days_hours_description || [],
        job_level: data.job_level,
        is_working_hours_flexible: data.is_working_hours_flexible,
        contact_email: data.contact_email,
        contact_name: data.contact_name,
        documents_urls: data.documents_urls || [],
        max_appliants: data.max_appliants || 1,
        industries: data.industries?.map((i:any) => i.industries?.industry_id) || [], // extraction des IDs d'industries
      };
      setFormData(formData);
    } catch (err: any) {
      setError("Erreur lors du chargement de l'offre");
    }
  };

  const handleSelectChange = (field: string) => (
    event: SelectChangeEvent<string>
  ) => {
    setFormData((prev:any) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };


  

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev:any) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleNumberInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev:any) => ({
      ...prev,
      [field]: Number(event.target.value),
    }));
  };


  const handleArrayInputChangeSelect = (field: string) => (
    event: SelectChangeEvent<string[]>
  ) => {
    const value = event.target.value;
    setFormData((prev:any) => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',') : value,
    }));
  };
  const handleArrayInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.value;
    setFormData((prev:any) => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setFormData((prev:any) => ({
      ...prev,
      documents: [...(prev.documents || []), ...files],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        application_deadline: formData.application_deadline ? dayjs(formData.application_deadline).format('YYYY-MM-DD') : null,
        startDate: formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DD') : null,
        endDate: formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DD') : null,
      };
      await onSubmit(submitData);
    } catch (err: any) {
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
    <Box component="form" className="space-y-6">
      {error && <Alert severity="error">{error}</Alert>}
      
      <div className="flex justify-between items-center">
        <Button onClick={() => navigate('/employer')} variant="outlined" type="button">
          Retour
        </Button>
        <Typography variant="h5" component="h2">
          {offerId ? "Modifier l'offre" : "Créer une nouvelle offre"}
        </Typography>
      </div>

      <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="space-y-6">
        {activeStep === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Informations de base
            </Typography>
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
              <InputLabel>Niveau du poste</InputLabel>
              <Select value={formData.job_level} onChange={handleSelectChange('job_level')}>
                <MenuItem value="junior">Junior</MenuItem>
                <MenuItem value="intermediate">Intermédiaire</MenuItem>
                <MenuItem value="senior">Senior</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
            <TextField
              label="Nombre de places recherchée"
              fullWidth
              required
              inputProps={{ min: 1 }} 
              type="number"
              value={formData.max_appliants}
              onChange={handleNumberInputChange('max_appliants')}
            />
            </FormControl>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Description du poste
            </Typography>
            <TextField
              label="Description détaillée"
              multiline
              rows={4}
              fullWidth
              required
              value={formData.profile_description}
              onChange={handleInputChange('profile_description')}
              placeholder="Décrivez les responsabilités, les objectifs et le contexte du poste..."
            />

            <FormControl fullWidth>
              <InputLabel>Secteurs d'activité</InputLabel>
              <Select
                multiple
                value={formData.industries || []}
                onChange={handleArrayInputChangeSelect('industries')}
                input={<OutlinedInput label="Secteurs d'activité" />}
                renderValue={(selected: string[]) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const industry = metadata.industries.find(i => i.industry_id === value);
                      return (
                        <Chip key={value} label={industry?.industry_name || value} />
                      );
                    })}
                  </Box>
                )}
              >
                {metadata.industries.map((industry) => (
                  <MenuItem key={industry.industry_id} value={industry.industry_id}>
                    {industry.industry_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Avantages</InputLabel>
              <Select
                multiple
                value={formData.benefits || []}
                onChange={handleArrayInputChangeSelect('benefits')}
                input={<OutlinedInput label="Avantages" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="Formation continue">Formation continue</MenuItem>
                <MenuItem value="Télétravail possible">Télétravail possible</MenuItem>
                <MenuItem value="Horaires flexibles">Horaires flexibles</MenuItem>
                <MenuItem value="13ème salaire">13ème salaire</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Langues</InputLabel>
              <Select
                multiple
                value={formData.languages || []}
                onChange={handleArrayInputChangeSelect('languages')}
                input={<OutlinedInput label="Langues" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="Français">Français</MenuItem>
                <MenuItem value="Anglais">Anglais</MenuItem>
                <MenuItem value="Allemand">Allemand</MenuItem>
                <MenuItem value="Italien">Italien</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Documents requis</InputLabel>
              <Select
                multiple
                value={formData.required_documents || []}
                onChange={handleArrayInputChangeSelect('required_documents')}
                input={<OutlinedInput label="Documents requis" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="CV">CV</MenuItem>
                <MenuItem value="Lettre de motivation">Lettre de motivation</MenuItem>
                <MenuItem value="Diplômes">Diplômes</MenuItem>
                <MenuItem value="Certificats">Certificats</MenuItem>
              </Select>
            </FormControl>
            </>
        )}

        {activeStep === 2 && (
          <>
            <Typography variant="h6" gutterBottom>
              Conditions de travail
            </Typography>
            <FormControl fullWidth required>
              <InputLabel>Lieu de travail</InputLabel>
              <Select value={formData.location_id} onChange={handleSelectChange('location_id')}>
                {metadata.locations.map((loc: any) => (
                  <MenuItem key={loc.location_id} value={loc.location_id}>
                    {`${loc.region}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <TextField
              placeholder='Type de lieu de travail (remote)'
                value={formData.work_location_type}
                onChange={handleInputChange('work_location_type')}
              >
              </TextField>
            </FormControl>
            <FormControl fullWidth >
              <InputLabel>Durée</InputLabel>
              <Select value={formData.duration_id} onChange={handleSelectChange('duration_id')}>
                {metadata.durations.map((dr: any) => (
                  <MenuItem key={dr.duration_id} value={dr.duration_id}>
                    {dr.duration_label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Taux d'activité minimum (%)"
                type="number"
                required
                value={formData.activity_rate_min}
                onChange={handleNumberInputChange('activity_rate_min')}
                inputProps={{ min: 0, max: 100 }}
              />

              <TextField
                label="Taux d'activité maximum (%)"
                type="number"
                required
                value={formData.activity_rate_max}
                onChange={handleNumberInputChange('activity_rate_max')}
                inputProps={{ min: 0, max: 100 }}
              />
            </div>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_working_hours_flexible}
                  onChange={(e) =>
                    setFormData((prev:any) => ({
                      ...prev,
                      is_working_hours_flexible: e.target.checked,
                    }))
                  }
                />
              }
              label="Horaires flexibles"
            />

              <div className="flex gap-4 items-end">
                <TextField
                  label="Jour(s) - horaires"
                  placeholder='Lundi  08:00 - 18:00'
                  type="text"
                  value={newWorkingHours}
                  onChange={(e) => setNewWorkingHours(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />

                <Button
                  type="button"
                  variant="contained"
                  onClick={handleAddWorkingHours}
                  startIcon={<AddCard />}
                >
                  Ajouter
                </Button>
              </div>

              <div className="mt-4 space-y-2">
                {formData.working_days_hours_description?.map((hours: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span>{hours}</span>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveWorkingHours(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <DeleteOutline />
                    </IconButton>
                  </div>
                ))}
              </div>

              <FormControl fullWidth required>
              <InputLabel>Type de remuneration</InputLabel>
              <Select
                value={formData.remuneration_type_id}
                onChange={handleSelectChange('remuneration_type_id')}
              >
                {Array.isArray(metadata.remunerationTypes) && metadata.remunerationTypes.map((rm: any) => (
                  <MenuItem key={rm.remuneration_type_id} value={rm.remuneration_type_id}>
                    {rm.remuneration_type_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Date de début"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange('startDate')}
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                label="Date de fin"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange('endDate')}
                InputLabelProps={{ shrink: true }}
              />
            </div>

            <TextField
              label="Date limite de candidature"
              type="date"
              value={formData.application_deadline}
              onChange={handleInputChange('application_deadline')}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </>
        )}

        {activeStep === 3 && (
          <>
            <Typography variant="h6" gutterBottom>
              Contact et documents
            </Typography>
            <TextField
              label="Nom du contact"
              fullWidth
              required
              value={formData.contact_name}
              onChange={handleInputChange('contact_name')}
            />

            <TextField
              label="Email du contact"
              type="email"
              fullWidth
              required
              value={formData.contact_email}
              onChange={handleInputChange('contact_email')}
            />

            <FormControl fullWidth>
              <InputLabel>Étapes du processus de recrutement</InputLabel>
              <Select
                multiple
                value={formData.application_steps || []}
                onChange={handleArrayInputChangeSelect('application_steps')}
                input={<OutlinedInput label="Étapes du processus de recrutement" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="Entretien RH">Entretien RH</MenuItem>
                <MenuItem value="Test technique">Test technique</MenuItem>
                <MenuItem value="Entretien technique">Entretien technique</MenuItem>
                <MenuItem value="Entretien final">Entretien final</MenuItem>
              </Select>
            

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Documents de l'entreprise
              </Typography>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                accept="*"
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
                  {formData.documents_urls.map((url:any, index:any) => (
                    <Chip
                      key={index}
                      label={url.split('/').pop()}
                      onDelete={() => {
                        setFormData((prev:any) => ({
                          ...prev,
                          documents_urls: prev.documents_urls?.filter((_:any, i:any) => i !== index),
                        }));
                      }}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              )}
              {formData.documents && formData.documents.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {formData.documents.map((doc:any, index:any) => (
                    <Chip
                      key={index}
                      label={doc.name}
                      onDelete={() => {
                        setFormData((prev:any) => ({
                          ...prev,
                          documents: prev.documents?.filter((_:any, i:any) => i !== index),
                        }));
                      }}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              )}
            </div>
            </FormControl>
          </>
        )}

        <Divider className="my-6" />

        <div className="flex justify-between">
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
            type="button"
          >
            Précédent
          </Button>
          <div className="space-x-2">
            {activeStep === steps.length -1 ? (
              <Button
                type= 'button'
                variant="contained"
                color="primary"
                className="bg-primary hover:bg-primary-dark"
                onClick={(e) => handleSubmit(e)}
              >
                {offerId ? "Mettre à jour l'offre" : "Publier l'offre"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                color="primary"
                type="button"
                className="bg-primary hover:bg-primary-dark"
              >
                Suivant
              </Button>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
}