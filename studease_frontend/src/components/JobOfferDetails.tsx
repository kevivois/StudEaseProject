import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  ListItemButton,
  Link as MuiLink,
  Stack,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';
import PhoneIcon from '@mui/icons-material/Phone';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import ApplicationDetails from '../components/ApplicationDetails';

export default function JobOfferDetails() {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [applications,setApplications] = useState<any | null>(null);
  let navigate = useNavigate()

  const handleDownloadDocument = async (documentUrl: string) => {
    try {
      window.open(documentUrl, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  useEffect(() => {
    const loadOffer = async () => {
      try {
        setLoading(true);
        let data = (await api.offers.getById(id!)).offer;
        setOffer(data.offer);
        setApplications(data.applications)
      } catch (err) {
        setError("Erreur lors du chargement de l'offre");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadOffer();
    }
  }, [id]);

  const reloadApplication = async (application_id:string) => {
    try {
      setLoading(true);
      let data = await api.applications.getById(application_id)
      setApplications((prev:any) =>
        prev.map((app:any) =>
          app.id === application_id ? data.application : app
        )
      );
    } catch (err) {
      setError("Erreur lors du rechargement de l'offre");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await api.applications.update(applicationId, { status });
      // Refresh offer data to get updated applications
      const updatedOffer = await api.offers.getById(id!);
      setOffer(updatedOffer.offer);
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };
  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !offer) {
    return (
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert severity="error">{error || "L'offre n'a pas été trouvée"}</Alert>
      </Box>
    );
  }
  return (
    <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Paper className="p-8 space-y-8">
      <Button onClick={() => navigate('/employer')} variant="outlined" type="button">
          Retour
        </Button>
        {/* Header */}
        <div className="space-y-4">
          <Typography variant="h4" component="h1" className="font-bold">
            {offer.title}
          </Typography>
          
          <Grid container spacing={3} className="items-center">
            <Grid item xs={12} sm={6} md={3}>
              <div className="flex items-center gap-2">
                <BusinessIcon className="text-gray-400" />
                <Typography>{offer.contract_types?.contract_type_name}</Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="flex items-center gap-2">
                <LocationOnIcon className="text-gray-400" />
                <Typography> {offer.locations?.region}</Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="flex items-center gap-2">
                <WorkIcon className="text-gray-400" />
                <Typography>{offer.work_location_type}</Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="flex items-center gap-2">
                <AccessTimeIcon className="text-gray-400" />
                <Typography>{offer.activity_rate_min}% - {offer.activity_rate_max}%</Typography>
              </div>
            </Grid>
          </Grid>
        </div>

        <Divider />

        {/* Main Content */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <div className="space-y-6">
              {/* Description */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Description du poste
                  </Typography>
                  <Typography variant="body1" className="whitespace-pre-line">
                    {offer.profile_description}
                  </Typography>
                </CardContent>
              </Card>

              {/* Skills and Requirements */}
              {(offer.required_skills?.length > 0 || offer.languages?.length > 0) && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Compétences et prérequis
                    </Typography>
                    
                    {offer.required_skills?.length > 0 && (
                      <div className="mb-4">
                        <Typography variant="subtitle2" gutterBottom>
                          Compétences techniques
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                          {offer.required_skills.map((skill:any, index:any) => (
                            <Chip
                              key={index}
                              label={skill}
                              className="bg-primary/10 text-primary"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {offer.languages?.length > 0 && (
                      <div>
                        <Typography variant="subtitle2" gutterBottom>
                          Langues requises
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                          {offer.languages.map((language:any, index:any) => (
                            <Chip
                              key={index}
                              icon={<TranslateIcon />}
                              label={language}
                              className="bg-secondary/10 text-secondary"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {offer.benefits && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Avantages
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {offer.benefits.map((benefit:any, index:any) => (
                        <Chip
                          key={index}
                          label={benefit}
                          className="bg-green-100 text-green-800"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* company documents */}

              <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Documents mis en ligne
                    </Typography>
                    <div>
                      <List>
                        {offer.documents_urls && Array.isArray(offer.documents_urls) && offer.documents_urls.map((doc:any, index:any) => (
                          <ListItemButton
                            key={index}
                            onClick={() => handleDownloadDocument(api.offers.files.getFullUrl(id!,doc))}
                          >
                            <ListItemIcon>
                              <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText primary={doc.split('/').pop()} />
                          </ListItemButton>
                        ))}
                      </List>
                    </div>
                    </CardContent>
                  </Card>

              {/* Applications */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom className="flex items-center justify-between">
                    Candidatures
                    <Chip 
                      label={`${applications?.length || 0}/${offer.max_appliants}`}
                      color={applications?.length >= offer.max_appliants ? "error" : "success"}
                    />
                  </Typography>

                  {Array.isArray(applications) && applications.length === 0  ? (
                    <Alert severity="info">Aucune candidature pour le moment</Alert>
                  ) : (
                    <div className="space-y-4">
                      {Array.isArray(applications) ? applications.map((application:any) => (
                        <Card key={application.id} variant="outlined">
                          <CardContent>
                            <div className="flex items-start gap-4">
                              <Avatar className="bg-primary">
                                {application.users?.first_name?.[0]}
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Typography variant="subtitle1">
                                      {application.users.first_name} {application.users.last_name}
                                    </Typography>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                      <EmailIcon className="w-4 h-4" />
                                      <span>{application.users?.email}</span>
                                    </div>
                                    {application.users?.phone_number && (
                                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <PhoneIcon className="w-4 h-4" />
                                        <span>{application.users.phone_number}</span>
                                      </div>
                                    )}
                                  </div>
                                  <Chip
                                    label={application.status}
                                    color={
                                      application.status === 'accepté'
                                        ? 'success'
                                        : application.status === 'refusé'
                                        ? 'error'
                                        : 'default'
                                    }
                                  />
                                </div>

                                <Typography variant="body2" className="mt-2">
                                  {application.application_message}
                                </Typography>

                                {application.documents?.length > 0 && (
                                  <div className="mt-2">
                                    <Typography variant="subtitle1" gutterBottom>
                                        Documents
                                      </Typography>
                                      <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {application.documents.map((doc: string, index: number) => (
                                          <MuiLink
                                            key={index}
                                            href={api.applications.files.getFullUrl(application.id, doc)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            underline="none"
                                            sx={{ mb: 1 }}
                                          >
                                            <Chip
                                              icon={<DescriptionIcon />}
                                              label={doc.split('/').pop()}
                                              clickable
                                              className="cursor-pointer"
                                            />
                                          </MuiLink>
                                        ))}
                                      </Stack>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 mt-4">
                                  <Button
                                    variant="outlined"
                                    onClick={() => setSelectedApplication(application)}
                                  >
                                    Voir les détails
                                  </Button>
                                  {application.status === 'en_attente' && (
                                    <>
                                      <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleUpdateApplicationStatus(application.id, 'accepté')}
                                      >
                                        Accepter
                                      </Button>
                                      <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleUpdateApplicationStatus(application.id, 'refusé')}
                                      >
                                        Refuser
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )) : null}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </Grid>

          <Grid item xs={12} md={4}>
            <div className="space-y-4">
              {/* Key Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informations clés
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon className="text-gray-400" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Niveau"
                        secondary={offer.job_level}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarTodayIcon className="text-gray-400" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Date limite de candidature"
                        secondary={new Date(offer.application_deadline).toLocaleDateString()}
                      />
                    </ListItem>
                    {offer.startDate && (
                      <ListItem>
                        <ListItemIcon>
                          <CalendarTodayIcon className="text-gray-400" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Date de début"
                          secondary={new Date(offer.startDate).toLocaleDateString()}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>

              {/* Required Documents */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Documents requis
                  </Typography>
                  <List>
                    {offer.required_documents?.map((doc:any, index:any) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <DescriptionIcon className="text-gray-400" />
                        </ListItemIcon>
                        <ListItemText primary={doc} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon className="text-gray-400" />
                      </ListItemIcon>
                      <ListItemText primary={offer.contact_name} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon className="text-gray-400" />
                      </ListItemIcon>
                      <ListItemText primary={offer.contact_email} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Grid>
      </Paper>

      {selectedApplication && (
        <ApplicationDetails
          open={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          reloadApplication={reloadApplication}
          application={selectedApplication}
          onStatusUpdate={handleUpdateApplicationStatus}
        />
      )}
    </Box>
  );
}