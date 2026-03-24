import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
  Button,
  Box,
  Divider,
  Paper
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

const CARD_HEIGHT = 420;
const TITLE_HEIGHT = 56;
const SUMMARY_HEIGHT = 80;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/formatted_blogs.json')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched blog data:', data); // Debug
        const processedBlogs = data.map((blog, index) => {
          let summary = blog.summary;
          if (!summary) {
            if (blog.content && blog.content.length > 0) {
              summary = blog.content[0];
            } else if (blog.sections && blog.sections[0] && blog.sections[0].paragraphs && blog.sections[0].paragraphs[0]) {
              summary = blog.sections[0].paragraphs[0];
            } else {
              summary = 'İçerik bulunamadı.';
            }
          }
          // Temsili fotoğraflar için anahtar kelimeler
          const keywords = [
            'technology',
            'ai',
            'software',
            'web',
            'data',
            'analysis',
            'cloud',
            'code',
            'robotics',
            'future'
          ];
          const keyword = keywords[index % keywords.length];
          return {
            id: index,
            title: blog.title || 'Başlıksız Blog',
            summary,
            date: blog.date || new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
            author: blog.author || 'Hasan Can SELMO',
            image: blog.image || `https://source.unsplash.com/random/800x400?${keyword}`,
          };
        });
        setBlogs(processedBlogs);
        setLoading(false);
      })
      .catch(error => {
        console.error('Blog verileri yüklenirken hata oluştu:', error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog Sayfası | Güncel Yazılar</title>
        <meta name="description" content="Bilgisayar mühendisliği, yapay zeka, sınavlar ve eğitim hakkında güncel blog yazıları." />
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 5 }}>
          Blog Yazıları
        </Typography>
        {loading ? (
          <Typography align="center">Yükleniyor...</Typography>
        ) : blogs.length === 0 ? (
          <Typography align="center">Henüz blog yazısı bulunmuyor.</Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
            {blogs.map((blog) => (
              <Paper
                key={blog.id}
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
                <Box sx={{ width: '100%', height: 180, bgcolor: '#e0e7ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={blog.image || '/images/blog1.jpg'}
                    alt={blog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Blog+Görseli'}
                  />
                </Box>
                <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#232946', minHeight: 56, maxHeight: 56, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60, maxHeight: 60, mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', fontSize: '1.05rem', lineHeight: 1.6 }}>
                      {blog.summary}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ px: 2, py: 0.7, borderRadius: 2, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', gap: 1, boxShadow: '0 1px 4px 0 rgba(99,102,241,0.07)' }}>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
                        {blog.author}
                      </Typography>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#b3b3c6' }} />
                      <Typography variant="caption" color="text.secondary">
                        {blog.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    component={Link}
                    to={`/blog/${blog.id}`}
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
    </>
  );
};

export default BlogList; 