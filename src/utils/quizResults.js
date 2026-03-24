import quizzes from '../../public/quizzes.json';

// Quiz sonuçlarını işleyen yardımcı fonksiyonlar

/**
 * Verilen cevaplara göre quiz sonucunu hesaplar
 * @param {string} quizId - Quiz ID'si
 * @param {Array} answers - Kullanıcının cevapları
 * @returns {Object} Quiz sonucu
 */
export const calculateQuizResult = (quizId, answers) => {
  // Cevapları topla ve en çok seçilen seçeneği bul
  const answerCounts = answers.reduce((acc, answer) => {
    acc[answer] = (acc[answer] || 0) + 1;
    return acc;
  }, {});

  // En çok seçilen cevabı bul
  const maxAnswer = Object.entries(answerCounts).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0];

  // Quiz ID'sine göre sonuç indeksini belirle
  let resultIndex;
  switch (quizId) {
    case 'uni-city':
      resultIndex = parseInt(maxAnswer) % 5; // 5 şehir seçeneği
      break;
    case 'mindset':
      resultIndex = parseInt(maxAnswer) % 5; // 5 bölüm seçeneği
      break;
    case 'future-career':
      resultIndex = parseInt(maxAnswer) % 5; // 5 kariyer seçeneği
      break;
    case 'friend-group-persona':
      resultIndex = parseInt(maxAnswer) % 5; // 5 karakter seçeneği
      break;
    case 'dorm-life-style':
      resultIndex = parseInt(maxAnswer) % 5; // 5 yurt tipi seçeneği
      break;
    default:
      resultIndex = 0;
  }

  return resultIndex;
};

/**
 * Quiz sonucunu göster
 * @param {string} quizId - Quiz ID'si
 * @param {number} resultIndex - Sonuç indeksi
 * @returns {Object} Sonuç detayları
 */
export const getQuizResult = (quizId, resultIndex) => {
  // İlgili quiz'i bul
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz || !quiz.results) {
    return null;
  }

  // Sonucu döndür
  return quiz.results[resultIndex];
};

/**
 * Quiz sonucunu göster ve paylaş
 * @param {string} quizId - Quiz ID'si
 * @param {Array} answers - Kullanıcının cevapları
 * @returns {Object} Sonuç detayları ve paylaşım bilgileri
 */
export const showAndShareResult = (quizId, answers) => {
  const resultIndex = calculateQuizResult(quizId, answers);
  const result = getQuizResult(quizId, resultIndex);

  if (!result) {
    return null;
  }

  // Paylaşım metni oluştur
  const shareText = `${result.title} çıktı! ${result.description}`;
  
  return {
    ...result,
    shareText,
    shareUrl: `${window.location.origin}/quiz/${quizId}/result/${resultIndex}`
  };
}; 