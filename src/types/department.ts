export interface Department {
  id: string;
  universityName: string;
  departmentName: string;
  scoreType: string;
  city: string;
  universityType: 'Devlet' | 'Vakıf' | 'KKTC';
  language: string;
  scholarship: string;
  duration: string;
  score: number | null;
  rank: number | null;
  quota: number;
  placed: number;
  previousYears: {
    '2023': {
      score: number | null;
      rank: number | null;
      quota: number;
      placed: number;
    };
    '2022': {
      score: number | null;
      rank: number | null;
      quota: number;
      placed: number;
    };
    '2021': {
      score: number | null;
      rank: number | null;
      quota: number;
      placed: number;
    };
  };
} 