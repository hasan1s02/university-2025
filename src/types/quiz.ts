export interface QuizOption {
  text: string;
}

export interface QuizQuestion {
  question: string;
  image: string;
  options: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  image: string;
  questions: QuizQuestion[];
} 