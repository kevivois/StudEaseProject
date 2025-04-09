import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import { Application } from '../types/database';

interface Props {
  applications: Application[];
  onViewApplication: (application: Application) => void;
  onUpdateStatus: (applicationId: string, status: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'en_attente':
      return 'warning';
    case 'en_cours':
      return 'info';
    case 'accepté':
      return 'success';
    case 'refusé':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'en_attente':
      return 'En attente';
    case 'en_cours':
      return 'En cours';
    case 'accepté':
      return 'Accepté';
    case 'refusé':
      return 'Refusé';
    default:
      return status;
  }
};

export default function ApplicationsOverview({
  applications,
  onViewApplication,
  onUpdateStatus,
}: Props) {
  return (
    <div className="space-y-6">
      <Typography variant="h5" component="h2" className="font-bold">
        Candidatures récentes
      </Typography>

      <div className="grid gap-6">
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="bg-primary/10 text-primary">
                  <PersonIcon />
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="h6">
                        {application.offer?.title}
                      </Typography>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <AccessTimeIcon className="w-4 h-4" />
                        <Typography variant="body2">
                          Postulé le {new Date(application.applied_at).toLocaleDateString()}
                        </Typography>
                      </div>
                    </div>
                    <Chip
                      label={getStatusLabel(application.status)}
                      color={getStatusColor(application.status)}
                      size="small"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center text-gray-600">
                      <LocationOnIcon className="w-4 h-4 mr-2" />
                      <Typography variant="body2">
                        {application.offer?.work_location_type}
                      </Typography>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <SchoolIcon className="w-4 h-4 mr-2" />
                      <Typography variant="body2">
                        {application.offer?.job_level}
                      </Typography>
                    </div>
                  </div>

                  {application.application_progress.length > 0 && (
                    <>
                      <Divider className="my-4" />
                      <div>
                        <Typography variant="subtitle2" className="mb-2">
                          Progression
                        </Typography>
                        <div className="flex gap-2">
                          {application.application_progress.map((step, index) => (
                            <Chip
                              key={index}
                              label={step}
                              size="small"
                              className="bg-primary/10 text-primary"
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outlined"
                      onClick={() => onViewApplication(application)}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      Voir le dossier
                    </Button>
                    {application.status === 'en_attente' && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => onUpdateStatus(application.id, 'accepté')}
                          color="success"
                        >
                          Accepter
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => onUpdateStatus(application.id, 'refusé')}
                          color="error"
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
        ))}
      </div>
    </div>
  );
}