import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { calculateRanking } from '../utils/scoreUtils';
import { Helmet } from 'react-helmet-async';

// Katsayılar ve puan türleri
const COEFFICIENTS = {
  TYT: {
    TURKCE: 1.32,      // Güncellenmiş katsayı
    MATEMATIK: 1.32,   // Güncellenmiş katsayı
    FEN: 1.36,         // Güncellenmiş katsayı
    SOSYAL: 1.36,      // Güncellenmiş katsayı
  },
  AYT: {
    SAYISAL: {
      MATEMATIK: 3.0,
      FIZIK: 2.85,
      KIMYA: 3.07,
      BIYOLOJI: 3.07,
    },
    ESIT_AGIRLIK: {
      MATEMATIK: 3.0,
      EDEBIYAT: 3.0,
      TARIH1: 2.8,
      COGRAFYA1: 3.3,
    },
    SOZEL: {
      EDEBIYAT: 3.0,
      TARIH1: 2.8,
      COGRAFYA1: 3.3,
      TARIH2: 2.91,
      COGRAFYA2: 2.91,
      FELSEFE: 3.0,
      DIN: 3.0,
    },
    DIL: {
      YABANCI_DIL: 1.5,  // Güncellenmiş katsayı
    },
  },
};

// TYT test bilgileri
const TYT_TESTS = {
  TURKCE: { name: 'Türkçe', questionCount: 40 },
  MATEMATIK: { name: 'Matematik', questionCount: 40 },
  FEN: { name: 'Fen Bilimleri', questionCount: 20 },
  SOSYAL: { name: 'Sosyal Bilimler', questionCount: 20 },
};

// AYT test bilgileri
const AYT_TESTS = {
  SAYISAL: {
    MATEMATIK: { name: 'Matematik', questionCount: 40 },
    FIZIK: { name: 'Fizik', questionCount: 14 },
    KIMYA: { name: 'Kimya', questionCount: 13 },
    BIYOLOJI: { name: 'Biyoloji', questionCount: 13 },
  },
  ESIT_AGIRLIK: {
    MATEMATIK: { name: 'Matematik', questionCount: 40 },
    EDEBIYAT: { name: 'Edebiyat', questionCount: 24 },
    TARIH1: { name: 'Tarih-1', questionCount: 10 },
    COGRAFYA1: { name: 'Coğrafya-1', questionCount: 6 },
  },
  SOZEL: {
    EDEBIYAT: { name: 'Edebiyat', questionCount: 24 },
    TARIH1: { name: 'Tarih-1', questionCount: 10 },
    COGRAFYA1: { name: 'Coğrafya-1', questionCount: 6 },
    TARIH2: { name: 'Tarih-2', questionCount: 11 },
    COGRAFYA2: { name: 'Coğrafya-2', questionCount: 11 },
    FELSEFE: { name: 'Felsefe Grubu', questionCount: 12 },
    DIN: { name: 'Din Kültürü', questionCount: 12 },
  },
  DIL: {
    YABANCI_DIL: { name: 'Yabancı Dil', questionCount: 80 },
  },
};

type ScoreType = 'SAYISAL' | 'ESIT_AGIRLIK' | 'SOZEL' | 'DIL';

interface TestScores {
  correct: number;
  incorrect: number;
}

interface TYTScores {
  TURKCE: TestScores;
  MATEMATIK: TestScores;
  FEN: TestScores;
  SOSYAL: TestScores;
}

interface AYTScores {
  [key: string]: TestScores;
}

// 2024 yılı için ortalama ve standart sapmalar
const STANDARD_VALUES = {
  TYT: { mean: 235, std: 45 },
  SAYISAL: { mean: 180, std: 60 },
  ESIT_AGIRLIK: { mean: 170, std: 55 },
  SOZEL: { mean: 160, std: 50 },
  DIL: { mean: 200, std: 65 },
};

// 2024 YKS resmi katsayıları ve başlangıç puanları
const TYT_COEFFICIENTS = {
  TURKCE: 2.91,
  SOSYAL: 2.94,
  MATEMATIK: 2.93,
  FEN: 3.15,
};
const TYT_BASE = 144.95;

