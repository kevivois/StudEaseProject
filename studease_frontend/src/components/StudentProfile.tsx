import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import { User } from '../types/database';
import { api } from '../lib/api';

interface Props {
  onUpdate: (data: Partial<User>) => Promise<void>;
  profile: any;
}

export default function ProfileSection({ onUpdate, profile }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>({});
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleSave = async () => {
    try {
      await onUpdate(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setEditedProfile((prev: any) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditedProfile((prev: any) => ({
      ...prev,
      skills: prev.skills?.filter((skill: any) => skill !== skillToRemove),
    }));
  };

  if (profile == null) {
    return <div></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar
                className="h-16 w-16 text-2xl bg-primary"
                alt={`${profile.first_name} ${profile.last_name}`}
              >
                {profile.first_name[0]}
              </Avatar>
              <div>
                <Typography variant="h5">
                  {profile.first_name} {profile.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Étudiant
                </Typography>
              </div>
            </div>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(!isEditing)}
              className="border-primary text-primary hover:bg-primary/10"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <Typography variant="h6" gutterBottom className="font-medium">
                  Informations personnelles
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Prénom"
                    value={editedProfile.first_name}
                    onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, first_name: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Nom"
                    value={editedProfile.last_name}
                    onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, last_name: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, email: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Téléphone"
                    value={editedProfile.phone_number}
                    onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, phone_number: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Date de naissance"
                    type="date"
                    value={editedProfile.birthdate}
                    onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, birthdate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <Typography variant="h6" gutterBottom className="font-medium">
                  Formation
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Domaine d'étude"
                    value={editedProfile.study_field}
                    onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, study_field: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Établissement ou école"
                    value={editedProfile.school_name}
                    onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, school_name: e.target.value }))}
                    fullWidth
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <Typography variant="h6" gutterBottom className="font-medium">
                  Compétences
                </Typography>
                <div className="flex gap-2 mb-2">
                  <TextField
                    size="small"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Ajouter une compétence"
                    fullWidth
                  />
                  <Button 
                    onClick={handleAddSkill}
                    variant="contained"
                    className="bg-primary hover:bg-primary-dark whitespace-nowrap"
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editedProfile.skills?.map((skill: any) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      className="bg-primary/10 text-primary"
                    />
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <Typography variant="h6" gutterBottom className="font-medium">
                  Disponibilité
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Disponible à partir du"
                    type="date"
                    value={editedProfile.availability_start}
                    onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, availability_start: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    label="Disponible jusqu'au"
                    type="date"
                    value={editedProfile.availability_end}
                    onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, availability_end: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </div>
              </div>

              {/* About */}
              <div>
                <Typography variant="h6" gutterBottom className="font-medium">
                  À propos
                </Typography>
                <TextField
                  label="Description du profil"
                  multiline
                  rows={4}
                  fullWidth
                  value={editedProfile.profile_description}
                  onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, profile_description: e.target.value }))}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="contained"
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* View mode */}
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText primary={profile.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText primary={profile.phone_number} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date de naissance"
                    secondary={new Date(profile.birthdate).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Formation"
                    secondary={`${profile.study_field} - ${profile.school_name}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Disponibilité"
                    secondary={`Du ${profile.availability_start? new Date(profile.availability_start).toLocaleDateString() : 'Non défini'} au ${
                      profile.availability_end ? new Date(profile.availability_end).toLocaleDateString() : 'Non défini'
                    }`}
                  />
                </ListItem>
              </List>

              <Divider />

              <div>
                <Typography variant="h6" gutterBottom className="font-medium">
                  Compétences
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map((skill: any) => (
                    <Chip
                      key={skill}
                      label={skill}
                      className="bg-primary/10 text-primary"
                    />
                  ))}
                </div>
              </div>

              {profile.profile_description && (
                <>
                  <Divider />
                  <div>
                    <Typography variant="h6" gutterBottom className="font-medium">
                      À propos
                    </Typography>
                    <Typography variant="body1" className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {profile.profile_description}
                    </Typography>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}