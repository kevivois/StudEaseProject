'use client'

import React from "react";
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const settings = ['Profile', 'Login', 'Logout'];

export default function Header() {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (setting) => {
    handleCloseUserMenu();

    switch (setting) {
      case "Profile":
        router.push("/userProfile");
        break;
      case "Login":
        router.push("/login");
        break;
      case "Logout":
        // Add logout logic here, e.g., clearing user session
        console.log("User logged out");
        router.push("/");
        break;
      default:
        break;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="ml-2 text-2xl font-bold text-blue-600">StudEase</span>
          </div>
          <div className="flex items-center space-x-4">
            <IconButton
              className="bg-gray-200 p-3 rounded-full hover:bg-gray-400 transition duration-300"
              style={{ width: '48px', height: '48px' }}
            >
              <NotificationsIcon className="text-black" />
            </IconButton>
            <IconButton
              className="bg-gray-200 p-3 rounded-full hover:bg-gray-400 transition duration-300"
              onClick={handleOpenUserMenu}
              sx={{ p: 0 }}
              style={{ width: '48px', height: '48px' }}
            >
              <PersonIcon className="text-black" />
            </IconButton>
            <Menu
              sx={{ mt: '30px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}
