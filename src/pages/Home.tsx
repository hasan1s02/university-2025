import React from 'react';
import { Container, Typography, Box, Button, Paper, Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CalculateIcon from '@mui/icons-material/Calculate';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import anapageImage from '../../images/anapage.webp';
import { Helmet } from 'react-helmet-async';
import { departments as departmentList } from '../data/departments';

const Home = () => {
  const navigate = useNavigate();

  // Slugify function for Turkish chars
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const [selectedDept, setSelectedDept] = React.useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>Üniversite Tercih Asistanı | Doğru Bölümü Bul, Geleceğini Şekillendir</title>
        <meta name="description" content="Üniversite tercihini kolaylaştıran akıllı araçlar, puan hesaplama, bölüm arama ve bilgilendirici içeriklerle geleceğini şekillendir!" />
      </Helmet>
      <Box sx={{ bgcolor: '#e8f4fd', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 3, md: 4 }, pt: { xs: 3, md: 5 }, pb: { xs: 2, md: 8 } }}>
          <h1 style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>YKS Tercih Robotu 2025</h1>
          <Box
            sx={{
              width: '100%',
              height: { xs: 300, md: 400 },
              borderRadius: 5,
              boxShadow: 3,
              backgroundImage: `url(${anapageImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* HERO İÇERİK */}
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', md: 700 },
                mx: 'auto',
                textAlign: 'center',
                zIndex: 1,
                color: 'white',
                p: { xs: 1, md: 3 },
                background: { xs: 'rgba(0,0,0,0.13)', md: 'rgba(0,0,0,0.12)' },
                borderRadius: 3,
              }}
            >
              <img src="/images/ykstercih.webp" alt="Site Logo" style={{ height: 70, width: 70, objectFit: 'contain', borderRadius: 12, marginBottom: 12, background: 'white' }} />
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  mb: 1,
                  letterSpacing: '.5px',
                  fontSize: { xs: 22, md: 36 },
                  lineHeight: 1.18,
                  textShadow: '0 2px 12px rgba(0,0,0,0.22)',
                }}
              >
                Üniversite Tercihini Kolaylaştır
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 400,
                  fontSize: { xs: 15, md: 21 },
                  textShadow: '0 1px 8px rgba(0,0,0,0.14)',
                }}
              >
                Doğru bölümü bul, geleceğini şekillendir!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<SearchIcon />}
                  onClick={() => navigate('/search')}
                  sx={{ fontWeight: 600 }}
                >
                  Tercih Aracını Başlat
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  startIcon={<CalculateIcon />}
                  onClick={() => navigate('/calculator')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.12)',
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.23)',
                      borderColor: 'white',
                    },
                  }}
                >
                  Puan Hesapla
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>

        {/* ÖZELLİKLER */}
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 3, md: 4 }, pb: 6, mt: { xs: 0, md: -5 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
              gap: { xs: 2, md: 4 },
              px: { xs: 1, md: 0 },
            }}
          >
            <Paper
              elevation={5}
              onClick={() => navigate('/search')}
              sx={{
                p: { xs: 1.2, md: 3 },
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: 210,
                transition: 'transform .15s, box-shadow .15s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-7px) scale(1.03)',
                  boxShadow: 8,
                },
              }}
            >
              <SearchIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Akıllı Tercih Aracı
              </Typography>
              <Typography sx={{ color: 'grey.700', fontSize: 16 }}>
                Puanınıza ve tercihlerinize göre en uygun bölümleri bulun. Son yılın verileriyle karşılaştırın.
              </Typography>
            </Paper>
            <Paper
              elevation={5}
              onClick={() => navigate('/calculator')}
              sx={{
                p: { xs: 1.2, md: 3 },
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: 210,
                transition: 'transform .15s, box-shadow .15s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-7px) scale(1.03)',
                  boxShadow: 8,
                },
              }}
            >
              <CalculateIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Puan Hesaplama
              </Typography>
              <Typography sx={{ color: 'grey.700', fontSize: 16 }}>
                TYT ve AYT netlerinizi girerek puanınızı hesaplayın. Sayısal, eşit ağırlık, sözel ve dil puanlarınızı öğrenin.
              </Typography>
            </Paper>
            <Paper
              elevation={5}
              onClick={() => navigate('/blog')}
              sx={{
                p: { xs: 1.2, md: 3 },
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: 210,
                transition: 'transform .15s, box-shadow .15s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-7px) scale(1.03)',
                  boxShadow: 8,
                },
              }}
            >
              <SchoolIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Bilgilendirici İçerikler
              </Typography>
              <Typography sx={{ color: 'grey.700', fontSize: 16 }}>
                Tercih döneminde dikkat edilmesi gerekenler, bölüm tanıtımları ve üniversite yaşamı hakkında bilgiler.
              </Typography>
            </Paper>
            <Paper
              elevation={5}
              onClick={() => navigate('/quiz')}
              sx={{
                p: { xs: 1.2, md: 3 },
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: 210,
                transition: 'transform .15s, box-shadow .15s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-7px) scale(1.03)',
                  boxShadow: 8,
                },
              }}
            >
              <QuizIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Bölüm Testi
              </Typography>
              <Typography sx={{ color: 'grey.700', fontSize: 16 }}>
                Size en uygun bölümü bulmak için kısa bir test çözün. İlgi alanlarınıza ve yeteneklerinize göre öneriler alın.
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;
