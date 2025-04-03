"use client";

import React, { useState } from "react";
import Header from "../components";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "John Doe",
    gender: "Male",
    dob: "2005-09-04", // Use YYYY-MM-DD format for input type="date"
    email: "johndoe@example.com",
    phoneNumber: "+44 349248535",
    bio: "Software engineer passionate about web development.",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated User:", user); // Replace with API call to save changes
    alert("Profile updated successfully!");
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Typography variant="h4" className="text-left mb-6">
          Edit Profile
        </Typography>

        <div className="flex items-center space-x-6 mb-6">
          <Avatar sx={{ width: 90, height: 90 }}>U</Avatar>
          <Button variant="outlined">Change Photo</Button>
        </div>

        <Divider className="mb-6" />

        <div className="space-y-6">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            select
            label="Gender"
            name="gender"
            value={user.gender}
            onChange={handleChange}
            margin="normal"
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
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Bio"
            name="bio"
            value={user.bio}
            onChange={handleChange}
            multiline
            rows={4}
            margin="normal"
          />
        </div>

        <Button variant="contained" className="mt-6" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </>
  );
}
