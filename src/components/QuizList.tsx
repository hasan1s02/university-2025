import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Quiz } from '../types/quiz';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #e3f0ff;
  padding: 3rem 0 2rem 0;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: #1976d2;
  margin-bottom: 2.5rem;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 2.5rem;
  max-width: 1300px;
  margin: 0 auto;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    gap: 2rem;
  }
`;

const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2.5rem;
  min-width: 0;
  flex: 2;
`;

const QuizCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.10);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.25s, transform 0.18s;
  &:hover {
    box-shadow: 0 16px 48px rgba(25, 118, 210, 0.18);
    transform: translateY(-6px) scale(1.025);
  }
  min-height: 370px;
  border: none;
`;

const QuizImage = styled.img`
  width: 100%;
  height: 230px;
  object-fit: cover;
  background: #f0f4fa;
  display: block;
  border: none;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased;
  transition: opacity 0.3s ease;
  opacity: 0;
  &.loaded {
    opacity: 1;
  }
`;

const QuizContent = styled.div`
  flex: 1;
  padding: 1.6rem 1.6rem 1.3rem 1.6rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const QuizTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1976d2;
  margin: 1.1rem 0 0.4rem 0;
  text-align: left;
  letter-spacing: 0.01em;
`;

const QuizDesc = styled.p`
  color: #444;
  font-size: 1.08rem;
  margin-bottom: 1.2rem;
  margin-top: 0.1rem;
  flex: 1;
  text-align: left;
  line-height: 1.6;
`;

const SolveButton = styled.button`
  background: #1976d2;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px #1976d233;
  &:hover {
    background: #1256a3;
  }
`;

// --- Blog Picks ---
const PicksContainer = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(25, 118, 210, 0.10);
  padding: 1.5rem 1.2rem;
  min-width: 290px;
  max-width: 340px;
  width: 100%;
  margin-top: 0.5rem;
  @media (max-width: 900px) {
    max-width: 100%;
    min-width: 0;
    margin: 0 auto;
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
  align-items: center;
  gap: 0.9rem;
  cursor: pointer;
  border-radius: 10px;
  padding: 0.4rem 0.2rem;
  transition: background 0.18s;
  &:hover {
    background: #f1f6fd;
  }
`;
const BlogPickImg = styled.img`
  width: 62px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #e0e7ef;
`;
const BlogPickTitle = styled.div`
  font-size: 1.01rem;
  font-weight: 600;
  color: #232946;
  line-height: 1.2;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [blogPicks, setBlogPicks] = useState<any[]>([]);
  const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  useEffect(() => {
    fetch('/quizzes.json')
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  useEffect(() => {
    fetch('/formatted_blogs.json')
      .then(res => res.json())
      .then(data => {
        // İlk 4 blogu al
        const picks = data.slice(0, 4).map((blog: any, idx: number) => ({
          id: idx,
          title: blog.title,
          image: blog.image || `https://source.unsplash.com/random/120x80?blog,${idx}`,
        }));
        setBlogPicks(picks);
      });
  }, []);

  return (
    <PageContainer>
      <Title>Üniversite Tercihi İçin Eğlenceli Testler</Title>
      <MainContent>
        <QuizGrid>
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id}>
              {quiz.image && (
                <QuizImage 
                  src={quiz.image} 
                  alt={quiz.title} 
                  loading="lazy"
                  className={loadedImages[quiz.image] ? 'loaded' : ''}
                  onLoad={() => handleImageLoad(quiz.image)}
                />
              )}
              <QuizContent>
                <QuizTitle>{quiz.title}</QuizTitle>
                <QuizDesc>{quiz.description}</QuizDesc>
                <SolveButton onClick={() => navigate(`/quiz/${quiz.id}`)}>
                  Testi Çöz
                </SolveButton>
              </QuizContent>
            </QuizCard>
          ))}
        </QuizGrid>
      </MainContent>
    </PageContainer>
  );
};

export default QuizList; 