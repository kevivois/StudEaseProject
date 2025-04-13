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

export default function CompanyProfile() {
  const [company, setCompany] = useState({
    companyName: "Acme Corp",
    industry: "Technology",
    founded: "2001", // YYYY format
    email: "contact@acmecorp.com",
    phoneNumber: "+1 (555) 123-4567",
    description: "Innovative solutions for a digital world.",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-[#7fba3c]/10 to-[#008080]/10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Typography variant="h4" className="text-left mb-6">
            {isEditing ? "Edit Company Profile" : "Company Profile"}
          </Typography>

          <br />

          <div className="flex items-center space-x-6 mb-6">
            <Avatar sx={{ width: 90, height: 90 }}>C</Avatar>
            {isEditing && (
              <Button variant="outlined">Change Logo</Button>
            )}
          </div>

          <Divider className="mb-6" />
          <br />

          {isEditing ? (
            <div className="flex flex-col gap-5">
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
                className="mb-6"
              />
              <TextField
                fullWidth
                select
                label="Industry"
                name="industry"
                value={company.industry}
                onChange={handleChange}
                className="mb-6"
              >
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Year Founded"
                name="founded"
                type="number"
                value={company.founded}
                onChange={handleChange}
                className="mb-6"
              />
              <TextField
                fullWidth
                label="Company Email"
                name="email"
                value={company.email}
                onChange={handleChange}
                className="mb-6"
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={company.phoneNumber}
                onChange={handleChange}
                className="mb-6"
              />
              <TextField
                fullWidth
                label="Company Description"
                name="description"
                value={company.description}
                onChange={handleChange}
                multiline
                rows={4}
                className="mb-6"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <Box>
                <strong>Company Name:</strong>
                <Typography variant="body1">{company.companyName}</Typography>
              </Box>
              <Box>
                <strong>Industry:</strong>
                <Typography variant="body1">{company.industry}</Typography>
              </Box>
              <Box>
                <strong>Year Founded:</strong>
                <Typography variant="body1">{company.founded}</Typography>
              </Box>
              <Box>
                <strong>Company Email:</strong>
                <Typography variant="body1">{company.email}</Typography>
              </Box>
              <Box>
                <strong>Phone Number:</strong>
                <Typography variant="body1">{company.phoneNumber}</Typography>
              </Box>
              <Box>
                <strong>Company Description:</strong>
                <Typography variant="body1">{company.description}</Typography>
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
    </>
  );
}
