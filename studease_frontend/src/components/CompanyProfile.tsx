import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Company } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
interface Props {
  onUpdate: (data: any) => Promise<void>;
}

export default function CompanyProfileSection({onUpdate}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>();
  let {user:profile} = useAuth()

  useEffect(() => {
    setEditedProfile(profile)
  },[])

  const handleSave = async () => {
    try {
      await onUpdate(editedProfile);
      setEditedProfile(useAuth().user)
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-visible">
        <CardContent className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar
                src={profile.company_logo_url || undefined}
                className="h-20 w-20 bg-primary text-3xl"
                alt={profile.company_name}
              >
                {profile.company_name[0]}
              </Avatar>
              <div>
                <Typography variant="h4" className="font-bold">
                  {profile.company_name}
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

          <Divider />

          {isEditing ? (
            <div className="space-y-4">
              <TextField
                fullWidth
                label="Nom de l'entreprise"
                value={editedProfile.company_name}
                onChange={(e) => setEditedProfile((prev:any) => ({ ...prev, company_name: e.target.value }))}
              />
              
              <TextField
                fullWidth
                label="Adresse"
                value={editedProfile.company_address}
                onChange={(e) => setEditedProfile((prev:any) => ({ ...prev, company_address: e.target.value }))}
              />

              <TextField
                fullWidth
                label="Téléphone"
                value={editedProfile.company_phone}
                onChange={(e) => setEditedProfile((prev:any) => ({ ...prev, company_phone: e.target.value }))}
              />

              <TextField
                fullWidth
                label="Site web"
                value={editedProfile.company_website}
                onChange={(e) => setEditedProfile((prev:any) => ({ ...prev, company_website: e.target.value }))}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description de l'entreprise"
                value={editedProfile.company_description}
                onChange={(e) => setEditedProfile((prev:any) => ({ ...prev, company_description: e.target.value }))}
              />

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
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon className="text-gray-400" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Adresse"
                    secondary={profile.company_address}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <EmailIcon className="text-gray-400" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={profile.email}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon className="text-gray-400" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Téléphone"
                    secondary={profile.company_phone}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon className="text-gray-400" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Site web"
                    secondary={
                      <a
                        href={profile.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {profile.company_website}
                      </a>
                    }
                  />
                </ListItem>
              </List>
            

              {profile.company_description && (
                <div>
                  <Typography variant="h6" gutterBottom className="font-semibold">
                    À propos de nous
                  </Typography>
                  <Typography variant="body1" className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {profile.company_description}
                  </Typography>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}