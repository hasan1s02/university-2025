import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showAndShareResult } from '../utils/quizResults';
import quizzes from '../../public/quizzes.json';
import styled from 'styled-components';

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.12);
  max-width: 700px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #1976d2, #64b5f6);
  }
`;

const ResultImage = styled.img`
  width: 320px;
  height: 200px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  border: 3px solid #e3f2fd;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
  transition: transform 0.3s ease;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased;
  opacity: 0;
  &.loaded {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const ResultTitle = styled.h2`
  font-size: 2rem;
  color: #1976d2;
  margin-bottom: 0.8rem;
  font-weight: 800;
  background: linear-gradient(45deg, #1976d2, #64b5f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ResultDescription = styled.p`
  font-size: 1rem;
  color: #444;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const ShareButton = styled.button`
  padding: 1rem 2rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
`;

const RetryButton = styled.button`
  padding: 1rem 2rem;
  background: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
  }
`;

const OtherQuizzesSection = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 2.5rem;
`;

const OtherQuizzesTitle = styled.h3`
  font-size: 1.8rem;
  color: #1976d2;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-align: center;
`;

const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
  justify-items: center;
`;

const QuizCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  max-width: 320px;
  width: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(25, 118, 210, 0.15);
  }
`;

const QuizImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  background: #e3f2fd;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased;
  transition: opacity 0.3s ease;
  opacity: 0;
  margin-bottom: 0.8rem;
  &.loaded {
    opacity: 1;
  }
`;

const QuizContent = styled.div`
  flex: 1;
`;

const QuizTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 0.5rem;
`;

const QuizDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const getRandomQuizzes = (currentQuizId, count = 3) => {
  const others = quizzes.filter(q => q.id !== currentQuizId);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  return others.slice(0, count);
};

const QuizResult = ({ quizId, answers }) => {
  const result = showAndShareResult(quizId, answers);
  const navigate = useNavigate();
  const randomQuizzes = getRandomQuizzes(quizId, 3);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageLoad = (imageUrl) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  if (!result) {
    return <div>Sonuç bulunamadı.</div>;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: result.title,
        text: result.shareText,
        url: result.shareUrl
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(result.shareText + '\n' + result.shareUrl);
      alert('Sonuç kopyalandı!');
    }
  };

  return (
    <ResultContainer>
      <ResultCard>
        <ResultImage 
          src={result.image} 
          alt={result.title} 
          loading="lazy"
          className={loadedImages[result.image] ? 'loaded' : ''}
          onLoad={() => handleImageLoad(result.image)}
        />
        <ResultTitle>{result.title}</ResultTitle>
        <ResultDescription>{result.description}</ResultDescription>
        <ButtonContainer>
          <ShareButton onClick={handleShare}>
            <span>Sonucu Paylaş</span>
          </ShareButton>
          <RetryButton onClick={() => window.location.reload()}>
            Tekrar Dene
          </RetryButton>
        </ButtonContainer>
      </ResultCard>

      <OtherQuizzesSection>
        <OtherQuizzesTitle>Diğer Testler</OtherQuizzesTitle>
        <QuizGrid>
          {randomQuizzes.map(q => (
            <QuizCard key={q.id} onClick={() => navigate(`/quiz/${q.id}`)}>
              <QuizImage 
                src={q.image} 
                alt={q.title} 
                loading="lazy"
                className={loadedImages[q.image] ? 'loaded' : ''}
                onLoad={() => handleImageLoad(q.image)}
              />
              <QuizContent>
                <QuizTitle>{q.title}</QuizTitle>
                <QuizDescription>{q.description}</QuizDescription>
              </QuizContent>
            </QuizCard>
          ))}
        </QuizGrid>
      </OtherQuizzesSection>
    </ResultContainer>
  );
};

export default QuizResult;