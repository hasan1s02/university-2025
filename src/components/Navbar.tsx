import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import CalculateIcon from '@mui/icons-material/Calculate';
import QuizIcon from '@mui/icons-material/Quiz';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { label: 'Ana Sayfa', to: '/' },
    { label: 'Tercih Aracı', to: '/search' },
    { label: 'Puan Hesapla', to: '/calculator', icon: <CalculateIcon /> },
    { label: 'Quiz', to: '/quiz', icon: <QuizIcon /> },
    { label: 'Haberler', to: '/haber' },
    { label: 'Blog', to: '/blog' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Button component={RouterLink} to="/" sx={{ p: 0, minWidth: 0, mr: 2 }}>
          <img src="/images/ykstercih.webp" alt="Site Logo" style={{ height: 40, width: 40, objectFit: 'contain', borderRadius: 8 }} />
        </Button>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          Üniversite Tercih Asistanı
        </Typography>
        {isMobile ? (
          <>
            <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 220 }} role="presentation" onClick={() => setDrawerOpen(false)}>
                <List>
                  {menuItems.map((item) => (
                    <ListItem key={item.to} disablePadding>
                      <ListItemButton component={RouterLink} to={item.to}>
                        {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.to}
                color="inherit"
                component={RouterLink}
                to={item.to}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;