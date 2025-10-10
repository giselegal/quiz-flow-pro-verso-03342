/**
 * TODO: MIGRAÇÃO EM ANDAMENTO (FASE 2) - QuizOfferPage
 * - [x] Remove @ts-nocheck
 * - [x] Adiciona tipos adequados
 * - [x] Integra logger utility
 * - [ ] Refina validações e tratamento de erros
 * - [ ] Otimiza performance se necessário
 * 
 * Componente migrado de src/pages_backup/QuizOfferPage.tsx para uso no roteador SPA
 */
import React from 'react';
import { QuizOfferHero } from '@/components/quiz-offer/QuizOfferHero';
import { QuizOfferCTA } from '@/components/quiz-offer/QuizOfferCTA';
import { useUniversalNavigation } from '../hooks/useUniversalNavigation';
import { appLogger } from '@/utils/logger';

const QuizOfferPage: React.FC = () => {
  const { navigate } = useUniversalNavigation();

  const handleStartQuizClick = () => {
    appLogger.info('QuizOfferPage: Usuário clicou para iniciar quiz');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <QuizOfferHero onStartQuizClick={handleStartQuizClick} />
      <QuizOfferCTA />
    </div>
  );
};

export default QuizOfferPage;
