import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button, Box, Divider } from '@mui/material';

function renderContent(sections) {
  if (!sections) return null;
  return sections.map((section, idx) => {
    if (section.heading) {
      return (
        <Box key={idx} sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{section.heading}</Typography>
          <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>{section.content}</Typography>
        </Box>
      );
    } else if (section.type === 'list') {
      return (
        <Box key={idx} sx={{ mb: 3 }}>
          {section.items.map((item, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{item.title}</Typography>
              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>{item.description}</Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  });
}

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/news.json')
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [data];
        // id parametresi index olarak kullanılıyor
        const idx = parseInt(id, 10);
        setNews(arr[idx]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography align="center">Yükleniyor...</Typography>
      </Container>
    );
  }

  if (!news) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5">Haber bulunamadı.</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Geri Dön</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ borderRadius: 5, p: { xs: 2, md: 6 }, maxWidth: 900, mx: 'auto', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, color: '#232946' }}>
          {news.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>YKS Ekibi</Typography>
          <Divider orientation="vertical" flexItem sx={{ borderColor: '#b3b3c6' }} />
          <Typography variant="subtitle2" color="text.secondary">{news.date}</Typography>
        </Box>
        {news.image && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <img src={news.image} alt={news.title} style={{ maxWidth: '100%', borderRadius: 12, boxShadow: '0 2px 12px 0 rgba(99,102,241,0.10)' }} />
          </Box>
        )}
        <Box sx={{ mb: 2 }}>
          {renderContent(news.sections)}
        </Box>
        <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mt: 3, borderRadius: 3, fontWeight: 700, px: 4, py: 1.2 }}>Geri Dön</Button>
      </Paper>
    </Container>
  );
};

export default NewsDetail; 