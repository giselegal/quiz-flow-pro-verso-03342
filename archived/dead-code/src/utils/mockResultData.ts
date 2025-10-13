import { StorageService } from '@/services/core/StorageService';
// @ts-nocheck
// Mock data para testar o componente de resultado
export const mockQuizResult = {
  primaryStyle: {
    category: 'Elegante',
    score: 25,
    percentage: 45,
  },
  secondaryStyles: [
    {
      category: 'Clássico',
      score: 15,
      percentage: 27,
    },
    {
      category: 'Contemporâneo',
      score: 10,
      percentage: 18,
    },
    {
      category: 'Natural',
      score: 6,
      percentage: 10,
    },
  ],
  totalSelections: 56,
  userName: 'Maria Silva',
};

// Função para carregar dados mock no localStorage
export const loadMockData = () => {
  StorageService.safeSetJSON('quizResult', mockQuizResult);
  console.log('Dados mock carregados:', mockQuizResult);
};

// Função para limpar dados mock
export const clearMockData = () => {
  StorageService.safeRemove('quizResult');
  StorageService.safeRemove('strategicAnswers');
  console.log('Dados mock limpos');
};
