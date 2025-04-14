import React from 'react';
import { Card, CardContent, Typography, Chip, Button, IconButton, Tooltip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';

interface Props {
  offer: any;
  onApply: (offer: any) => void;
  onSave: (offerId: string) => void;
  isSaved: boolean;
}


export default function OfferCard({ offer, onApply, onSave, isSaved }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <Typography variant="h6" className="font-semibold">
              {offer.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {offer.company?.company_name}
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
              {offer.work_location_type === 'remote' 
                ? 'Télétravail'
                : offer.work_location_type === 'hybrid'
                ? 'Hybride'
                : `${offer.locations?.region}`}
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
              {offer.job_level}
            </Typography>
          </div>
        </div>

        {offer.industries && offer.industries.length > 0 && (
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Secteurs d'activité
            </Typography>
            <div className="flex flex-wrap gap-2">
              {offer.industries.map((industry:any) => (
                <Chip
                  key={industry.industry_id}
                  label={industry.industry_name}
                  size="small"
                  className="bg-blue-100 text-blue-800"
                />
              ))}
            </div>
          </div>
        )}

        {offer.required_skills && offer.required_skills.length > 0 && (
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Compétences requises
            </Typography>
            <div className="flex flex-wrap gap-2">
              {offer.required_skills.map((skill:any, index:any) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  className="bg-primary/10 text-primary"
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <Typography variant="subtitle2" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2" color="text.secondary" className="line-clamp-3">
            {offer.profile_description}
          </Typography>
          {offer.profile_description.length > 200 && (
            <Button
              size="small"
              className="text-primary mt-1"
              onClick={() => onApply(offer)}
            >
              Voir plus
            </Button>
          )}
        </div>

        {(offer.start || offer.end) && (
          <div className="flex gap-4">
            {offer.start && (
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarTodayIcon fontSize="small" />
                <Tooltip title="Date de début">
                  <Typography variant="body2">
                    Début: {new Date(offer.start).toLocaleDateString()}
                  </Typography>
                </Tooltip>
              </div>
            )}
            {offer.end && (
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarTodayIcon fontSize="small" />
                <Tooltip title="Date de fin">
                  <Typography variant="body2">
                    Fin: {new Date(offer.end).toLocaleDateString()}
                  </Typography>
                </Tooltip>
              </div>
            )}
          </div>
        )}

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
  );
}