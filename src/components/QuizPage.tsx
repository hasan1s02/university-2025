import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Quiz } from '../types/quiz';
import QuizResult from './QuizResult';

const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0.5vw;
  background: #e3f0ff;
  @media (max-width: 1100px) {
    gap: 1rem;
    max-width: 100vw;
    padding: 0 0.5vw;
  }
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    gap: 2rem;
    padding: 0;
  }
`;

const QuizContainer = styled.div`
  flex: 2 1 0;
  width: 800px;
  max-width: 100%;
  min-width: 0;
  padding: 2rem 2.5rem 2rem 2.5rem;
  background: none;
  @media (max-width: 1100px) {
    padding: 1.2rem 0.5rem;
  }
`;

const QuestionCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
`;

const QuestionImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1.2rem;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased;
  transition: opacity 0.3s ease, max-height 0.3s;
  opacity: 0;
  max-height: 0;
  &.loaded {
    opacity: 1;
    max-height: 300px;
  }
`;

const QuestionText = styled.h2`
  font-size: 1.2rem;
  color: #222;
  margin-bottom: 1.2rem;
  font-weight: 600;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const OptionButton = styled(motion.button)<{ isSelected: boolean }>`
  padding: 1rem 1.5rem;
  border: 2px solid ${props => props.isSelected ? '#1976d2' : '#e0e0e0'};
  border-radius: 12px;
  background: ${props => props.isSelected ? '#E3F2FD' : 'white'};
  color: #222;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  box-shadow: ${props => props.isSelected ? '0 2px 8px #1976d233' : 'none'};
  &:hover {
    border-color: #1976d2;
    background: #F1F8FF;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: #1976d2;
  transition: width 0.3s;
`;

const FinishButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1256a3;
  }
  &:disabled {
    background: #b0b0b0;
    cursor: not-allowed;
  }
`;

// --- Blog Picks ---
const PicksContainer = styled.div`
  background: #f8fbff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(25, 118, 210, 0.08);
  padding: 1.2rem 0.7rem 1.2rem 0.7rem;
  min-width: 260px;
  max-width: 320px;
  width: 100%;
  margin-top: 0.5rem;
  margin-right: 0.5vw;
  position: sticky;
  top: 2.5rem;
  align-self: flex-start;
  @media (max-width: 1100px) {
    min-width: 200px;
    max-width: 260px;
    padding: 1rem 0.5rem;
  }
  @media (max-width: 900px) {
    max-width: 100%;
    min-width: 0;
    margin: 0 auto;
    position: static;
    align-self: stretch;
  }
`;
const PicksTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  color: #1976d2;
  margin-bottom: 1.2rem;
  letter-spacing: 0.5px;
`;
const BlogPickList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;
const BlogPickItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  cursor: pointer;
  border-radius: 12px;
  padding: 0.4rem 0.2rem 1.2rem 0.2rem;
  transition: background 0.18s;
  &:hover {
    background: #f1f6fd;
  }
  width: 100%;
`;
const BlogPickImg = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  background: #e0e7ef;
`;
const BlogPickTitle = styled.div`
  font-size: 1.13rem;
  font-weight: 700;
  color: #232946;
  line-height: 1.3;
  margin-top: 0.3rem;
  text-align: left;
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const BlogPickSummary = styled.div`
  font-size: 0.98rem;
  color: #6b7280;
  margin-top: 0.18rem;
  margin-bottom: 0.1rem;
  line-height: 1.45;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
