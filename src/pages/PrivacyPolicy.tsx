import React from 'react';
import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => (
  <>
    <Helmet>
      <title>Gizlilik Politikası | Üniversite Tercih Asistanı</title>
      <meta name="description" content="Kişisel verilerinizin nasıl korunduğu ve kullanıldığı hakkında detaylı bilgi için gizlilik politikamızı inceleyin." />
    </Helmet>
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, p: { xs: 2, md: 4 }, bgcolor: "#fff" }}>
        <CardContent>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: "#1565c0" }}>
            Gizlilik Politikası
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Üniversite Tercih Asistanı olarak, ziyaretçilerimizin gizliliğini önemsiyoruz. Bu gizlilik politikası, sitemizi ziyaret ettiğinizde hangi bilgileri topladığımızı ve bu bilgileri nasıl kullandığımızı açıklamaktadır.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Toplanan Bilgiler
            </Typography>
            <List sx={{ pl: 3 }}>
              <ListItem>
                <ListItemText primary="Sitemizi ziyaret ettiğinizde IP adresiniz, tarayıcı bilgileriniz ve çerezler aracılığıyla bazı veriler toplanabilir." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Test/quiz veya form doldurduğunuzda, sağladığınız bilgiler sadece istatistiksel amaçlar için kullanılır ve üçüncü şahıslarla paylaşılmaz." />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Çerezler
            </Typography>
            <List sx={{ pl: 3 }}>
              <ListItem>
                <ListItemText primary="Sitemiz, kullanıcı deneyimini geliştirmek ve analiz amaçlı çerezler kullanır." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Google AdSense gibi üçüncü taraf hizmet sağlayıcıları, reklamlar için çerez kullanabilir." />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Veri Güvenliği
            </Typography>
            <List sx={{ pl: 3 }}>
              <ListItem>
                <ListItemText primary="Kişisel bilgileriniz güvende tutulur, üçüncü şahıslarla paylaşılmaz." />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              İletişim
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
              Daha fazla bilgi veya veri talepleriniz için bizimle iletişime geçebilirsiniz:&nbsp;
              <EmailIcon sx={{ fontSize: 20, mr: 1, color: "#1565c0" }} />
              <a href="mailto:hasancanselmo07@gmail.com" style={{ color: "#1565c0", fontWeight: 500 }}>
                hasancanselmo07@gmail.com
              </a>
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Bu politika zaman zaman güncellenebilir.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </>
);

export default PrivacyPolicy;
