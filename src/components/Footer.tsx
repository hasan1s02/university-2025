import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: '#1976d2', color: 'white', py: 4, mt: 8 }}>
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Yasal</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button color="inherit" href="/privacy" sx={{ color: 'white', textAlign: 'left', px: 0 }}>Gizlilik Politikası</Button>
          <Button color="inherit" href="/cookies" sx={{ color: 'white', textAlign: 'left', px: 0 }}>Çerez Politikası</Button>
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>İletişim</Typography>
        <Typography variant="body2">hasancanselmo07@gmail.com</Typography>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Hakkımızda</Typography>
        <Typography variant="body2" sx={{ maxWidth: 260 }}>
          Üniversite Tercih Asistanı, aday öğrencilere en doğru bölümü bulmaları için rehberlik eden bir platformdur.
        </Typography>
      </Box>
    </Container>
    <Container maxWidth="lg" sx={{ mt: 3, textAlign: 'center' }}>
      <Typography variant="caption" color="inherit">
        © {new Date().getFullYear()} Üniversite Tercih Asistanı. Tüm hakları saklıdır.
      </Typography>
    </Container>
  </Box>
);

export default Footer; 