`;

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);
  const [blogPicks, setBlogPicks] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({});

  // Yardımcı fonksiyon: Diziyi karıştırmak için Fisher-Yates algoritması
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    // Reset state when quiz ID changes
    setQuiz(null);
    setAnswers([]);
    setFinished(false);

    fetch('/quizzes.json')
      .then((res) => res.json())
      .then((data: Quiz[]) => {
        const found = data.find((q) => q.id === id);
        if (found) {
          setQuiz(found);
          setAnswers(Array(found.questions.length).fill(null));
        } else {
          // If quiz not found, redirect to quiz list
          navigate('/quiz');
        }
      })
      .catch((error) => {
        console.error('Error loading quiz:', error);
        navigate('/quiz');
      });
  }, [id, navigate]);

  useEffect(() => {
    fetch('/formatted_blogs.json')
      .then(res => res.json())
      .then(data => {
        const dataWithOriginalIds = data.map((blog, index) => ({ ...blog, originalId: index }));
        const shuffledData = shuffleArray([...dataWithOriginalIds]);
        const picks = shuffledData.slice(0, 4).map((blog) => ({
          id: blog.originalId,
          title: blog.title,
          image: blog.image || `/images/blog${blog.originalId + 1}.webp`,
          summary: blog.summary || '',
        }));
        setBlogPicks(picks);
        console.log('QuizPage: Blog Picks after setting:', picks);
      });
  }, []);

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  if (!quiz) return <div className="text-center py-10">Yükleniyor...</div>;

  const handleSelect = (qIdx: number, optIdx: number) => {
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? optIdx : a)));
  };

  const allAnswered = answers.every((a) => a !== null);

  if (finished) {
    return (
      <PageLayout>
        <QuizContainer>
          <QuizResult quizId={quiz.id} answers={answers} />
        </QuizContainer>
        <PicksContainer>
          <PicksTitle>Senin İçin Seçtiklerimiz</PicksTitle>
          <BlogPickList>
            {blogPicks.map((blog) => {
              return (
                <BlogPickItem key={blog.id} onClick={() => {
                  console.log('QuizPage: Navigating with blog.id:', blog.id);
                  navigate(`/blog/${blog.id}`);
                }}>
                  <BlogPickImg src={blog.image} alt={blog.title} />
                  <BlogPickTitle>{blog.title}</BlogPickTitle>
                  <BlogPickSummary>{blog.summary}</BlogPickSummary>
                </BlogPickItem>
              );
            })}
          </BlogPickList>
        </PicksContainer>
      </PageLayout>
    );
  }

  const progress = ((answers.filter(a => a !== null).length) / quiz.questions.length) * 100;

  return (
    <PageLayout>
      <QuizContainer>
        <ProgressBar>
          <Progress progress={progress} />
        </ProgressBar>
        {quiz.questions.map((question, qIdx) => (
          <QuestionCard
            key={qIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qIdx * 0.05 }}
          >
            {question.image && question.image.trim() !== "" && (
              <QuestionImage 
                src={question.image} 
                alt="Soru görseli" 
                loading="lazy"
                className={loadedImages[question.image] ? 'loaded' : ''}
                onLoad={() => handleImageLoad(question.image)}
              />
            )}
            <QuestionText>{qIdx + 1}. {question.question}</QuestionText>
            <OptionsContainer>
              {question.options.map((opt, optIdx) => (
                <OptionButton
                  key={optIdx}
                  isSelected={answers[qIdx] === optIdx}
                  onClick={() => handleSelect(qIdx, optIdx)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {opt}
                </OptionButton>
              ))}
            </OptionsContainer>
          </QuestionCard>
        ))}
        <FinishButton
          onClick={() => setFinished(true)}
          disabled={!allAnswered}
        >
          Testi Bitir
        </FinishButton>
      </QuizContainer>
      <PicksContainer>
        <PicksTitle>Senin İçin Seçtiklerimiz</PicksTitle>
        <BlogPickList>
          {blogPicks.map((blog) => {
            return (
              <BlogPickItem key={blog.id} onClick={() => {
                console.log('QuizPage: Navigating with blog.id:', blog.id);
                navigate(`/blog/${blog.id}`);
              }}>
                <BlogPickImg src={blog.image} alt={blog.title} />
                <BlogPickTitle>{blog.title}</BlogPickTitle>
                <BlogPickSummary>{blog.summary}</BlogPickSummary>
              </BlogPickItem>
            );
          })}
        </BlogPickList>
      </PicksContainer>
    </PageLayout>
  );
};

export default QuizPage; 