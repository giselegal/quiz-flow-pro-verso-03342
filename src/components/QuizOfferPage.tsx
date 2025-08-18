// @ts-nocheck
// Componente migrado de src/pages_backup/QuizOfferPage.tsx para uso no roteador SPA

import { QuizOfferHero } from '@/components/quiz-offer/QuizOfferHero';
import { QuizOfferCTA } from '@/components/quiz-offer/QuizOfferCTA';
import { useUniversalNavigation } from '../hooks/useUniversalNavigation';

export default function QuizOfferPage() {
  const { navigate } = useUniversalNavigation();

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <QuizOfferHero onStartQuizClick={() => navigate('/')} />
      <QuizOfferCTA />
    </div>
  );
}
