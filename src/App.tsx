import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ModelosComponent from './component/ModelosComponent';
import Sidebar from '../src/component/sidebar';
import Login from '../src/component/login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Aquí puedes verificar si el usuario está autenticado
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={
          isAuthenticated ? (
            <Box sx={{ display: 'flex' }}>
              <Sidebar setIsSidebarExpanded={setIsSidebarExpanded} setIsAuthenticated={setIsAuthenticated} />
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container sx={{ marginLeft: isSidebarExpanded ? '260px' : '70px', transition: 'margin-left 0.3s' }}>
                  <h1>PosPago</h1>
                  <ModelosComponent />
                </Container>
              </ThemeProvider>
            </Box>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
