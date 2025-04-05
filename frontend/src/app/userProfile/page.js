"use client";

import React, { useState } from "react";
import Header from "../components";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "John Doe",
    gender: "Male",
    dob: "2005-09-04", // Use YYYY-MM-DD format for input type="date"
    email: "johndoe@example.com",
    phoneNumber: "+44 349248535",
    bio: "Software engineer passionate about web development.",
  });

  const [isEditing, setIsEditing] = useState(false); // Toggle between edit and read mode

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false); // Switch to reading mode
  };

  const handleEdit = () => {
    setIsEditing(true); // Switch to editing mode
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Typography variant="h4" className="text-left mb-6">
          {isEditing ? "Edit Profile" : "Profile"}
        </Typography>

        <br/>

        <div className="flex items-center space-x-6 mb-6">
          <Avatar sx={{ width: 90, height: 90 }}>U</Avatar>
          {isEditing && (
            <Button variant="outlined">Change Photo</Button>
          )}
        </div>

        <Divider className="mb-6" />
        <br></br>
        {isEditing ? (
          // Editing Mode (TextFields)
          <div className="flex flex-col gap-5">
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="mb-6" // Added margin bottom for spacing
            />
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="mb-6" // Added margin bottom for spacing
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
              className="mb-6" // Added margin bottom for spacing
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="mb-6" // Added margin bottom for spacing
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              className="mb-6" // Added margin bottom for spacing
            />
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={user.bio}
              onChange={handleChange}
              multiline
              rows={4}
              className="mb-6" // Added margin bottom for spacing
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
              <strong>Bio:</strong>
              <Typography variant="body1">{user.bio}</Typography>
            </Box>
          </div>
        )}

        <br></br>

        {isEditing ? (
          <Button variant="contained" className="mt-6" onClick={handleSave}>
            Save Changes
          </Button>
        ) : (
          <Button variant="outlined" className="mt-6" onClick={handleEdit}>
            Edit Profile
          </Button>
        )}
      </div>
    </>
  );
}
