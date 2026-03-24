import rankingData from '../../public/ayt_esit agirlik_puan_siralama_2024.json';
import sayisalRankingData from '../../public/ayt_sayisal_puan_siralama_2024.json';
import sozelRankingData from '../../public/ayt_sozel_puan_siralama_2024.json';
import dilRankingData from '../../public/ayt_dil_puan_siralama_2024.json';
import tytRankingData from '../../public/tyt_siralama_puan_manuellere_gore_sirali.json';

type ScoreType = 'SAYISAL' | 'ESIT_AGIRLIK' | 'SOZEL' | 'DIL' | 'TYT';

interface RankingData {
  [key: string]: number;
}

const getRankingData = (scoreType: ScoreType): RankingData => {
  switch (scoreType) {
    case 'SAYISAL':
      return sayisalRankingData;
    case 'ESIT_AGIRLIK':
      return rankingData;
    case 'SOZEL':
      return sozelRankingData;
    case 'DIL':
      return dilRankingData;
    case 'TYT':
      return tytRankingData;
    default:
      return rankingData;
  }
};

export const calculateRanking = (score: number, scoreType: ScoreType): number => {
  const rankingData = getRankingData(scoreType);
  
  // Convert the data to arrays for easier processing
  const scores = Object.values(rankingData);
  const ranks = Object.keys(rankingData).map(rankStr => parseInt(rankStr.replace(/\./g, ''), 10));
  
  // Sort ranks and scores based on scores in descending order
  const sortedData = Object.entries(rankingData)
    .map(([rankStr, scoreVal]) => ({ rank: parseInt(rankStr.replace(/\./g, ''), 10), score: scoreVal }))
    .sort((a, b) => b.score - a.score);

  // Find the closest scores
  let lowerScore = 0;
  let upperScore = 0;
  let lowerRank = 0;
  let upperRank = 0;
  
  // If the score is higher than the highest score in the data, return the highest rank (lowest number)
  if (score >= sortedData[0].score) {
    return sortedData[0].rank;
  }
  
  // If the score is lower than the lowest score in the data, return the lowest rank (highest number)
  if (score <= sortedData[sortedData.length - 1].score) {
    return sortedData[sortedData.length - 1].rank;
  }

  // Find the closest lower and upper scores for interpolation
  for (let i = 0; i < sortedData.length - 1; i++) {
    if (score <= sortedData[i].score && score >= sortedData[i + 1].score) {
      lowerScore = sortedData[i].score;
      upperScore = sortedData[i + 1].score;
      lowerRank = sortedData[i].rank;
      upperRank = sortedData[i + 1].rank;
      break;
    }
  }
  
  // Handle cases where the exact score is found or interpolation is not possible (shouldn't happen with proper data)
  if (lowerScore === upperScore) {
    return lowerRank; 
  }

  // Calculate interpolated rank
  const scoreDiff = lowerScore - upperScore; // This will be positive
  let finalLowerRank = lowerRank;
  let finalUpperRank = upperRank;

  // Ensure ranks are in increasing order for interpolation
  if (finalLowerRank > finalUpperRank) {
    [finalLowerRank, finalUpperRank] = [finalUpperRank, finalLowerRank];
  }

  const rankDiff = finalUpperRank - finalLowerRank;     // This will now always be positive or zero
  const scoreRatio = (lowerScore - score) / scoreDiff; // How far `score` is from `lowerScore` as a ratio of the total diff
  
  return Math.round(finalLowerRank + (rankDiff * scoreRatio));
}; 