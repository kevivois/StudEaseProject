import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Tooltip,
  Divider,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  Link
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import MoneyIcon from '@mui/icons-material/Money';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';
import { api } from "../lib/api"
import { InsertDriveFile } from '@mui/icons-material';
interface Props {
  applications: any[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'en_attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepté':
      return 'bg-green-100 text-green-800';
    case 'refusé':
      return 'bg-red-100 text-red-800';
    case 'en_cours':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'en_attente':
      return 'En attente';
    case 'accepté':
      return 'Accepté';
    case 'refusé':
      return 'Refusé';
    case 'en_cours':
      return 'En cours';
    default:
      return status;
  }
};

export default function ApplicationsList({ applications }: Props) {

  const handleDownloadDocument = async (applicationId:string,documentUrl: string) => {
      try {
        const fileUrl = api.applications.files.getFullUrl(applicationId,documentUrl);
        window.open(fileUrl, '_blank');
      } catch (error) {
        console.error('Error downloading document:', error);
      }
    };

  return (
    <div className="space-y-6">
      {Array.isArray(applications) ? applications.map((application) => (
        <Card key={application.id} className="overflow-visible">
          <CardContent className="space-y-4">
            {/* Header with Title and Status */}
            <div className="flex justify-between items-start">
              <div>
                <Typography variant="h6" component="h3">
                  {application.offers?.title}
                </Typography>
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                  <BusinessIcon className="w-4 h-4" />
                  <span>{application.offers?.companies?.company_name}</span>
                </div>
              </div>
            </div>

            <Divider />

            {/* Job Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <LocationOnIcon className="w-4 h-4" />
                <Typography variant="body2">
                  {application.offers?.locations?.region}
                  <span className="text-gray-500 ml-1">({application.offers?.work_location_type})</span>
                </Typography>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <WorkIcon className="w-4 h-4" />
                <Typography variant="body2">
                  {application.offers?.contract_types?.contract_type_name}
                </Typography>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <SchoolIcon className="w-4 h-4" />
                <Typography variant="body2">
                  {application.offers?.job_level}
                </Typography>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MoneyIcon className="w-4 h-4" />
                <Typography variant="body2">
                  {application.offers?.remuneration_types?.remuneration_type_name}
                </Typography>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <AccessTimeIcon className="w-4 h-4" />
                <Typography variant="body2">
                  {`${application.offers?.activity_rate_min}% - ${application.offers?.activity_rate_max}%`}
                </Typography>
              </div>

              {application.offers?.engagement_durations && (
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarTodayIcon className="w-4 h-4" />
                  <Typography variant="body2">
                    {application.offers.engagement_durations.duration_label}
                  </Typography>
                </div>
              )}
            </div>

            {/* Industries */}
            {application.offers?.industries && application.offers.industries.length > 0 && (
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Secteurs d'activité
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {application.offers.industries.map((industry: any) => (
                    <Chip
                      key={industry.industries.industry_id}
                      label={industry.industries.industry_name}
                      size="small"
                      className="bg-blue-100 text-blue-800"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {application.offers?.languages && application.offers.languages.length > 0 && (
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Langues requises
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {application.offers.languages.map((language: string, index: number) => (
                    <Chip
                      key={index}
                      icon={<TranslateIcon className="w-4 h-4" />}
                      label={language}
                      size="small"
                      className="bg-purple-100 text-purple-800"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* documents */}

            {application.documents && Array.isArray(application.documents) && application.documents.length > 0 && (
  <div>
    <Typography variant="subtitle1" gutterBottom>
      Documents
    </Typography>
    <List>
      {application.documents.map((doc: string, index: number) => {
        const fileName = doc.split('/').pop(); // Juste le nom du fichier
        const fileUrl = api.applications.files.getFullUrl(application.id,doc);

                return (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon>
                      <InsertDriveFile color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link href={fileUrl} target="_blank" rel="noopener noreferrer" underline="hover">
                          {fileName}
                        </Link>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </div>
        )}

            {/* Application Message */}
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Message de candidature
              </Typography>
              <Typography variant="body2" className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {application.application_message}
              </Typography>
            </div>

            {/* Application Date */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AccessTimeIcon className="w-4 h-4" />
              <span>
                Postulé le {new Date(application.applied_at).toLocaleDateString()}
              </span>
            </div>

            {/* Application Progress */}
            {application.offers?.application_steps && application.offers.application_steps.length > 0 && (
              <div className="mt-4">
                <Typography variant="subtitle2" className="mb-2">
                  Étapes du recrutement
                </Typography>
                <Timeline>
                  {application.offers.application_steps.map((step: string, index: number) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot className={index === 0 ? "bg-primary" : "bg-gray-300"} />
                        {index < application.offers.application_steps.length - 1 && (
                          <TimelineConnector className="bg-gray-300" />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>{step}</TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            )}

            {/* Employer Feedback */}
            {application.employer_feedback && (
              <div className="mt-4">
                <Typography variant="subtitle2" className="mb-2">
                  Retour du recruteur
                </Typography>
                <Typography variant="body2" className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {application.employer_feedback}
                </Typography>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              {/*
              <Button
                variant="outlined"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Voir les détails
              </Button>
              */}
              <Button
                  variant="outlined"
                  color="error"
                >
                  Retirer ma candidature
                </Button>
            </div>
          </CardContent>
        </Card>
      )) : null}
    </div>
  );
}