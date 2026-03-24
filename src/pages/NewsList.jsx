import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider
} from '@mui/material';

const NewsList = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/news.json')
      .then(res => res.json())
      .then(data => {
        // Eğer tek bir haber obje ise diziye çevir
        setNewsList(Array.isArray(data) ? data : [data]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 5 }}>
        YKS Haberleri
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
        YKS ile ilgili son dakika gelişmeleri, duyurular ve önemli haberler burada!
      </Typography>
      {loading ? (
        <Typography align="center">Yükleniyor...</Typography>
      ) : newsList.length === 0 ? (
        <Typography align="center">Henüz haber bulunmuyor.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4, mt: 4 }}>
          {newsList.map((news, i) => (
            <Paper
              key={i}
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
                minHeight: 420,
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
              }}
            >
              <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#232946', minHeight: 56, maxHeight: 56, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {news.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60, maxHeight: 60, mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', fontSize: '1.05rem', lineHeight: 1.6 }}>
                    {news.summary}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ px: 2, py: 0.7, borderRadius: 2, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', gap: 1, boxShadow: '0 1px 4px 0 rgba(99,102,241,0.07)' }}>
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
                      YKS Ekibi
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#b3b3c6' }} />
                    <Typography variant="caption" color="text.secondary">
                      {news.date}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  component={Link}
                  to={`/haber/${i}`}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    py: 1.2,
                    background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
                    boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
                    textTransform: 'none',
                    letterSpacing: 0.5,
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)',
                      boxShadow: '0 4px 16px 0 rgba(99,102,241,0.18)',
                    },
                  }}
                >
                  Detayları Gör
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default NewsList; 