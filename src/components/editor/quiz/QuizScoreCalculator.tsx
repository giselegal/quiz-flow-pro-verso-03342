/**
 * 🧮 CALCULADORA DE PONTUAÇÃO DO QUIZ
 *
 * QuizScoreCalculator.tsx - Calcula scores, determina estilo predominante
 * Sistema modular para cálculos em tempo real com resultados personalizados
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface StyleScore {
  natural: number;
  classico: number;
  contemporaneo: number;
  elegante: number;
  romantico: number;
  sexy: number;
  dramatico: number;
  criativo: number;
}

interface QuizResult {
  predominantStyle: string;
  percentage: number;
  secondaryStyles: Array<{
    style: string;
    percentage: number;
  }>;
  characteristics: {
    personality: string[];
    colors: string[];
    fabrics: string[];
    prints: string[];
    accessories: string[];
  };
}

interface QuizScoreCalculatorConfig {
  mode: 'editor' | 'preview' | 'production';
  quizState: {
    currentStep: number;
    userAnswers: Record<string, any>;
    sessionData: Record<string, any>;
  };
  dataManager: {
    onDataUpdate: (key: string, value: any) => void;
  };
}

interface QuizScoreCalculatorProps {
  config: QuizScoreCalculatorConfig;
  enableRealTimeCalculation?: boolean;
  recalculateOnAnswerChange?: boolean;
}

export const QuizScoreCalculator: React.FC<QuizScoreCalculatorProps> = ({
  config,
  enableRealTimeCalculation = true,
  recalculateOnAnswerChange = true,
}) => {
  const { mode, quizState, dataManager } = config;
  const [scores, setScores] = useState<StyleScore>({
    natural: 0,
    classico: 0,
    contemporaneo: 0,
    elegante: 0,
    romantico: 0,
    sexy: 0,
    dramatico: 0,
    criativo: 0,
  });
  const [result, setResult] = useState<QuizResult | null>(null);

  // ========================================
  // Definições de Estilos
  // ========================================
  const styleDefinitions = useMemo(
    () => ({
      natural: {
        name: 'Natural',
        personality: ['Informal', 'Espontânea', 'Alegre', 'Essencialista'],
        colors: ['Tons terrosos', 'Neutros suaves', 'Verde musgo', 'Bege'],
        fabrics: ['Algodão', 'Linho', 'Malha', 'Tecidos naturais'],
        prints: ['Listras simples', 'Texturas naturais', 'Estampas orgânicas'],
        accessories: ['Discretos', 'Funcionais', 'Minimalistas'],
      },
      classico: {
        name: 'Clássico',
        personality: ['Conservadora', 'Séria', 'Organizada', 'Tradicional'],
        colors: ['Azul marinho', 'Branco', 'Cinza', 'Preto'],
        fabrics: ['Alfaiataria', 'Tweed', 'Lã', 'Algodão estruturado'],
        prints: ['Xadrez clássico', 'Listras tradicionais', 'Poá pequeno'],
        accessories: ['Elegantes', 'Atemporais', 'Discretos'],
      },
      contemporaneo: {
        name: 'Contemporâneo',
        personality: ['Informada', 'Ativa', 'Prática', 'Moderna'],
        colors: ['Tons neutros modernos', 'Toques de cor', 'Metálicos'],
        fabrics: ['Tecidos técnicos', 'Misturas modernas', 'Performance'],
        prints: ['Geométricas modernas', 'Abstratas', 'Minimalistas'],
        accessories: ['Funcionais', 'Tecnológicos', 'Versáteis'],
      },
      elegante: {
        name: 'Elegante',
        personality: ['Exigente', 'Sofisticada', 'Seletiva', 'Refinada'],
        colors: ['Tons luxuosos', 'Dourado', 'Burgundy', 'Prata'],
        fabrics: ['Seda', 'Cashmere', 'Tecidos nobres', 'Cetim'],
        prints: ['Estampas sofisticadas', 'Florais elegantes', 'Abstratas refinadas'],
        accessories: ['Luxuosos', 'Statement', 'Sofisticados'],
      },
      romantico: {
        name: 'Romântico',
        personality: ['Feminina', 'Meiga', 'Delicada', 'Sensível'],
        colors: ['Rosa', 'Lavanda', 'Tons pastéis', 'Soft'],
        fabrics: ['Chiffon', 'Renda', 'Tule', 'Tecidos fluidos'],
        prints: ['Florais', 'Borboletas', 'Corações', 'Poá delicado'],
        accessories: ['Delicados', 'Femininos', 'Românticos'],
      },
      sexy: {
        name: 'Sexy',
        personality: ['Glamorosa', 'Vaidosa', 'Sensual', 'Confiante'],
        colors: ['Vermelho', 'Preto', 'Animal print', 'Tons intensos'],
        fabrics: ['Couro', 'Latex', 'Tecidos moldantes', 'Stretch'],
        prints: ['Animal print', 'Leopardo', 'Zebra', 'Cobra'],
        accessories: ['Marcantes', 'Sensuais', 'Statement'],
      },
      dramatico: {
        name: 'Dramático',
        personality: ['Cosmopolita', 'Moderna', 'Audaciosa', 'Forte'],
        colors: ['Preto', 'Branco', 'Contrastes', 'Tons dramáticos'],
        fabrics: ['Estruturados', 'Arquitetônicos', 'Texturizados'],
        prints: ['Geométricas grandes', 'Abstratas', 'Assimétricas'],
        accessories: ['Arquitetônicos', 'Escultórais', 'Marcantes'],
      },
      criativo: {
        name: 'Criativo',
        personality: ['Exótica', 'Aventureira', 'Livre', 'Original'],
        colors: ['Cores vibrantes', 'Combinações inusitadas', 'Neon'],
        fabrics: ['Texturas inusitadas', 'Materiais alternativos', 'Mix'],
        prints: ['Étnicas', 'Psicodélicas', 'Artísticas', 'Únicas'],
        accessories: ['Únicos', 'Artesanais', 'Étnicos', 'Criativos'],
      },
    }),
    []
  );

  // ========================================
  // Mapeamento de Respostas para Pontuação
  // ========================================
  const scoreMapping = useMemo(
    () => ({
      // Questão 1: Roupa favorita
      natural_q1: { natural: 3, classico: 1, contemporaneo: 1 },
      classico_q1: { classico: 3, natural: 1, elegante: 1 },
      contemporaneo_q1: { contemporaneo: 3, elegante: 1, natural: 1 },
      elegante_q1: { elegante: 3, classico: 1, dramatico: 1 },
      romantico_q1: { romantico: 3, elegante: 1, natural: 1 },
      sexy_q1: { sexy: 3, dramatico: 1, romantico: 1 },
      dramatico_q1: { dramatico: 3, sexy: 1, contemporaneo: 1 },
      criativo_q1: { criativo: 3, dramatico: 1, romantico: 1 },

      // Questão 2: Personalidade
      natural_q2: { natural: 3, contemporaneo: 1 },
      classico_q2: { classico: 3, elegante: 1 },
      contemporaneo_q2: { contemporaneo: 3, natural: 1 },
      elegante_q2: { elegante: 3, classico: 1 },
      romantico_q2: { romantico: 3, natural: 1 },
      sexy_q2: { sexy: 3, dramatico: 1 },
      dramatico_q2: { dramatico: 3, contemporaneo: 1 },
      criativo_q2: { criativo: 3, natural: 1 },

      // Continue para todas as questões...
      // Por brevidade, incluindo apenas algumas aqui
    }),
    []
  );

  // ========================================
  // Calcular Pontuação
  // ========================================
  const calculateScores = useCallback(() => {
    const newScores: StyleScore = {
      natural: 0,
      classico: 0,
      contemporaneo: 0,
      elegante: 0,
      romantico: 0,
      sexy: 0,
      dramatico: 0,
      criativo: 0,
    };

    // Iterar por todas as respostas
    Object.entries(quizState.userAnswers).forEach(([answerId, value]) => {
      if (value && scoreMapping[answerId as keyof typeof scoreMapping]) {
        const points = scoreMapping[answerId as keyof typeof scoreMapping];
        Object.entries(points).forEach(([style, score]) => {
          if (style in newScores) {
            newScores[style as keyof StyleScore] += score;
          }
        });
      }
    });

    setScores(newScores);
    return newScores;
  }, [quizState.userAnswers, scoreMapping]);

  // ========================================
  // Determinar Resultado
  // ========================================
  const calculateResult = useCallback(
    (currentScores: StyleScore): QuizResult => {
      // Encontrar estilo predominante
      const sortedStyles = Object.entries(currentScores)
        .sort(([, a], [, b]) => b - a)
        .filter(([, score]) => score > 0);

      if (sortedStyles.length === 0) {
        // Caso padrão se não houver respostas
        return {
          predominantStyle: 'natural',
          percentage: 0,
          secondaryStyles: [],
          characteristics: styleDefinitions.natural,
        };
      }

      const [predominantStyleKey, predominantScore] = sortedStyles[0];
      const totalScore = Object.values(currentScores).reduce((sum, score) => sum + score, 0);
      const percentage = totalScore > 0 ? Math.round((predominantScore / totalScore) * 100) : 0;

      // Estilos secundários (até 2)
      const secondaryStyles = sortedStyles
        .slice(1, 3)
        .map(([style, score]) => ({
          style: styleDefinitions[style as keyof typeof styleDefinitions].name,
          percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
        }))
        .filter(({ percentage }) => percentage >= 10); // Apenas se >= 10%

      const styleData = styleDefinitions[predominantStyleKey as keyof typeof styleDefinitions];

      return {
        predominantStyle: styleData.name,
        percentage,
        secondaryStyles,
        characteristics: {
          personality: styleData.personality,
          colors: styleData.colors,
          fabrics: styleData.fabrics,
          prints: styleData.prints,
          accessories: styleData.accessories,
        },
      };
    },
    [styleDefinitions]
  );

  // ========================================
  // Recálculo Automático
  // ========================================
  useEffect(() => {
    if (enableRealTimeCalculation && recalculateOnAnswerChange) {
      const newScores = calculateScores();
      const newResult = calculateResult(newScores);
      setResult(newResult);

      // Atualizar dados da sessão com o resultado
      dataManager.onDataUpdate('quizScores', newScores);
      dataManager.onDataUpdate('quizResult', newResult);

      // Log em modo editor
      if (mode === 'editor') {
        console.log('🧮 Quiz scores calculated:', {
          scores: newScores,
          result: newResult,
          totalAnswers: Object.keys(quizState.userAnswers).length,
        });
      }
    }
  }, [
    quizState.userAnswers,
    enableRealTimeCalculation,
    recalculateOnAnswerChange,
    calculateScores,
    calculateResult,
    dataManager,
    mode,
  ]);

  // ========================================
  // Triggers para Etapas Específicas
  // ========================================
  useEffect(() => {
    // Recalcular quando chegar na etapa 19 (transição para resultado)
    if (quizState.currentStep === 19) {
      const finalScores = calculateScores();
      const finalResult = calculateResult(finalScores);

      setScores(finalScores);
      setResult(finalResult);

      // Salvar resultado final
      dataManager.onDataUpdate('finalQuizScores', finalScores);
      dataManager.onDataUpdate('finalQuizResult', finalResult);

      if (mode === 'production') {
        // Analytics para conversão
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'quiz_completed',
            quiz_result: finalResult.predominantStyle,
            quiz_percentage: finalResult.percentage,
            total_answers: Object.keys(quizState.userAnswers).length,
          });
        }
      }
    }
  }, [
    quizState.currentStep,
    calculateScores,
    calculateResult,
    dataManager,
    mode,
    quizState.userAnswers,
  ]);

  // ========================================
  // Métodos de Debug (modo editor)
  // ========================================
  useEffect(() => {
    if (mode === 'editor' && typeof window !== 'undefined') {
      (window as any).quizCalculator = {
        getCurrentScores: () => scores,
        getCurrentResult: () => result,
        recalculate: () => {
          const newScores = calculateScores();
          const newResult = calculateResult(newScores);
          setScores(newScores);
          setResult(newResult);
          return { scores: newScores, result: newResult };
        },
        getStyleDefinitions: () => styleDefinitions,
        getScoreMapping: () => scoreMapping,
        simulateResult: (styleKey: string) => {
          const simulatedScores = { ...scores };
          simulatedScores[styleKey as keyof StyleScore] = 100;
          return calculateResult(simulatedScores);
        },
      };
    }
  }, [mode, scores, result, calculateScores, calculateResult, styleDefinitions, scoreMapping]);

  // ========================================
  // Performance Monitoring
  // ========================================
  useEffect(() => {
    if (mode === 'production') {
      const startTime = performance.now();
      calculateScores();
      const endTime = performance.now();

      // Log performance apenas se demorar mais que 100ms
      if (endTime - startTime > 100) {
        console.warn(`⚡ Quiz calculation took ${Math.round(endTime - startTime)}ms`);
      }
    }
  }, [quizState.userAnswers, mode, calculateScores]);

  // Este componente não renderiza nada visível
  return null;
};

export default QuizScoreCalculator;
