import { Department } from '../types/department';

// JSON verisindeki alanlar
interface JsonDepartment {
  "Üniversite Adı": string;
  "Bölüm": string;
  "Puan Türü": string;
  "Kontenjan / Yerleşen": string;
  "Taban Puanı": string;
  "Başarı Sırası": string;
  "Şehir": string;
  "Üniversite Türü": string;
  "Eğitim Dili": string;
  "Burs Oranı": string;
  "Eğitim Süresi": string;
}

// Yardımcı parse fonksiyonları
const parseScore = (scoreStr: string): number | null => {
  if (!scoreStr || scoreStr === 'Dolmadı' || scoreStr === '—' || scoreStr === '') return null;
  // Sadece ilk yılın puanını al (boşlukla ayrılmışsa)
  const first = scoreStr.split(' ')[0];
  if (first === 'Dolmadı' || first === '—') return null;
  return parseFloat(first.replace(',', '.'));
};

const parseRank = (rankStr: string): number | null => {
  if (!rankStr || rankStr === 'Dolmadı' || rankStr === '—' || rankStr === '') return null;
  // Sadece ilk yılın sırasını al (boşlukla ayrılmışsa)
  const first = rankStr.split(' ')[0];
  if (first === 'Dolmadı' || first === '—') return null;
  return parseInt(first.replace(/\./g, ''));
};

const parseQuota = (quotaStr: string): { total: number; placed: number } => {
  // Sadece ilk yılın kontenjan/yerleşen bilgisini al
  const first = quotaStr.split(' ')[0];
  const [totalStr, placedStr] = first.split('/');
  const total = parseInt(totalStr) || 0;
  const placed = placedStr && placedStr !== '—' ? parseInt(placedStr) : 0;
  return { total, placed };
};

const parseUniversityType = (type: string): 'Devlet' | 'Vakıf' | 'KKTC' => {
  if (!type) return 'KKTC';
  if (type.toLowerCase().includes('vakıf')) return 'Vakıf';
  if (type.toLowerCase().includes('devlet')) return 'Devlet';
  return 'KKTC';
};

export const readExcelData = async (filename: string): Promise<Department[]> => {
  try {
    console.log('JSON dosyası okunuyor...');
    const response = await fetch(`/${filename}`);
    if (!response.ok) {
      throw new Error('JSON dosyası yüklenemedi');
    }

    const jsonData: JsonDepartment[] = await response.json();
    const departments: Department[] = [];
    let validRowCount = 0;
    let invalidRowCount = 0;

    for (let i = 0; i < jsonData.length; i++) {
      const dept = jsonData[i];
      if (!dept["Üniversite Adı"] || !dept["Bölüm"]) {
        invalidRowCount++;
        continue;
      }

      const score = parseScore(dept["Taban Puanı"]);
      const rank = parseRank(dept["Başarı Sırası"]);
      const quota = parseQuota(dept["Kontenjan / Yerleşen"]);

      departments.push({
        id: `${dept["Üniversite Adı"]}-${dept["Bölüm"]}-${i}`,
        universityName: dept["Üniversite Adı"],
        departmentName: dept["Bölüm"],
        scoreType: dept["Puan Türü"],
        city: dept["Şehir"],
        universityType: parseUniversityType(dept["Üniversite Türü"]),
        language: dept["Eğitim Dili"],
        scholarship: dept["Burs Oranı"],
        duration: dept["Eğitim Süresi"],
        score,
        rank,
        quota: quota.total,
        placed: quota.placed,
        previousYears: {
          '2023': {
            score,
            rank,
            quota: quota.total,
            placed: quota.placed
          },
          '2022': {
            score: null,
            rank: null,
            quota: 0,
            placed: 0
          },
          '2021': {
            score: null,
            rank: null,
            quota: 0,
            placed: 0
          }
        }
      });
      validRowCount++;
    }

    console.log(`JSON işleme tamamlandı. Geçerli satır: ${validRowCount}, Geçersiz satır: ${invalidRowCount}`);
    return departments;
  } catch (error) {
    console.error('JSON okuma hatası:', error);
    throw error;
  }
}; 