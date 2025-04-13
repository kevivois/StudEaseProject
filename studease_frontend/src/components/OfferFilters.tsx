import React,{useState,useEffect} from 'react';
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
  InputAdornment,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { JobType, Location, ContractType, Industry } from '../types/database';
import {api} from "../lib/api"
interface FiltersProps {
  onFilterChange: (name: string, value: any) => void;
  onSearch?: () => void;
  filters: {
    jobTypeId: string | string[];
    locationId: string | string[];
    contractTypeId: string | string[];
    industryIds: string[];
    searchTerm: string;
    isFlexible: boolean;
    activityRateMin: string;
    activityRateMax: string;
    workingHoursSearch: string;
  };
}

type MetadataType = {
  jobTypes: any[];
  locations: any[];
  contractTypes: any[];
  industries: Industry[];
  remunerationTypes: any[];
  durations: any[];
};

export default function OfferFilters({
  filters,
  onFilterChange,
  onSearch,
}: FiltersProps) {
 const [metadata, setMetadata] = useState<MetadataType>({
      jobTypes: [],
      locations: [],
      contractTypes: [],
      industries: [],
      remunerationTypes: [],
      durations: [],
    });
 const loadMetadata = async () => {
      try {
        const [
          jobTypesResponse,
          locationsResponse,
          contractTypesResponse,
          industriesResponse,
          remunerationTypesResponse,
          durationsResponse,
        ] = await Promise.all([
          api.offerMetadata.getAllJobTypes(),
          api.offerMetadata.getAllLocations(),
          api.offerMetadata.getAllContractTypes(),
          api.offerMetadata.getAllIndustries(),
          api.offerMetadata.getAllRemunerationTypes(),
          api.offerMetadata.getAllEngagementDurations(),
        ]);
    
        const metadata: MetadataType = {
          jobTypes: jobTypesResponse.data ?? [],
          locations: locationsResponse.data ?? [],
          contractTypes: contractTypesResponse.data ?? [],
          industries: industriesResponse.data ?? [],
          remunerationTypes: remunerationTypesResponse.data ?? [],
          durations: durationsResponse.data ?? [],
        };
        setMetadata(metadata);
      } catch (err: any) {
        console.error(err);
      }
    };

  useEffect(() => {
    loadMetadata()
  },[])
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <TextField
        fullWidth
        label="Rechercher"
        variant="outlined"
        value={filters.searchTerm}
        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        placeholder="Titre, compétences, mots-clés..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-400" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Horaires de travail"
        variant="outlined"
        value={filters.workingHoursSearch}
        onChange={(e) => onFilterChange('workingHoursSearch', e.target.value)}
        placeholder="Ex: Lundi, 8h, après-midi..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccessTimeIcon className="text-gray-400" />
            </InputAdornment>
          ),
        }}
        helperText="Recherchez par jour ou horaire spécifique"
      />

      <FormControl fullWidth>
        <InputLabel>Type de travail</InputLabel>
        <Select
          multiple
          value={Array.isArray(filters.jobTypeId) ? filters.jobTypeId : []}
          onChange={(e) => onFilterChange('jobTypeId', e.target.value)}
          input={<OutlinedInput label="Type de travail" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => {
                const jobType = metadata.jobTypes.find((jt) => jt.job_type_id === value);
                return (
                  <Chip
                    key={value}
                    label={jobType?.job_type_name}
                    className="bg-primary/10 text-primary"
                  />
                );
              })}
            </Box>
          )}
        >
          {Array.isArray(metadata.jobTypes) ? metadata.jobTypes.map((type) => (
            <MenuItem key={type.job_type_id} value={type.job_type_id}>
              {type.job_type_name}
            </MenuItem>
          )):null}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Lieu</InputLabel>
        <Select
          multiple
          value={Array.isArray(filters.locationId) ? filters.locationId : []}
          onChange={(e) => onFilterChange('locationId', e.target.value)}
          input={<OutlinedInput label="Lieu" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => {
                const location = metadata.locations.find((l:any) => l.location_id === value);
                return (
                  <Chip
                    key={value}
                    label={`${location?.city}, ${location?.region}`}
                    className="bg-primary/10 text-primary"
                  />
                );
              })}
            </Box>
          )}
        >
          {Array.isArray(metadata.locations) ? metadata.locations.map((location:any) => (
            <MenuItem key={location.location_id} value={location.location_id}>
              {`${location.city}, ${location.region}`}
            </MenuItem>
          )):null}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Type de contrat</InputLabel>
        <Select
          multiple
          value={Array.isArray(filters.contractTypeId) ? filters.contractTypeId : []}
          onChange={(e) => onFilterChange('contractTypeId', e.target.value)}
          input={<OutlinedInput label="Type de contrat" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => {
                const contractType = metadata.contractTypes.find((ct) => ct.contract_type_id === value);
                return (
                  <Chip
                    key={value}
                    label={contractType?.contract_type_name}
                    className="bg-primary/10 text-primary"
                  />
                );
              })}
            </Box>
          )}
        >
          {Array.isArray(metadata.contractTypes) ? metadata.contractTypes.map((type) => (
            <MenuItem key={type.contract_type_id} value={type.contract_type_id}>
              {type.contract_type_name}
            </MenuItem>
          )):null}
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
                const industry = metadata.industries.find((i) => i.industry_id === value);
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
          {Array.isArray(metadata.industries) ? metadata.industries.map((industry) => (
            <MenuItem key={industry.industry_id} value={industry.industry_id}>
              {industry.industry_name}
            </MenuItem>
          )):null}
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

      <Button
        variant="contained"
        fullWidth
        onClick={onSearch}
        className="bg-primary hover:bg-primary-dark mt-4"
        startIcon={<SearchIcon />}
      >
        Rechercher
      </Button>
    </div>
  );
}