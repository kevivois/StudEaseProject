"use client"

import React, { useState } from "react";
import Header from "../components";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { FormHelperText } from "@mui/material";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "John Doe",
    gender: "Male",
    dob: "2005-09-04",
    email: "johndoe@example.com",
    phoneNumber: "+44 349248535",
    bio: "Software engineer passionate about web development.",
    country: "United Kingdom",
    city: "London",
    region: "England",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [locationInput, setLocationInput] = useState(
    user.country + ", " + user.region + ", " + user.city
  );
  const [locationError, setLocationError] = useState("");

  // Handle changes for user fields (including location)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "location") {
      setLocationInput(value);
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  // Function to handle location validation and update user object
  const handleLocationChange = () => {
    const [country, region, city] = locationInput.split(",").map((part) => part.trim());

    if (country && region && city) {
      setUser({ ...user, country, region, city });
      setLocationError(""); // Clear error if valid
      return true;
    } else {
      setLocationError("Please enter location in the format: Country, Region, City");
      return false;
    }
  };

  const handleSave = () => {
    if (handleLocationChange()) {
      setIsEditing(false); // Switch to read mode after saving
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Switch to edit mode
  };

  return (
    <div className="bg-gradient-to-br from-[#7fba3c]/10 to-[#008080]/10">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Typography variant="h4" className="text-left mb-6">
          {isEditing ? "Edit Profile" : "Profile"}
        </Typography>

        <br />

        <div className="flex items-center space-x-6 mb-6">
          <Avatar sx={{ width: 90, height: 90 }}>U</Avatar>
          {isEditing && <Button variant="outlined">Change Photo</Button>}
        </div>

        <Divider className="mb-6" />
        <br />

        {isEditing ? (
          // Editing Mode (TextFields)
          <div className="flex flex-col gap-5">
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="mb-6"
            />
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="mb-6"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={user.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              className="mb-6"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="mb-6"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              className="mb-6"
            />
            <TextField
              fullWidth
              label="Location (Country, Region, City)"
              name="location"
              value={locationInput}
              onChange={handleChange}
              className="mb-6"
              error={!!locationError}
            />
            {locationError && (
              <FormHelperText error>{locationError}</FormHelperText>
            )}
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={user.bio}
              onChange={handleChange}
              multiline
              rows={4}
              className="mb-6"
            />
          </div>
        ) : (
          // Reading Mode (Static Text)
          <div className="space-y-6">
            <Box>
              <strong>Name:</strong>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
            <Box>
              <strong>Gender:</strong>
              <Typography variant="body1">{user.gender}</Typography>
            </Box>
            <Box>
              <strong>Date of Birth:</strong>
              <Typography variant="body1">{user.dob}</Typography>
            </Box>
            <Box>
              <strong>Email:</strong>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box>
              <strong>Phone Number:</strong>
              <Typography variant="body1">{user.phoneNumber}</Typography>
            </Box>
            <Box>
              <strong>Location:</strong>
              <Typography variant="body1">
                {user.country}, {user.region}, {user.city}
              </Typography>
            </Box>
            <Box>
              <strong>Bio:</strong>
              <Typography variant="body1">{user.bio}</Typography>
            </Box>
          </div>
        )}

        <br />

        {isEditing ? (
          <Button variant="contained" className="mt-6 bg-[#7fba3c] hover:bg-[#6aa32f]" onClick={handleSave}>
            Save Changes
          </Button>
        ) : (
          <Button variant="outlined" className="mt-6 bg-[#7fba3c] text-white hover:bg-[#6aa32f]" onClick={handleEdit}>
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}
