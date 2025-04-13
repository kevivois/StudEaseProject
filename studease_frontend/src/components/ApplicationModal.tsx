import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Props {
  open: boolean;
  onClose: () => void;
  offer: any | null;
  onSubmit: (data: { message: string; documents: File[]; startDate?: string }) => Promise<void>;
}

export default function ApplicationModal({ open, onClose, offer, onSubmit }: Props) {
  const [message, setMessage] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setDocuments(Array.from(event.target.files));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit({ message, documents });
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!offer) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <div>
          <Typography variant="h6">Postuler pour : {offer.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {offer.company?.company_name}
          </Typography>
        </div>
      </DialogTitle>

      <DialogContent dividers className="space-y-6">
        <div>
          <Typography variant="subtitle1" className="font-semibold mb-2">
            Documents requis :
          </Typography>
          <List>
            {offer.required_documents.map((doc:any, index:any) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {documents.length > index ? (
                    <CheckCircleIcon className="text-green-500" />
                  ) : (
                    <UploadFileIcon className="text-gray-400" />
                  )}
                </ListItemIcon>
                <ListItemText primary={doc} />
              </ListItem>
            ))}
          </List>
        </div>

        <div>
          <Typography variant="subtitle1" className="font-semibold mb-2">
            Message de motivation
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Présentez-vous et expliquez votre motivation pour ce poste..."
          />
        </div>

        <div>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="document-upload"
            accept=".pdf,.doc,.docx"
          />
          <label htmlFor="document-upload">
            <Button
              component="span"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              fullWidth
            >
              Télécharger les documents
            </Button>
          </label>
          {documents.length > 0 && (
            <List>
              {documents.map((file, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon className="text-green-500" />
                  </ListItemIcon>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </DialogContent>

      <DialogActions className="p-4">
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !message}
          className="bg-primary hover:bg-primary-dark"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}