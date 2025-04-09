import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Button
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { Application } from '../types/database';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

interface Props {
  applications: Application[];
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
  return (
    <div className="space-y-6">
      {applications.map((application) => (
        <Card key={application.id} className="overflow-visible">
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <Typography variant="h6" component="h3">
                  {application.offer?.title}
                </Typography>
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                  <BusinessIcon className="w-4 h-4" />
                  <span>{application.offer?.company?.company_name}</span>
                  <LocationOnIcon className="w-4 h-4 ml-2" />
                  <span>Lausanne, VD</span>
                </div>
              </div>
              <Chip
                label={getStatusLabel(application.status)}
                className={getStatusColor(application.status)}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AccessTimeIcon className="w-4 h-4" />
              <span>
                Postulé le {new Date(application.applied_at).toLocaleDateString()}
              </span>
            </div>

            {application.application_progress.length > 0 && (
              <div className="mt-4">
                <Typography variant="subtitle2" className="mb-2">
                  Progression de la candidature
                </Typography>
                <Timeline>
                  {application.application_progress.map((step, index) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot className="bg-primary" />
                        {index < application.application_progress.length - 1 && (
                          <TimelineConnector className="bg-primary" />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>{step}</TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            )}

            {application.employer_feedback && (
              <div className="mt-4">
                <Typography variant="subtitle2" className="mb-2">
                  Retour du recruteur
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {application.employer_feedback}
                </Typography>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outlined"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Voir les détails
              </Button>
              {application.status === 'en_attente' && (
                <Button
                  variant="outlined"
                  color="error"
                >
                  Retirer ma candidature
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}