const SAY_COEFFICIENTS = {
  TURKCE: 1.11,
  SOSYAL: 1.12,
  MATEMATIK: 1.11,
  FEN: 1.20,
  AYT_MATEMATIK: 3.19,
  FIZIK: 2.43,
  KIMYA: 3.07,
  BIYOLOJI: 2.51,
};
const SAY_BASE = 133.28;

const EA_COEFFICIENTS = {
  TURKCE: 1.14,
  SOSYAL: 1.15,
  MATEMATIK: 1.15,
  FEN: 1.23,
  AYT_MATEMATIK: 3.28,
  EDEBIYAT: 2.83,
  TARIH1: 2.38,
  COGRAFYA1: 2.54,
};
const EA_BASE = 132.28;

const SOZ_COEFFICIENTS = {
  TURKCE: 1.23,
  SOSYAL: 1.24,
  MATEMATIK: 1.24,
  FEN: 1.33,
  EDEBIYAT: 3.06,
  TARIH1: 2.57,
  COGRAFYA1: 2.74,
  TARIH2: 3.16,
  COGRAFYA2: 2.82,
  FELSEFE: 3.85,
  DIN: 3.13,
};
const SOZ_BASE = 130.36;

const DIL_COEFFICIENTS = {
  TURKCE: 1.50,
  SOSYAL: 1.51,
  MATEMATIK: 1.50,
  FEN: 1.62,
  YABANCI_DIL: 2.61,
};
const DIL_BASE = 110.58;

