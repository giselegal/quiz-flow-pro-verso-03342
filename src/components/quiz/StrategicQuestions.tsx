
import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../QuizQuestion';
// Update the import path to the correct location of UserResponse
import { UserResponse } from '../../types/quiz';
import { strategicQuestions } from '../../data/strategicQuestions';
import { AnimatedWrapper } from '../ui/animated-wrapper';
import { preloadCriticalImages, preloadImagesByUrls } from '../../utils/imageManager';
import OptimizedImage from '../ui/OptimizedImage';
// import { getAllImages } from '@/data/imageBank'; // Importar para acessar o banco de imagens

// Imagens críticas da página de resultados a serem pré-carregadas
const RESULT_CRITICAL_IMAGES = [
  // URLs das imagens mais importantes da página de resultados
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745519979/Captura_de_tela_2025-03-31_034324_pmdn8y.webp'
];

interface StrategicQuestionsProps {
  currentQuestionIndex: number;
  answers: Record<string, string[]>;
  onAnswer: (response: UserResponse) => void;
}

export const StrategicQuestions: React.FC<StrategicQuestionsProps> = ({
  currentQuestionIndex,
  answers,
  onAnswer
}) => {
  const [mountKey, setMountKey] = useState(Date.now());
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const resultImagesPreloadStarted = useRef<boolean>(false);
  
  useEffect(() => {
    if (!imagesPreloaded) {
      // Preload da questão estratégica atual
      preloadCriticalImages(["strategic"]);
      setImagesPreloaded(true);
    }
    
    // Pré-carregamento progressivo das imagens de resultado
    // baseado no índice da questão estratégica atual
    if (!resultImagesPreloadStarted.current) {
      resultImagesPreloadStarted.current = true;
      
      // Agenda o pré-carregamento para começar após um pequeno delay
      // para não competir com os recursos da questão atual
      setTimeout(() => {
        console.log(`[Otimização] Iniciando pré-carregamento progressivo de imagens de resultado`);
        
        // Inicia o preload da categoria principal de resultado
        preloadCriticalImages(['results'], {
          quality: 80,
          batchSize: 2
        });
      }, 500); // Pequeno delay para não competir com recursos iniciais
    }
  }, [imagesPreloaded]);
  
  // Quando o índice da questão estratégica mudar, carregar mais imagens
  // de resultado em segundo plano, priorizando diferentes categorias
  useEffect(() => {
    // Remonta componente quando a questão muda para garantir estado limpo
    setMountKey(Date.now());
    
    // Carrega diferentes conjuntos de imagens com base no progresso
    if (currentQuestionIndex === 1) {
      // Na segunda questão estratégica, carrega transformações
      preloadCriticalImages(['transformation'], {
        quality: 75,
        batchSize: 2
      });
    } else if (currentQuestionIndex === 2) {
      // Na terceira questão, carrega bônus
      preloadCriticalImages(['bonus'], {
        quality: 75,
        batchSize: 2
      });
    } else if (currentQuestionIndex >= 3) {
      // Em questões posteriores, carrega depoimentos
      preloadCriticalImages(['testimonials'], {
        quality: 70,
        batchSize: 2
      });
      
      // Carrega imagens explícitas de alta prioridade
      preloadImagesByUrls(RESULT_CRITICAL_IMAGES, {
        quality: 85, 
        batchSize: 1
      });
    }
  }, [currentQuestionIndex]);

  if (currentQuestionIndex >= strategicQuestions.length) return null;

  return (
    <AnimatedWrapper key={mountKey} show={true}>
      <QuizQuestion
        question={strategicQuestions[currentQuestionIndex]}
        onAnswer={onAnswer}
        currentAnswers={answers[strategicQuestions[currentQuestionIndex].id] || []}
        autoAdvance={false}
        showQuestionImage={true}
        isStrategicQuestion={true}
      />
    </AnimatedWrapper>
  );
};

export default StrategicQuestions;
