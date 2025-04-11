import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Button,
  TableContainer,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Offer } from '../types/database';

interface Props {
  jobPostings: Offer[];
  onEdit: (posting: Offer) => void;
  onDelete: (postingId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'default';
    case 'closed':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'draft':
      return 'Brouillon';
    case 'closed':
      return 'Fermée';
    default:
      return status;
  }
};

export default function JobPostingsList({ jobPostings, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h5" component="h2" className="font-bold">
          Offres publiées
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className="bg-primary hover:bg-primary-dark"
          href="/employer/offers/new"
        >
          Nouvelle offre
        </Button>
      </div>

      <TableContainer component={Paper} className="shadow-sm">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Publication</TableCell>
              <TableCell>Candidatures</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(jobPostings) && jobPostings.map((posting) => (
              <TableRow key={posting.offer_id} className="hover:bg-gray-50">
                <TableCell>
                  <Typography variant="body1" className="font-medium">
                    {posting.title}
                  </Typography>
                </TableCell>
                <TableCell>{posting.work_location_type}</TableCell>
                <TableCell>
                  {`${posting.activity_rate_min}% - ${posting.activity_rate_max}%`}
                </TableCell>
                <TableCell>
                  {new Date(posting.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {/* This should be fetched from the API */}
                  <Button
                    variant="text"
                    href={`/employer/offers/${posting.offer_id}/applications`}
                  >
                    Voir les candidatures
                  </Button>
                </TableCell>
                {/*
                <TableCell>
                  <Chip
                    label={getStatusLabel(posting.status || 'active')}
                    color={getStatusColor(posting.status || 'active')}
                    size="small"
                  />
                 
                </TableCell>*/}
                <TableCell align="right">
                  <IconButton
                    onClick={() => onEdit(posting)}
                    className="text-primary hover:text-primary-dark"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(posting.offer_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}