const ScoreCalculator = () => {
  const [scoreType, setScoreType] = useState<ScoreType>('SAYISAL');
  const [tytScores, setTytScores] = useState<TYTScores>({
    TURKCE: { correct: 0, incorrect: 0 },
    MATEMATIK: { correct: 0, incorrect: 0 },
    FEN: { correct: 0, incorrect: 0 },
    SOSYAL: { correct: 0, incorrect: 0 },
  });
  const [aytScores, setAytScores] = useState<AYTScores>({});
  const [obp, setObp] = useState<string>('');
  const [results, setResults] = useState<{
    tytScore: number;
    aytScore?: number;
    totalScore: number;
    obpScore: number;
    tytRanking: number;
    aytRanking?: number;
  } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Net hesaplama fonksiyonu
  const calculateNet = (correct: number, incorrect: number): number => {
    return Math.max(0, correct - (incorrect / 4));
  };

  // TYT puanı hesaplama (2024 resmi katsayılar)
  const calculateTYTScore = (scores: TYTScores): number => {
    const turkceNet = calculateNet(scores.TURKCE.correct, scores.TURKCE.incorrect);
    const matematikNet = calculateNet(scores.MATEMATIK.correct, scores.MATEMATIK.incorrect);
    const sosyalNet = calculateNet(scores.SOSYAL.correct, scores.SOSYAL.incorrect);
    const fenNet = calculateNet(scores.FEN.correct, scores.FEN.incorrect);
    return TYT_BASE +
      turkceNet * TYT_COEFFICIENTS.TURKCE +
      matematikNet * TYT_COEFFICIENTS.MATEMATIK +
      sosyalNet * TYT_COEFFICIENTS.SOSYAL +
      fenNet * TYT_COEFFICIENTS.FEN;
  };

  // AYT puanı hesaplama (2024 resmi katsayılar, SAY)
  const calculateAYTScore = (scores: AYTScores, tytScores: TYTScores): number => {
    // TYT testleri de katsayıya dahil!
    const turkceNet = calculateNet(tytScores.TURKCE.correct, tytScores.TURKCE.incorrect);
    const matematikNet = calculateNet(tytScores.MATEMATIK.correct, tytScores.MATEMATIK.incorrect);
    const sosyalNet = calculateNet(tytScores.SOSYAL.correct, tytScores.SOSYAL.incorrect);
    const fenNet = calculateNet(tytScores.FEN.correct, tytScores.FEN.incorrect);

    let aytScore = 0;
    let currentCoefficients: typeof SAY_COEFFICIENTS | typeof EA_COEFFICIENTS | typeof SOZ_COEFFICIENTS | typeof DIL_COEFFICIENTS;
    let currentBase: number;

    switch (scoreType) {
      case 'SAYISAL':
        currentCoefficients = SAY_COEFFICIENTS;
        currentBase = SAY_BASE;
        const aytMatNetSay = calculateNet(scores.MATEMATIK?.correct || 0, scores.MATEMATIK?.incorrect || 0);
        const fizikNet = calculateNet(scores.FIZIK?.correct || 0, scores.FIZIK?.incorrect || 0);
        const kimyaNet = calculateNet(scores.KIMYA?.correct || 0, scores.KIMYA?.incorrect || 0);
        const biyolojiNet = calculateNet(scores.BIYOLOJI?.correct || 0, scores.BIYOLOJI?.incorrect || 0);
        aytScore = currentBase +
          turkceNet * currentCoefficients.TURKCE +
          sosyalNet * currentCoefficients.SOSYAL +
          matematikNet * currentCoefficients.MATEMATIK +
          fenNet * currentCoefficients.FEN +
          aytMatNetSay * currentCoefficients.AYT_MATEMATIK +
          fizikNet * currentCoefficients.FIZIK +
          kimyaNet * currentCoefficients.KIMYA +
          biyolojiNet * currentCoefficients.BIYOLOJI;
        break;
      case 'ESIT_AGIRLIK':
        currentCoefficients = EA_COEFFICIENTS;
        currentBase = EA_BASE;
        const aytMatNetEa = calculateNet(scores.MATEMATIK?.correct || 0, scores.MATEMATIK?.incorrect || 0);
        const edebiyatNet = calculateNet(scores.EDEBIYAT?.correct || 0, scores.EDEBIYAT?.incorrect || 0);
        const tarih1Net = calculateNet(scores.TARIH1?.correct || 0, scores.TARIH1?.incorrect || 0);
        const cografya1Net = calculateNet(scores.COGRAFYA1?.correct || 0, scores.COGRAFYA1?.incorrect || 0);
        aytScore = currentBase +
          turkceNet * currentCoefficients.TURKCE +
          sosyalNet * currentCoefficients.SOSYAL +
          matematikNet * currentCoefficients.MATEMATIK +
          fenNet * currentCoefficients.FEN +
          aytMatNetEa * currentCoefficients.AYT_MATEMATIK +
          edebiyatNet * currentCoefficients.EDEBIYAT +
          tarih1Net * currentCoefficients.TARIH1 +
          cografya1Net * currentCoefficients.COGRAFYA1;
        break;
      case 'SOZEL':
        currentCoefficients = SOZ_COEFFICIENTS;
        currentBase = SOZ_BASE;
        const edebiyatNetSoz = calculateNet(scores.EDEBIYAT?.correct || 0, scores.EDEBIYAT?.incorrect || 0);
        const tarih1NetSoz = calculateNet(scores.TARIH1?.correct || 0, scores.TARIH1?.incorrect || 0);
        const cografya1NetSoz = calculateNet(scores.COGRAFYA1?.correct || 0, scores.COGRAFYA1?.incorrect || 0);
        const tarih2Net = calculateNet(scores.TARIH2?.correct || 0, scores.TARIH2?.incorrect || 0);
        const cografya2Net = calculateNet(scores.COGRAFYA2?.correct || 0, scores.COGRAFYA2?.incorrect || 0);
        const felsefeNet = calculateNet(scores.FELSEFE?.correct || 0, scores.FELSEFE?.incorrect || 0);
        const dinNet = calculateNet(scores.DIN?.correct || 0, scores.DIN?.incorrect || 0);
        aytScore = currentBase +
          turkceNet * currentCoefficients.TURKCE +
          sosyalNet * currentCoefficients.SOSYAL +
          matematikNet * currentCoefficients.MATEMATIK +
          fenNet * currentCoefficients.FEN +
          edebiyatNetSoz * currentCoefficients.EDEBIYAT +
          tarih1NetSoz * currentCoefficients.TARIH1 +
          cografya1NetSoz * currentCoefficients.COGRAFYA1 +
          tarih2Net * currentCoefficients.TARIH2 +
          cografya2Net * currentCoefficients.COGRAFYA2 +
          felsefeNet * currentCoefficients.FELSEFE +
          dinNet * currentCoefficients.DIN;
        break;
      case 'DIL':
        currentCoefficients = DIL_COEFFICIENTS;
        currentBase = DIL_BASE;
        const yabanciDilNet = calculateNet(scores.YABANCI_DIL?.correct || 0, scores.YABANCI_DIL?.incorrect || 0);
        aytScore = currentBase +
          turkceNet * currentCoefficients.TURKCE +
          sosyalNet * currentCoefficients.SOSYAL +
          matematikNet * currentCoefficients.MATEMATIK +
          fenNet * currentCoefficients.FEN +
          yabanciDilNet * currentCoefficients.YABANCI_DIL;
        break;
      default:
        aytScore = 0;
    }

    return aytScore;
  };

  // Toplam puan hesaplama (2024 resmi katsayılar)
  const calculateTotalScore = () => {
    // Tüm netlerin toplamını bul
    const tytNetSum = Object.values(tytScores).reduce((sum, t) => sum + t.correct + t.incorrect, 0);
    const aytNetSum = Object.values(aytScores).reduce((sum, t) => sum + (t?.correct || 0) + (t?.incorrect || 0), 0);
    if (tytNetSum + aytNetSum === 0) {
      setErrors(prev => ({
        ...prev,
        'TYT_general': 'En az bir testin neti girilmeli'
      }));
      setResults(null);
      return;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['TYT_general'];
      return newErrors;
    });
    const tytScore = calculateTYTScore(tytScores);
    // AYT'de hiç net yoksa sadece TYT hesapla
    if (aytNetSum === 0) {
      const obpScore = obp ? parseFloat(obp) * 5 * 0.12 : 0;
      const placementScore = tytScore + obpScore;
      const tytRanking = calculateRanking(tytScore + obpScore, 'TYT');
      setResults({
        tytScore,
        totalScore: placementScore,
        obpScore,
        tytRanking,
      });
      return;
    }
    const aytScore = calculateAYTScore(aytScores, tytScores);
    const obpScore = obp ? parseFloat(obp) * 5 * 0.12 : 0;
    const placementScore = aytScore + obpScore;
    // Calculate rankings
    const tytRanking = calculateRanking(tytScore + obpScore, 'TYT');
    const aytRanking = calculateRanking(placementScore, scoreType);
    setResults({
      tytScore,
      aytScore,
      totalScore: placementScore,
      obpScore,
      tytRanking,
      aytRanking,
    });
  };

  // TYT skor değişikliği
  const handleTYTScoreChange = (test: keyof TYTScores, field: keyof TestScores, value: string) => {
    const numValue = value === '' ? '' : parseInt(value) || 0;
    const otherField = field === 'correct' ? 'incorrect' : 'correct';
    const otherValue = Number(tytScores[test][otherField]);
    const questionCount = TYT_TESTS[test].questionCount;
    let newCorrect = field === 'correct' ? Number(numValue) : Number(tytScores[test].correct);
    let newIncorrect = field === 'incorrect' ? Number(numValue) : Number(tytScores[test].incorrect);
    const total = newCorrect + newIncorrect;
    if (total > questionCount) {
      setErrors(prev => ({
        ...prev,
        [`TYT_${test}`]: `${TYT_TESTS[test].name} testinde toplam doğru ve yanlış sayısı ${questionCount} olamaz!`
      }));
      return;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`TYT_${test}`];
        return newErrors;
      });
    }
    setTytScores(prev => ({
      ...prev,
      [test]: {
        ...prev[test],
        [field]: numValue,
      },
    }));
  };

  // AYT skor değişikliği
  const handleAYTScoreChange = (test: string, field: keyof TestScores, value: string) => {
    const numValue = value === '' ? '' : parseInt(value) || 0;
    const otherField = field === 'correct' ? 'incorrect' : 'correct';
    const otherValue = Number(aytScores[test]?.[otherField] ?? 0);
    const questionCount = (AYT_TESTS[scoreType] as any)[test].questionCount;
    let newCorrect = field === 'correct' ? Number(numValue) : Number(aytScores[test]?.correct ?? 0);
    let newIncorrect = field === 'incorrect' ? Number(numValue) : Number(aytScores[test]?.incorrect ?? 0);
    const total = newCorrect + newIncorrect;
    if (total > questionCount) {
      setErrors(prev => ({
        ...prev,
        [`AYT_${test}`]: `${(AYT_TESTS[scoreType] as any)[test].name} testinde toplam doğru ve yanlış sayısı ${questionCount} olamaz!`
      }));
      return;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`AYT_${test}`];
        return newErrors;
      });
    }
    setAytScores(prev => ({
      ...prev,
      [test]: {
        ...prev[test] || { correct: 0, incorrect: 0 },
        [field]: numValue,
      },
    }));
  };

  // Input'a tıklandığında sıfırsa state'i de temizle
  const handleFocusTYT = (test: keyof TYTScores, field: keyof TestScores, value: any) => {
    if (value === 0) {
      setTytScores(prev => ({
        ...prev,
        [test]: {
          ...prev[test],
          [field]: '',
        },
      }));
    }
  };

  const handleFocusAYT = (test: string, field: keyof TestScores, value: any) => {
    if (value === 0) {
      setAytScores(prev => ({
        ...prev,
        [test]: {
          ...prev[test] || { correct: 0, incorrect: 0 },
          [field]: '',
        },
      }));
    }
  };

  return (
    <>
      <Helmet>
        <title>YKS Puan Hesaplama | TYT ve AYT Puanını Hemen Hesapla</title>
        <meta name="description" content="TYT ve AYT netlerinizi girerek 2024 YKS puanınızı ve sıralamanızı hızlıca öğrenin. Sayısal, eşit ağırlık, sözel ve dil puan türleri desteklenir." />
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          YKS Puan Hesaplama
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          TYT ve AYT netlerinizi girerek puanınızı hesaplayın
        </Typography>
        {/* Uyarı/Disclaimer */}
        <Alert severity="warning" sx={{ mb: 3, fontWeight: 500 }}>
          Hesaplanan puan ve sıralamalar yaklaşık değerlerdir, kesin sonuçlar değildir. Resmi sonuçlar için ÖSYM açıklamalarını takip ediniz.
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Puan Türü Seçimi */}
          <Box>
            <FormControl fullWidth sx={{ backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <InputLabel>Puan Türü</InputLabel>
              <Select
                value={scoreType}
                label="Puan Türü"
                onChange={(e) => setScoreType(e.target.value as ScoreType)}
                sx={{ backgroundColor: '#f8fbff', borderRadius: 2 }}
              >
                <MenuItem value="SAYISAL">Sayısal (MF)</MenuItem>
                <MenuItem value="ESIT_AGIRLIK">Eşit Ağırlık (TM)</MenuItem>
                <MenuItem value="SOZEL">Sözel (TS)</MenuItem>
                <MenuItem value="DIL">Dil (DİL)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* TYT Bölümü */}
          <Card sx={{
            backgroundColor: '#f8fbff',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            border: '1px solid #e3f2fd',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                TYT (Temel Yeterlilik Testi)
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {Object.entries(TYT_TESTS).map(([key, test]) => (
                  <Box key={key}>
                    <Typography variant="subtitle2" gutterBottom>
                      {test.name} ({test.questionCount} Soru)
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      <TextField
                        fullWidth
                        label="Doğru"
                        type="number"
                        value={tytScores[key as keyof TYTScores].correct}
                        onChange={(e) => handleTYTScoreChange(key as keyof TYTScores, 'correct', e.target.value)}
                        onFocus={() => handleFocusTYT(key as keyof TYTScores, 'correct', tytScores[key as keyof TYTScores].correct)}
                        inputProps={{ min: 0, max: test.questionCount }}
                        sx={{
                          backgroundColor: '#e3f2fd',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f8fbff',
                            borderRadius: 2,
                          },
                        }}
                        error={!!errors[`TYT_${key}`]}
                        helperText={errors[`TYT_${key}`] || ''}
                      />
                      <TextField
                        fullWidth
                        label="Yanlış"
                        type="number"
                        value={tytScores[key as keyof TYTScores].incorrect}
                        onChange={(e) => handleTYTScoreChange(key as keyof TYTScores, 'incorrect', e.target.value)}
                        onFocus={() => handleFocusTYT(key as keyof TYTScores, 'incorrect', tytScores[key as keyof TYTScores].incorrect)}
                        inputProps={{ min: 0, max: test.questionCount }}
                        sx={{
                          backgroundColor: '#e3f2fd',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f8fbff',
                            borderRadius: 2,
                          },
                        }}
                        error={!!errors[`TYT_${key}`]}
                        helperText={errors[`TYT_${key}`] || ''}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* AYT Bölümü */}
          <Card sx={{
            backgroundColor: '#f8fbff',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            border: '1px solid #e3f2fd',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AYT (Alan Yeterlilik Testi)
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                {Object.entries(AYT_TESTS[scoreType]).map(([key, test]) => (
                  <Box key={key}>
                    <Typography variant="subtitle2" gutterBottom>
                      {test.name} ({test.questionCount} Soru)
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      <TextField
                        fullWidth
                        label="Doğru"
                        type="number"
                        value={aytScores[key]?.correct === '' ? '' : aytScores[key]?.correct ?? 0}
                        onChange={(e) => handleAYTScoreChange(key, 'correct', e.target.value)}
                        onFocus={() => handleFocusAYT(key, 'correct', aytScores[key]?.correct || 0)}
                        inputProps={{ min: 0, max: test.questionCount }}
                        sx={{
                          backgroundColor: '#e3f2fd',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f8fbff',
                            borderRadius: 2,
                          },
                        }}
                        error={!!errors[`AYT_${key}`]}
                        helperText={errors[`AYT_${key}`] || ''}
                      />
                      <TextField
                        fullWidth
                        label="Yanlış"
                        type="number"
                        value={aytScores[key]?.incorrect === '' ? '' : aytScores[key]?.incorrect ?? 0}
                        onChange={(e) => handleAYTScoreChange(key, 'incorrect', e.target.value)}
                        onFocus={() => handleFocusAYT(key, 'incorrect', aytScores[key]?.incorrect || 0)}
                        inputProps={{ min: 0, max: test.questionCount }}
                        sx={{
                          backgroundColor: '#e3f2fd',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f8fbff',
                            borderRadius: 2,
                          },
                        }}
                        error={!!errors[`AYT_${key}`]}
                        helperText={errors[`AYT_${key}`] || ''}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* OBP Girişi */}
          <Box>
            <TextField
              fullWidth
              label="Okul Bitirme Puanı (OBP)"
              type="number"
              value={obp}
              onChange={(e) => setObp(e.target.value)}
              helperText="100 üzerinden diploma notunuzu girin (en fazla 60 puan etki eder: not × 0.6)"
              inputProps={{ min: 0, max: 100 }}
              sx={{
                backgroundColor: '#e3f2fd',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fbff',
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Hesapla Butonu */}
          <Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<CalculateIcon />}
              onClick={calculateTotalScore}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1.15rem',
                py: 1.7,
                background: 'linear-gradient(90deg, #2196f3 0%, #64b5f6 100%)',
                boxShadow: '0 4px 16px rgba(33,150,243,0.18)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                  boxShadow: '0 6px 24px rgba(33,150,243,0.22)',
                },
              }}
            >
              Puanı Hesapla
            </Button>
          </Box>

          {/* Sonuçlar */}
          {results && (
            <Card sx={{
              backgroundColor: '#f8fbff',
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              border: '1px solid #e3f2fd',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hesaplama Sonuçları
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1">
                      TYT Ham Puanı: {results.tytScore.toFixed(2)}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      TYT Yerleştirme Puanı: {(results.tytScore + results.obpScore).toFixed(2)}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      2024 TYT Sıralaması: {results.tytRanking.toLocaleString()}
                    </Typography>
                  </Box>
                  {typeof results.aytScore === 'number' && (
                  <Box>
                    <Typography variant="subtitle1">
                      AYT Ham Puanı: {results.aytScore.toFixed(2)}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      AYT Yerleştirme Puanı: {(results.aytScore + results.obpScore).toFixed(2)}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      2024 {scoreType} Sıralaması: {results.aytRanking?.toLocaleString()}
                    </Typography>
                  </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </>
  );
};

export default ScoreCalculator; 