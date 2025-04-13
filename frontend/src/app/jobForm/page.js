"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

export default function JobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";
  const jobId = searchParams.get("id");

  const [jobDetails, setJobDetails] = useState({
    title: "",
    companyName: "Acme Corp", // Default company name
    location: "",
    description: "",
    type: "",
    published: "",
    activityRate: "",
    companyDescription: "",
    jobDescription: "",
    profileDescription: "",
    benefits: "",
    startDate: "",
    endDate: "",
    workDays: "",
    workHours: "",
    language: "",
    contactPerson: "",
    applicationDeadline: "",
  });

  useEffect(() => {
    if (isEditing && jobId) {
      // Fetch job details based on jobId (mocked for now)
      const mockJobOffers = [
        { id: 1, title: "Software Engineer", companyName: "Acme Corp", location: "New York, NY", description: "Develop and maintain web applications.", type: "Full-Time", published: "2023-09-15" },
        { id: 2, title: "Product Manager", companyName: "Acme Corp", location: "San Francisco, CA", description: "Oversee product development lifecycle.", type: "Full-Time", published: "2023-09-20" },
        { id: 3, title: "Data Scientist", companyName: "Acme Corp", location: "Austin, TX", description: "Analyze data and build predictive models.", type: "Part-Time", published: "2023-09-25" },
      ];
      const job = mockJobOffers.find((job) => job.id === parseInt(jobId));
      if (job) {
        setJobDetails({
          ...jobDetails,
          ...job,
        });
      }
    }
  }, [isEditing, jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      console.log("Updated Job Details:", jobDetails);
    } else {
      console.log("New Job Details:", jobDetails);

      // Retrieve existing job offers from localStorage
      const existingJobOffers = JSON.parse(localStorage.getItem("jobOffers")) || [];
      
      // Add the new job offer to the array
      const updatedJobOffers = [...existingJobOffers, jobDetails];
      
      // Save the updated array back to localStorage
      localStorage.setItem("jobOffers", JSON.stringify(updatedJobOffers));
    }
    router.push("/companyDashboard");
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-[#7fba3c]/10 to-[#008080]/10 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isEditing ? "Edit Job Offer" : "Post a New Job Offer"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            {/* Job Title */}
            <TextField
              fullWidth
              label="Job Title"
              name="title"
              value={jobDetails.title || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Company Name */}
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={jobDetails.companyName || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Job Type */}
            <TextField
              fullWidth
              select
              label="Job Type"
              name="type"
              value={jobDetails.type || ""}
              onChange={handleChange}
              required
            >
              <MenuItem value="Full-Time">Full-Time</MenuItem>
              <MenuItem value="Part-Time">Part-Time</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
            </TextField>
            <div className="h-4"></div>

            {/* Activity Rate */}
            <TextField
              fullWidth
              label="Activity Rate (%)"
              name="activityRate"
              type="number"
              value={jobDetails.activityRate || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Work Location */}
            <TextField
              fullWidth
              label="Work Location (City and Canton)"
              name="location"
              value={jobDetails.location || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Company Description */}
            <TextField
              fullWidth
              label="Company Description"
              name="companyDescription"
              multiline
              rows={3}
              value={jobDetails.companyDescription || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Job Description */}
            <TextField
              fullWidth
              label="Job Description and Missions"
              name="jobDescription"
              multiline
              rows={4}
              value={jobDetails.jobDescription || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Profile Description */}
            <TextField
              fullWidth
              label="Profile Description and Required Skills"
              name="profileDescription"
              multiline
              rows={4}
              value={jobDetails.profileDescription || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Benefits */}
            <TextField
              fullWidth
              label="Benefits"
              name="benefits"
              multiline
              rows={3}
              value={jobDetails.benefits || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Start Date */}
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={jobDetails.startDate || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* End Date */}
            <TextField
              fullWidth
              label="End Date (Optional)"
              name="endDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={jobDetails.endDate || ""}
              onChange={handleChange}
            />
            <div className="h-4"></div>

            {/* Work Days */}
            <TextField
              fullWidth
              select
              label="Work Days"
              name="workDays"
              value={jobDetails.workDays || ""}
              onChange={handleChange}
              required
            >
              <MenuItem value="Fixed">Fixed</MenuItem>
              <MenuItem value="Flexible">Flexible</MenuItem>
            </TextField>
            <div className="h-4"></div>

            {/* Work Hours */}
            <TextField
              fullWidth
              select
              label="Work Hours"
              name="workHours"
              value={jobDetails.workHours || ""}
              onChange={handleChange}
              required
            >
              <MenuItem value="Fixed">Fixed</MenuItem>
              <MenuItem value="Flexible">Flexible</MenuItem>
            </TextField>
            <div className="h-4"></div>

            {/* Language */}
            <TextField
              fullWidth
              label="Language"
              name="language"
              value={jobDetails.language || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Contact Person */}
            <TextField
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={jobDetails.contactPerson || ""}
              onChange={handleChange}
              required
            />
            <div className="h-4"></div>

            {/* Application Deadline */}
            <TextField
              fullWidth
              label="Application Deadline"
              name="applicationDeadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={jobDetails.applicationDeadline || ""}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-[#7fba3c] text-white px-6 py-2 rounded-md hover:bg-[#6aa32f]"
              >
                {isEditing ? "Save Changes" : "Post Job"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
