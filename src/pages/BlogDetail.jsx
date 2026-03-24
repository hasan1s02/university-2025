import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';


const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    console.log('BlogDetail: ID from useParams:', id);
    const blogId = parseInt(id);
    console.log('BlogDetail: Parsed blogId:', blogId);

    if (isNaN(blogId) || blogId < 0) {
      setLoading(false);
      setBlog(null);
      return;
    }

    fetch('/formatted_blogs.json')
      .then((res) => res.json())
      .then((data) => {
        console.log('BlogDetail: Fetched data length:', data.length);
        const selectedBlog = data[blogId];
        console.log('BlogDetail: selectedBlog:', selectedBlog);

        if (selectedBlog) {
          const firstSection = selectedBlog.content && selectedBlog.content[0];
          const firstParagraph = firstSection && firstSection.paragraphs && firstSection.paragraphs[0];

          const processedBlog = {
            id: blogId,
            title: selectedBlog.title || 'Başlıksız Blog',
            summary: firstParagraph || 'İçerik bulunamadı.',
            date: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
            author: "Hasan Can SELMO",
            image: selectedBlog.image || 'https://via.placeholder.com/800x400?text=Blog+Görseli',
            sections: (selectedBlog.content || []).map(section => ({
              title: section.heading || '',
              content: Array.isArray(section.paragraphs) ? section.paragraphs.join('\n\n') : 'İçerik bulunamadı.'
            })),
            tags: ["Teknoloji", "Yazılım", "Eğitim"]
          };
          setBlog(processedBlog);
        } else {
          setBlog(null);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Blog verileri yüklenirken hata oluştu:', error);
        setLoading(false);
        setBlog(null);
      });
  }, [id]);

  const handleImageLoad = (image) => {
    setLoadedImages({ ...loadedImages, [image]: true });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Typography align="center">Yükleniyor...</Typography>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Typography align="center">Blog yazısı bulunamadı.</Typography>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Blog Sayfası</title>
        <meta name="description" content={blog.summary} />
      </Helmet>
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Breadcrumbs sx={{ mb: 4 }}>
          <MuiLink component={Link} to="/" color="inherit">
            Ana Sayfa
          </MuiLink>
          <MuiLink component={Link} to="/blog" color="inherit">
            Blog
          </MuiLink>
          <Typography color="text.primary">{blog.title}</Typography>
        </Breadcrumbs>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)' }}>
          {blog.image && (
            <Box
              sx={{
                width: '100%',
                maxWidth: 600, // genişlik limiti
                maxHeight: 250, // yükseklik limiti
                margin: '0 auto', // ortala
                mb: 3,
                borderRadius: 3,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#e0e7ef',
              }}
            >
              <img
                src={blog.image}
                alt={blog.title}
                style={{
                  width: '100%',
                  height: 'auto', // oran korunur
                  objectFit: 'contain', // cover yerine contain daha doğal durabilir
                  imageRendering: 'auto', // pikselliği azaltır
                  transition: 'opacity 0.3s ease',
                  opacity: loadedImages[blog.image] ? 1 : 0,
                  display: 'block',
                }}
                loading="lazy"
                onLoad={() => handleImageLoad(blog.image)}
                onError={e => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Blog+Görseli';
                }}
              />
            </Box>
          )}
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {blog.title}
          </Typography>

          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              {blog.date}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              •
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {blog.author}
            </Typography>
          </Box>

          {blog.sections && blog.sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              {section.title && (
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                  {section.title}
                </Typography>
              )}
              {section.title && <Divider sx={{ mb: 3 }} />}
              {section.content.split('\n\n').map((paragraph, pIndex) => (
                paragraph.trim() && (
                  <Typography
                    key={pIndex}
                    variant="body1"
                    paragraph
                    sx={{
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      mb: 2,
                      textAlign: 'justify'
                    }}
                  >
                    {paragraph}
                  </Typography>
                )
              ))}
            </Box>
          ))}

          <Box sx={{ mt: 6, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {blog.tags && blog.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                sx={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                  },
                }}
              />
            ))}
          </Box>

          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/blog"
              variant="outlined"
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderColor: '#6366f1',
                color: '#6366f1',
                '&:hover': {
                  borderColor: '#4f46e5',
                  background: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              Tüm Yazılara Dön
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default BlogDetail; 