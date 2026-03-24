import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => (
  <>
    <Helmet>
      <title>Sayfa Bulunamadı | 404 Hatası</title>
      <meta name="description" content="Aradığınız sayfa bulunamadı. Lütfen ana sayfaya dönün veya menüyü kullanarak devam edin." />
    </Helmet>
    <Container maxWidth="md" sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <img src="/images/ykstercih.webp" alt="404 Logo" style={{ width: 90, height: 90, marginBottom: 24, borderRadius: 16, background: '#fff' }} />
        <Typography variant="h1" sx={{ fontWeight: 800, color: 'primary.main', fontSize: { xs: 60, md: 96 } }}>404</Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Sayfa Bulunamadı</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Üzgünüz, aradığınız sayfa mevcut değil veya adresi yanlış girdiniz.<br />
          Ana sayfaya dönebilir veya menüyü kullanarak devam edebilirsiniz.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" color="primary" size="large" sx={{ borderRadius: 3, fontWeight: 700 }}>
          Ana Sayfaya Dön
        </Button>
      </Box>
    </Container>
  </>
);

export default NotFound; 