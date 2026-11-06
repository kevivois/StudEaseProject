import React,{useState} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Button,
  TableContainer,
  Paper,
  Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import { Offer } from '../types/database';
import { useNavigate } from 'react-router-dom';
interface Props {
  jobPostings: any[];
  onEdit: (posting: Offer) => void;
  onDelete: (postingId: string) => void;
}


export default function JobPostingsList({ jobPostings, onEdit, onDelete }: Props) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="section-heading">
        <div>
          <Typography variant="h5" component="h2" className="font-bold">
            Offres postées
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mt-1">
            Gérez et surveillez vos annonces actives
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/employer/offers/new')}
          className="bg-primary hover:bg-primary-dark"
        >
          Nouvelle offre
        </Button>
      </div>

      {jobPostings.length === 0 ? (
        <Alert severity="info">Vous n'avez pas encore publié d'offre. Créez votre première annonce pour rencontrer les étudiants.</Alert>
      ) : (
      <TableContainer component={Paper} className="responsive-offer-table" tabIndex={0} role="region" aria-label="Liste des offres publiées">
        <Table aria-label="Offres publiées" role="table">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell scope="col">Titre</TableCell>
              <TableCell scope="col">Lieu</TableCell>
              <TableCell scope="col">Contrat</TableCell>
              <TableCell scope="col">Poste</TableCell>
              <TableCell scope="col">Date de création</TableCell>
              <TableCell scope="col">Candidatures</TableCell>
              <TableCell scope="col" align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobPostings.map((posting) => (
              
              <TableRow key={posting.offer_id} className="hover:bg-gray-50" role="row">
                <TableCell data-label="Titre" role="cell">
                  <div className="font-medium">{posting.title}</div>
                </TableCell>
                <TableCell data-label="Lieu" role="cell">
                  <div className="text-sm">{posting.locations.region} {posting.locations.country}</div>
                </TableCell>
                <TableCell data-label="Contrat" role="cell">
                  <div className="text-sm">{posting.contract_types.contract_type_name}</div>
                </TableCell>
                <TableCell data-label="Poste" role="cell">
                  <div className="text-sm">{posting.job_level}</div>
                </TableCell>
                <TableCell data-label="Créée le" role="cell">
                  <div className="text-sm">
                    {new Date(posting.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell data-label="Candidatures" role="cell">
                  <div className="flex items-center gap-2">
                    <div className={`text-sm inline-flex px-2 py-1 rounded-full ${
                      (Array.isArray(posting.applications) ? posting.applications.length : 0) >= posting.max_appliants 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {(Array.isArray(posting.applications) ? posting.applications.length : 0)}/{posting.max_appliants}
                    </div>
                  </div>
                </TableCell>
                <TableCell data-label="Actions" align="right" role="cell">
                  <div className="flex justify-end gap-2">
                    <IconButton
                      onClick={() => navigate(`/employer/offers/${posting.offer_id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      size="small"
                      title="Voir l'offre"
                      aria-label="Voir l'offre"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onEdit(posting)}
                      className="text-primary hover:text-primary-dark"
                      size="small"
                      title="Modifier"
                      aria-label="Modifier l'offre"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(posting.offer_id)}
                      className="text-red-600 hover:text-red-900"
                      size="small"
                      title="Supprimer"
                      aria-label="Supprimer l'offre"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </div>
  );
}