import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Alert,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { Department } from '../types/department';
import { readExcelData } from '../services/excelService';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';

const Search = () => {
  const { departmentSlug } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [universityType, setUniversityType] = useState<'4-year' | '2-year'>('4-year');
  const [filters, setFilters] = useState({
    rank: '',
    city: '',
    universityType: '',
    language: '',
    departmentName: '',
    universityName: '',
  });
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Benzersiz şehirleri al
  const cities = Array.from(new Set(departments.map(dept => dept.city))).sort();
  // Benzersiz üniversite türlerini al
  const universityTypes = Array.from(new Set(departments.map(dept => dept.universityType))).sort();
  // Benzersiz eğitim dillerini al
  const languages = Array.from(new Set(departments.map(dept => dept.language))).sort();

  // Slugify function
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

  // Bölüm adının ilk parantez öncesi (temiz ad)
  const getBaseDepartmentName = (name: string) => name.split('(')[0].trim();

  // Benzersiz sade bölüm adları (JSON'dan)
  const baseDepartmentNames = Array.from(new Set(departments.map(d => getBaseDepartmentName(d.departmentName))));

  // Seçili bölüm adı (slug'dan)
  let selectedBaseDepartmentName: string | null = null;
  if (departmentSlug && baseDepartmentNames.length > 0) {
    selectedBaseDepartmentName = baseDepartmentNames.find(
      base => slugify(base) === departmentSlug
    ) || null;
  }

  // Filtrelenmiş bölümler (seçili base name'e göre)
  const filteredByBaseName = selectedBaseDepartmentName
    ? departments.filter(d => getBaseDepartmentName(d.departmentName) === selectedBaseDepartmentName)
    : filteredDepartments;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await readExcelData(universityType === '4-year' ? 'universite_taban_puanlari_detayli.json' : 'universite_onlisans_duzenli_burs_duzeltildi.json');
        setDepartments(data);
        console.log('JSON örnek veri:', data[0]);
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu');
        console.error(err);
      }
    };
    loadData();
  }, [universityType]);

  // Set departmentName filter if departmentSlug exists
  useEffect(() => {
    if (departmentSlug && departments.length > 0) {
      const match = departments.find(dept => slugify(dept.departmentName) === departmentSlug);
      if (match) {
        setFilters(prev => ({ ...prev, departmentName: match.departmentName }));
      } else {
        setFilters(prev => ({ ...prev, departmentName: '' }));
      }
    }
    // eslint-disable-next-line
  }, [departmentSlug, departments]);

  useEffect(() => {
    console.log('departments:', departments);
    let filtered = [...departments];

    // Sıralama filtresi
    if (filters.rank) {
      const rankNumber = parseInt(filters.rank.replace(/\./g, ''));
      if (!isNaN(rankNumber)) {
        filtered = filtered.filter(dept => dept.rank && rankNumber <= dept.rank);
      }
    }

    // Şehir filtresi
    if (filters.city) {
      filtered = filtered.filter(dept => dept.city === filters.city);
    }

    // Üniversite türü filtresi
    if (filters.universityType) {
      filtered = filtered.filter(dept => dept.universityType === filters.universityType);
    }

    // Eğitim dili filtresi
    if (filters.language) {
      filtered = filtered.filter(dept => dept.language === filters.language);
    }

    // Bölüm adı filtresi
    if (filters.departmentName) {
      const searchTerm = filters.departmentName.toLowerCase();
      filtered = filtered.filter(dept => 
        dept.departmentName.toLowerCase().includes(searchTerm)
      );
    }

    // Üniversite adı filtresi
    if (filters.universityName) {
      const searchTerm = filters.universityName.toLowerCase();
      filtered = filtered.filter(dept => 
        dept.universityName.toLowerCase().includes(searchTerm)
      );
    }

    // Sıralamaya göre sırala (en yüksek sıralamadan en düşüğe)
    filtered.sort((a, b) => {
      if (!a.rank) return 1;
      if (!b.rank) return -1;
      return a.rank - b.rank;
    });

    setFilteredDepartments(filtered);
    setPage(1);
  }, [filters, departments]);

  // Sayfalama için slice
  const pagedDepartments = filteredByBaseName.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.ceil(filteredByBaseName.length / pageSize);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // SEO title/description
  let seoTitle = 'Üniversite Taban Puanları ve Başarı Sıralamaları 2025 | YKS Tercih Asistanı';
  let seoDesc = '2025 yılı üniversite taban puanları ve başarı sıralamaları. Hangi bölüm, hangi şehir, hangi üniversite? Tüm bölümlerin taban puanlarını, kontenjan ve sıralamalarını kolayca öğrenin.';
  if (selectedBaseDepartmentName && filteredByBaseName.length > 0) {
    seoTitle = `${selectedBaseDepartmentName} 2025 Taban Puanları ve Başarı Sıralamaları | YKS Tercih Asistanı`;
    seoDesc = `${selectedBaseDepartmentName} bölümü için 2025 taban puanları, başarı sıralamaları, kontenjan ve üniversite bilgileri. Tüm detaylar YKS Tercih Asistanı'nda.`;
  }

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          {/* SEO Tanıtım Yazısı */}
          {!selectedBaseDepartmentName && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center', fontWeight: 500 }}>
              YKS 2025 için tüm üniversite ve bölümlerin taban puanları burada! Yazılım mühendisliği, hukuk, psikoloji ve daha onlarca bölümün güncel taban puanlarını filtreleyin.
            </Typography>
          )}
          {/* Bölüm Seç Autocomplete */}
          <Box sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
            <Autocomplete
              options={baseDepartmentNames}
              value={selectedBaseDepartmentName || ''}
              onChange={(_, value) => {
                if (value) {
                  navigate(`/search/${slugify(value)}`);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Bölüm Seç" variant="outlined" />}
              noOptionsText="Bölüm bulunamadı"
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            />
          </Box>
          {selectedBaseDepartmentName && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/search')}
              >
                Bölüm Seçimini Sıfırla
              </Button>
            </Box>
          )}
          <Typography variant="h4" component="h1" gutterBottom>
            {selectedBaseDepartmentName
              ? `${selectedBaseDepartmentName} Taban Puanları ve Başarı Sıralamaları`
              : 'Üniversite Bölüm Arama'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {selectedBaseDepartmentName
              ? `${selectedBaseDepartmentName} bölümü için 2025 taban puanları, başarı sıralamaları ve kontenjan bilgileri.`
              : 'Kriterlerinize uygun bölümleri görüntüleyin'}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <ToggleButtonGroup
              value={universityType}
              exclusive
              onChange={(e, value) => value && setUniversityType(value)}
              aria-label="university type"
            >
              <ToggleButton value="4-year" aria-label="4-year universities">
                4 Yıllık Üniversiteler
              </ToggleButton>
              <ToggleButton value="2-year" aria-label="2-year universities">
                2 Yıllık Üniversiteler
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
            mt: 2 
          }}>
            <TextField
              fullWidth
              label="Başarı Sıralamanız"
              variant="outlined"
              value={filters.rank}
              onChange={(e) => handleFilterChange('rank', e.target.value)}
              placeholder="Örnek: 450000"
              error={!!error}
              helperText={error || "Sıralamanızı girin (noktasız olarak)"}
              sx={{
                backgroundColor: '#e3f2fd',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fbff',
                  borderRadius: 2,
                },
              }}
            />
            
            <FormControl fullWidth sx={{ backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <InputLabel>Şehir</InputLabel>
              <Select
                value={filters.city}
                label="Şehir"
                onChange={(e) => handleFilterChange('city', e.target.value)}
                sx={{ backgroundColor: '#f8fbff', borderRadius: 2 }}
              >
                <MenuItem value="">Tümü</MenuItem>
                {cities.map(city => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <InputLabel>Üniversite Türü</InputLabel>
              <Select
                value={filters.universityType}
                label="Üniversite Türü"
                onChange={(e) => handleFilterChange('universityType', e.target.value)}
                sx={{ backgroundColor: '#f8fbff', borderRadius: 2 }}
              >
                <MenuItem value="">Tümü</MenuItem>
                {universityTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <InputLabel>Eğitim Dili</InputLabel>
              <Select
                value={filters.language}
                label="Eğitim Dili"
                onChange={(e) => handleFilterChange('language', e.target.value)}
                sx={{ backgroundColor: '#f8fbff', borderRadius: 2 }}
              >
                <MenuItem value="">Tümü</MenuItem>
                {languages.map(lang => (
                  <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Bölüm Adı"
              variant="outlined"
              value={filters.departmentName}
              onChange={(e) => handleFilterChange('departmentName', e.target.value)}
              placeholder="Bölüm adı ile arama yapın"
              sx={{
                backgroundColor: '#f8fbff',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fbff',
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Üniversite Adı"
              variant="outlined"
              value={filters.universityName}
              onChange={(e) => handleFilterChange('universityName', e.target.value)}
              placeholder="Üniversite adı ile arama yapın"
              sx={{
                backgroundColor: '#f8fbff',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fbff',
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Aktif filtreleri göster */}
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              const label = {
                rank: 'Sıralama',
                city: 'Şehir',
                universityType: 'Üniversite Türü',
                language: 'Eğitim Dili',
                departmentName: 'Bölüm',
                universityName: 'Üniversite',
              }[key as keyof typeof filters];
              return (
                <Chip
                  key={key}
                  label={`${label}: ${value}`}
                  onDelete={() => handleFilterChange(key as keyof typeof filters, '')}
                  color="primary"
                  variant="outlined"
                />
              );
            })}
          </Stack>

          {filteredByBaseName.length > 0 ? (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
                {pagedDepartments.map((dept) => (
                  <Card key={dept.id} sx={{
                    backgroundColor: '#f8fbff ',
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    border: '1px solid #e3f2fd',
                    transition: 'box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    },
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {dept.departmentName}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {dept.universityName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Şehir: {dept.city}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Üniversite Türü: {dept.universityType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Puan Türü: {dept.scoreType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Eğitim Dili: {dept.language}
                      </Typography>
                      {dept.scholarship !== 'Bursuz' && (
                        <Typography variant="body2" color="text.secondary">
                          Burs: {dept.scholarship}
                        </Typography>
                      )}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="primary">
                          Başarı Sıralaması: {dept.rank?.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          Kontenjan: {dept.quota} | Yerleşen: {dept.placed}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              {/* Pagination */}
              {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          ) : (
            <Alert severity="info">
              Seçtiğiniz kriterlere uygun bölüm bulunamadı. Lütfen filtreleri değiştirin.
            </Alert>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Search;