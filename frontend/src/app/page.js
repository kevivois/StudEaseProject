'use client'

import React from "react";
import { useRouter } from 'next/navigation';  // Import useRouter
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Header from "@/app/components"; // Import Header component

const settings = ['Profile', 'Login', 'Logout'];

export default function Home() {
  const router = useRouter();  // Initialize useRouter
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLoginClick = () => {
    // Add your login functionality here
    router.push("/login")
  };

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        background: 'bg-gradient-to-br from-[#7fba3c]/10 to-[#008080]/10' // Adjust gradient colors to match the image
      }}
    >
      <Header /> {/* Replace the header element with the Header component */}
      <img 
        src="welcome.png" 
        alt="Welcome" 
        className="w-full object-contain" // Use object-contain to prevent cropping
        style={{ height: 'calc(100vh - 64px)' }} // Adjust height to fit under the header
      />
    </div>
  );
}
