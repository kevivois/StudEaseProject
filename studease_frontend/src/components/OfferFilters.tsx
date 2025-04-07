import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { JobType, Location, ContractType, Industry } from '../types/database';

interface FiltersProps {
  jobTypes: JobType[];
  locations: Location[];
  contractTypes: ContractType[];
  industries: Industry[];
  filters: {
    jobTypeId: string;
    locationId: string;
    contractTypeId: string;
    industryIds: string[];
    searchTerm: string;
    isFlexible: boolean;
    activityRateMin: string;
    activityRateMax: string;
  };
  onFilterChange: (name: string, value: any) => void;
}

export default function OfferFilters({
  jobTypes,
  locations,
  contractTypes,
  industries,
  filters,
  onFilterChange,
}: FiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <TextField
        fullWidth
        label="Rechercher"
        variant="outlined"
        value={filters.searchTerm}
        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        placeholder="Titre, compétences, mots-clés..."
      />

      <FormControl fullWidth>
        <InputLabel>Type de travail</InputLabel>
        <Select
          value={filters.jobTypeId}
          onChange={(e) => onFilterChange('jobTypeId', e.target.value)}
          label="Type de travail"
        >
          <MenuItem value="">Tous</MenuItem>
          {jobTypes.map((type) => (
            <MenuItem key={type.job_type_id} value={type.job_type_id}>
              {type.job_type_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Lieu</InputLabel>
        <Select
          value={filters.locationId}
          onChange={(e) => onFilterChange('locationId', e.target.value)}
          label="Lieu"
        >
          <MenuItem value="">Tous</MenuItem>
          {locations.map((location) => (
            <MenuItem key={location.location_id} value={location.location_id}>
              {`${location.city}, ${location.region}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Type de contrat</InputLabel>
        <Select
          value={filters.contractTypeId}
          onChange={(e) => onFilterChange('contractTypeId', e.target.value)}
          label="Type de contrat"
        >
          <MenuItem value="">Tous</MenuItem>
          {contractTypes.map((type) => (
            <MenuItem key={type.contract_type_id} value={type.contract_type_id}>
              {type.contract_type_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Secteurs d'activité</InputLabel>
        <Select
          multiple
          value={filters.industryIds}
          onChange={(e) => onFilterChange('industryIds', e.target.value)}
          input={<OutlinedInput label="Secteurs d'activité" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const industry = industries.find((i) => i.industry_id === value);
                return (
                  <Chip
                    key={value}
                    label={industry?.industry_name}
                    className="bg-primary/10 text-primary"
                  />
                );
              })}
            </Box>
          )}
        >
          {industries.map((industry) => (
            <MenuItem key={industry.industry_id} value={industry.industry_id}>
              {industry.industry_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="flex gap-4">
        <TextField
          label="Taux d'activité min"
          type="number"
          value={filters.activityRateMin}
          onChange={(e) => onFilterChange('activityRateMin', e.target.value)}
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />
        <TextField
          label="Taux d'activité max"
          type="number"
          value={filters.activityRateMax}
          onChange={(e) => onFilterChange('activityRateMax', e.target.value)}
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />
      </div>

      <FormControlLabel
        control={
          <Checkbox
            checked={filters.isFlexible}
            onChange={(e) => onFilterChange('isFlexible', e.target.checked)}
          />
        }
        label="Horaires flexibles"
      />
    </div>
  );
}