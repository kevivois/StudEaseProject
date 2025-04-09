import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Application } from '../types/database';
import { api } from '../lib/api';

interface Props {
  open: boolean;
  onClose: () => void;
  application: Application;
  onStatusUpdate: (applicationId: string, status: string) => void;
}

export default function ApplicationDetails({
  open,
  onClose,
  application,
  onStatusUpdate,
}: Props) {
  const [feedback, setFeedback] = useState(application.employer_feedback || '');
  const [loading, setLoading] = useState(false);

  const handleSaveFeedback = async () => {
    try {
      setLoading(true);
      await api.applications.update(application.id, {
        employer_feedback: feedback,
      });
      onClose();
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentUrl: string) => {
    try {
      const signedUrl = await api.files.getSignedUrl(documentUrl);
      window.open(signedUrl, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography variant="h6">Détails de la candidature</Typography>
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
      </DialogTitle>
      <DialogContent dividers>
        <div className="space-y-6">
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Informations du candidat
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${application.user?.first_name} ${application.user?.last_name}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary={application.user?.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary={application.user?.phone_number} />
              </ListItem>
            </List>
          </div>

          <Divider />

          <div>
            <Typography variant="subtitle1" gutterBottom>
              Message de candidature
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {application.application_message}
            </Typography>
          </div>

          <Divider />

          <div>
            <Typography variant="subtitle1" gutterBottom>
              Documents
            </Typography>
            <List>
              {application.documents.map((doc, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleDownloadDocument(doc)}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary={doc.split('/').pop()} />
                </ListItem>
              ))}
            </List>
          </div>

          <Divider />

          <div>
            <Typography variant="subtitle1" gutterBottom>
              Retour au candidat
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ajoutez un commentaire pour le candidat..."
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        {application.status === 'en_attente' && (
          <>
            <Button
              onClick={() => onStatusUpdate(application.id, 'refusé')}
              color="error"
            >
              Refuser
            </Button>
            <Button
              onClick={() => onStatusUpdate(application.id, 'accepté')}
              color="success"
            >
              Accepter
            </Button>
          </>
        )}
        <Button
          onClick={handleSaveFeedback}
          variant="contained"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark"
        >
          Enregistrer le retour
        </Button>
      </DialogActions>
    </Dialog>
  );
}