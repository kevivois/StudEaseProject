import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Button, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import MoneyIcon from '@mui/icons-material/Money';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import TimerIcon from '@mui/icons-material/Timer';
import FlexibleIcon from '@mui/icons-material/AllInclusive';
import { api } from '../lib/api';

interface Props {
  offer: any;
  onApply: (offer: any) => void;
  onSave: (offerId: string) => void;
  isSaved: boolean;
}

export default function OfferCard({ offer, onApply, onSave, isSaved }: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleDownloadDocument = async (documentUrl: string) => {
    try {
      const signedUrl = await api.offers.files.getFullUrl(offer.offer_id,documentUrl);
      window.open(signedUrl, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };
  

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h6" className="font-semibold">
                {offer.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {offer.companies?.company_name}
              </Typography>
            </div>
            <IconButton onClick={() => onSave(offer.offer_id)}>
              {isSaved ? (
                <BookmarkIcon className="text-primary" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">
               {offer.locations?.region}
              </Typography>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <WorkIcon fontSize="small" />
              <Typography variant="body2">
                {offer.contract_types?.contract_type_name}
              </Typography>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2">
                {offer.activity_rate_min}% - {offer.activity_rate_max}%
              </Typography>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <BusinessIcon fontSize="small" />
              <Typography variant="body2">
                {offer.job_types?.job_type_name}
              </Typography>
            </div>
          </div>

          <div>
            <Typography variant="subtitle2" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary" className="line-clamp-3">
              {offer.profile_description}
            </Typography>
            <Button
              size="small"
              className="text-primary mt-1"
              onClick={() => setIsDetailsOpen(true)}
            >
              Voir plus
            </Button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Typography variant="caption" color="text.secondary">
              Publié le {new Date(offer.created_at).toLocaleDateString()}
            </Typography>
            <Button
              variant="contained"
              onClick={() => onApply(offer)}
              className="bg-primary hover:bg-primary-dark"
            >
              Postuler
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="space-y-2">
            <Typography variant="h5" component="h2">
              {offer.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {offer.companies?.company_name}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <LocationOnIcon className="text-gray-400" />
                <Typography>
                  {offer.locations?.country}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <WorkIcon className="text-gray-400" />
                <Typography>{offer.work_location_type}</Typography>
              </div>
              <div className="flex items-center gap-2">
                <BusinessIcon className="text-gray-400" />
                <Typography>{offer.job_level}</Typography>
              </div>
              <div className="flex items-center gap-2">
                <MoneyIcon className="text-gray-400" />
                <Typography>{offer.remuneration_types?.remuneration_type_name}</Typography>
              </div>
              <div className="flex items-center gap-2">
                <AccessTimeIcon className="text-gray-400" />
                <Typography>{offer.activity_rate_min}% - {offer.activity_rate_max}%</Typography>
              </div>
              <div className="flex items-center gap-2">
                <SchoolIcon className="text-gray-400" />
                <Typography>{offer.job_types?.job_type_name}</Typography>
              </div>
            </div>

            <Divider />

            <div>
              <Typography variant="h6" gutterBottom>
                Description du poste
              </Typography>
              <Typography variant="body1" className="whitespace-pre-line">
                {offer.profile_description}
              </Typography>
            </div>

            {offer.required_skills?.length > 0 && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Compétences requises
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {offer.required_skills.map((skill: any, index: any) => (
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
                <Typography variant="h6" gutterBottom>
                  Langues requises
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {offer.languages.map((language: any, index: any) => (
                    <Chip
                      key={index}
                      icon={<TranslateIcon />}
                      label={language}
                      className="bg-purple-100 text-purple-800"
                    />
                  ))}
                </div>
              </div>
            )}

            {offer.industries?.length > 0 && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Secteurs d'activité
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {offer.industries.map((industry: any) => (
                    <Chip
                      key={industry.industry_id}
                      label={industry.industry_name}
                      className="bg-blue-100 text-blue-800"
                    />
                  ))}
                </div>
              </div>
            )}

            {offer.benefits?.length > 0 && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Avantages
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {offer.benefits.map((benefit: any, index: any) => (
                    <Chip
                      key={index}
                      label={benefit}
                      className="bg-green-100 text-green-800"
                    />
                  ))}
                </div>
              </div>
            )}

            {offer.application_steps?.length > 0 && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Processus de recrutement
                </Typography>
                <List>
                  {offer.application_steps.map((step: any, index: any) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <DescriptionIcon className="text-primary" />
                      </ListItemIcon>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </div>
            )}

            <div>
              <Typography variant="h6" gutterBottom>
                Informations complémentaires
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon className="text-gray-400" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date limite de candidature"
                    secondary={new Date(offer.application_deadline).toLocaleDateString()}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <TimerIcon className="text-gray-400" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Durée d'engagement"
                    secondary={offer.engagement_durations?.duration_label}
                  />
                </ListItem>

                {offer.is_working_hours_flexible && (
                  <ListItem>
                    <ListItemIcon>
                      <FlexibleIcon className="text-gray-400" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Horaires flexibles"
                      secondary="Les horaires de travail sont flexibles"
                    />
                  </ListItem>
                )}

                {offer.start && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon className="text-gray-400" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date de début"
                      secondary={new Date(offer.start).toLocaleDateString()}
                    />
                  </ListItem>
                )}
                {offer.end && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon className="text-gray-400" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date de fin"
                      secondary={new Date(offer.end).toLocaleDateString()}
                    />
                  </ListItem>
                )}
              </List>
            </div>

            <div>
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
            </div>

            {offer.required_documents?.length > 0 && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Documents requis
                </Typography>
                <List>
                  {offer.required_documents.map((doc: any, index: any) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <DescriptionIcon className="text-gray-400" />
                      </ListItemIcon>
                      <ListItemText primary={doc} />
                    </ListItem>
                  ))}
                </List>
              </div>
            )}
            
            {offer.documents_urls && offer.documents_urls.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Documents mis en ligne
                  </Typography>
                  <List>
                    {offer.documents_urls.map((doc: any, index: any) => (
                      <ListItemButton
                        key={index}
                        onClick={() => handleDownloadDocument(doc)}
                      >
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary={doc.split('/').pop()} />
                      </ListItemButton>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDetailsOpen(false)}>
            Fermer
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setIsDetailsOpen(false);
              onApply(offer);
            }}
            className="bg-primary hover:bg-primary-dark"
          >
            Postuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}