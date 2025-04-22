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
  ListItemButton,
  Link,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

import { api } from '../lib/api';
import { InsertDriveFile } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  application: any;
  onStatusUpdate: (applicationId: string, status: string) => void;
  reloadApplication : (applicationId:string) => Promise<void>
}

export default function ApplicationDetails({
  open,
  onClose,
  application,
  onStatusUpdate,
  reloadApplication,
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
      await reloadApplication(application.id)
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentUrl: string) => {
    try {
      const fileUrl = api.applications.files.getFullUrl(application.id,documentUrl);
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography variant="h6">Détails de la candidature</Typography>
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
                  primary={`${application.users?.first_name} ${application.users?.last_name}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary={application.users?.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary={application.users?.phone_number} />
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
              {application.documents.map((doc:any, index:any) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon>
                      <InsertDriveFile color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link href={api.applications.files.getFullUrl(application.id,doc)} target="_blank" rel="noopener noreferrer" underline="hover">
                          {doc.split("/").pop()}
                        </Link>
                      }
                    />
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