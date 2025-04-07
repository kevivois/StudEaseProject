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
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Offer } from '../types/database';

interface Props {
  open: boolean;
  onClose: () => void;
  offer: Offer | null;
  onSubmit: (data: { message: string; documents: File[] }) => Promise<void>;
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
      <DialogTitle>
        Postuler pour : {offer.title}
      </DialogTitle>
      <DialogContent>
        <div className="space-y-6 py-4">
          <div>
            <Typography variant="subtitle1" className="font-semibold mb-2">
              Documents requis :
            </Typography>
            <List>
              {offer.required_documents.map((doc, index) => (
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
              Message de candidature
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
                className="w-full"
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
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !message || documents.length === 0}
          className="bg-primary hover:bg-primary-dark"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}