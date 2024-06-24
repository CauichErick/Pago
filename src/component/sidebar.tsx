// src/components/Sidebar.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Avatar, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface SidebarProps {
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setIsSidebarExpanded, setIsAuthenticated }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    setIsSidebarExpanded(!isExpanded);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <Box sx={{ width: isExpanded ? 260 : 70, bgcolor: '#fff', height: '100vh', position: 'fixed', overflow: 'hidden', boxShadow: 3, transition: 'width 0.3s', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'space-between' : 'center' }}>
        {isExpanded && (
          <>
            <Avatar src="/path-to-avatar.jpg" alt="Osmar Casillas" />
            <Box sx={{ ml: 2 }}>
              <div style={{ color: "#000" }}>Administrador</div>
              <div style={{ color: "#000" }}>{userEmail}</div>
            </Box>
          </>
        )}
        <IconButton onClick={toggleSidebar} sx={{ color: "#000" }}>
          {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        <ListItem button>
          <ListItemIcon style={{ color: "#000" }}><DashboardIcon /></ListItemIcon>
          {isExpanded && <ListItemText style={{ color: "#000" }} primary="Terminales" />}
        </ListItem>
        <ListItem button>
          <ListItemIcon style={{ color: "#000" }}><MessageIcon /></ListItemIcon>
          {isExpanded && <ListItemText style={{ color: "#000" }} primary="Clientes" />}
        </ListItem>
        <ListItem button>
          <ListItemIcon style={{ color: "#000" }}><WalletIcon /></ListItemIcon>
          {isExpanded && <ListItemText style={{ color: "#000" }} primary="Vendedores" />}
        </ListItem>
      </List>
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon style={{ color: "#000" }}><ExitToAppIcon /></ListItemIcon>
          {isExpanded && <ListItemText style={{ color: "#000" }} primary="Cerrar sesión" />}
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
