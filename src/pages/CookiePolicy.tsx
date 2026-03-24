import React from 'react';
import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { Helmet } from 'react-helmet-async';

const CookiePolicy = () => (
  <>
    <Helmet>
      <title>Çerez Politikası | Üniversite Tercih Asistanı</title>
      <meta name="description" content="Üniversite Tercih Asistanı'nın çerez kullanımı ve kullanıcı verilerinin gizliliği hakkında detaylı bilgi edinin." />
    </Helmet>
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, p: { xs: 2, md: 4 }, bgcolor: "#fff" }}>
        <CardContent>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: "#1565c0" }}>
            Çerez Politikası
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Üniversite Tercih Asistanı olarak, kullanıcı deneyimini iyileştirmek için çerezler kullanıyoruz.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Çerez Nedir?
            </Typography>
            <Typography variant="body1" sx={{ pl: 1 }}>
              Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Kullandığımız Çerez Türleri
            </Typography>
            <List sx={{ pl: 3 }}>
              <ListItem>
                <ListItemText primary="Zorunlu çerezler: Sitenin düzgün çalışması için gereklidir." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Analitik çerezler: Site trafiğini ve kullanıcı davranışlarını analiz etmemize yardımcı olur." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Reklam çerezleri: Google AdSense gibi üçüncü taraflar tarafından gösterilen reklamların etkinliğini artırır." />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Çerezleri Nasıl Kontrol Edebilirim?
            </Typography>
            <Typography variant="body1" sx={{ pl: 1 }}>
              Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: "#1976d2" }}>
              Detaylı Bilgi İçin
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
              Daha fazla bilgi için bizimle iletişime geçebilirsiniz:&nbsp;
              <EmailIcon sx={{ fontSize: 20, mr: 1, color: "#1565c0" }} />
              <a href="mailto:hasancanselmo07@gmail.com" style={{ color: "#1565c0", fontWeight: 500 }}>
                hasancanselmo07@gmail.com
              </a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  </>
);

export default CookiePolicy;
