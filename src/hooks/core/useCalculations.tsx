import { QuizAnswer, QuizResult } from '@/types/quiz';
import { useCallback, useEffect, useState } from 'react';

interface QuizCalculationHookProps {
  answers: QuizAnswer[];
  strategicAnswers?: Record<string, string>;
}

interface StyleScore {
  style: string;
  score: number;
  percentage: number;
}

interface CalculationResult {
  primaryStyle: StyleScore;
  secondaryStyles: StyleScore[];
  totalQuestions: number;
  answeredQuestions: number;
  isComplete: boolean;
}

/**
 * 🧮 HOOK DE CÁLCULOS DO QUIZ
 *
 * Calcula pontuação dos 8 estilos baseado nas respostas
 * Algoritmo otimizado para performance
 */
export const useCalculations = ({ answers, strategicAnswers = {} }: QuizCalculationHookProps) => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 8 estilos disponíveis
  const STYLES = [
    'natural',
    'classico',
    'contemporaneo',
    'elegante',
    'romantico',
    'sexy',
    'dramatico',
    'criativo',
  ];

  // Calcular pontuação por estilo
  const calculateScores = useCallback(() => {
    const scores: Record<string, number> = {};

    // Inicializar scores
    STYLES.forEach(style => {
      scores[style] = 0;
    });

    // Processar respostas (questões 1-10)
    answers.forEach(answer => {
      // Extrair estilo da resposta (formato: "natural_q1", "classico_q2", etc.)
      const parts = answer.optionId.split('_');
      if (parts.length >= 2) {
        const style = parts[0];
        if (STYLES.includes(style)) {
          scores[style] += 1;
        }
      }
    });

    // Converter para array e ordenar
    const styleScores: StyleScore[] = STYLES.map(style => ({
      style,
      score: scores[style],
      percentage: Math.round((scores[style] / 30) * 100), // 30 = máximo possível (10 questões × 3 seleções)
    })).sort((a, b) => b.score - a.score);

    const primaryStyle = styleScores[0];
    const secondaryStyles = styleScores.slice(1, 3); // Top 2 secundários

    return {
      primaryStyle,
      secondaryStyles,
      totalQuestions: 10,
      answeredQuestions: answers.length / 3, // 3 seleções por questão
      isComplete: answers.length >= 30, // 10 questões × 3 seleções
    };
  }, [answers]);

  // Gerar resultado final
  const generateResult = useCallback((): QuizResult | null => {
    if (!result || !result.isComplete) return null;

    const styleData = {
      natural: {
        name: 'Natural',
        description: 'Estilo despojado e confortável',
        colors: 'Tons neutros e terrosos',
        fabrics: 'Tecidos naturais e confortáveis',
        accessories: 'Peças discretas e funcionais',
      },
      classico: {
        name: 'Clássico',
        description: 'Elegância atemporal e sofisticada',
        colors: 'Cores sóbrias e tradicionais',
        fabrics: 'Tecidos de qualidade premium',
        accessories: 'Peças clássicas e refinadas',
      },
      contemporaneo: {
        name: 'Contemporâneo',
        description: 'Moderno com toque atual',
        colors: 'Paleta moderna e versátil',
        fabrics: 'Tecidos funcionais e estilosos',
        accessories: 'Peças modernas e práticas',
      },
      elegante: {
        name: 'Elegante',
        description: 'Sofisticação e refinamento',
        colors: 'Tons sofisticados e luxuosos',
        fabrics: 'Tecidos nobres e estruturados',
        accessories: 'Joias e peças de alto padrão',
      },
      romantico: {
        name: 'Romântico',
        description: 'Feminino e delicado',
        colors: 'Tons suaves e pastéis',
        fabrics: 'Tecidos fluidos e delicados',
        accessories: 'Peças delicadas e femininas',
      },
      sexy: {
        name: 'Sexy',
        description: 'Sensual e marcante',
        colors: 'Cores intensas e vibrantes',
        fabrics: 'Tecidos que valorizam o corpo',
        accessories: 'Peças chamativas e sensuais',
      },
      dramatico: {
        name: 'Dramático',
        description: 'Impactante e moderno',
        colors: 'Contrastes marcantes',
        fabrics: 'Tecidos estruturados e geométricos',
        accessories: 'Peças statement e impactantes',
      },
      criativo: {
        name: 'Criativo',
        description: 'Único e original',
        colors: 'Paleta ousada e diversificada',
        fabrics: 'Texturas interessantes e originais',
        accessories: 'Peças únicas e artísticas',
      },
    };

    const primaryData = styleData[result.primaryStyle.style as keyof typeof styleData];
    const secondaryData = result.secondaryStyles.map(
      s => styleData[s.style as keyof typeof styleData]
    );

    return {
      primaryStyle: {
        name: primaryData.name,
        percentage: result.primaryStyle.percentage,
        description: primaryData.description,
        colors: primaryData.colors,
        fabrics: primaryData.fabrics,
        accessories: primaryData.accessories,
        imageUrl: `/images/styles/${result.primaryStyle.style}.jpg`,
      },
      secondaryStyles: secondaryData.map((data, index) => ({
        name: data.name,
        percentage: result.secondaryStyles[index].percentage,
        description: data.description,
        imageUrl: `/images/styles/${result.secondaryStyles[index].style}.jpg`,
      })),
      totalQuestions: result.totalQuestions,
      answeredQuestions: result.answeredQuestions,
      strategicAnswers,
      completedAt: new Date().toISOString(),
    };
  }, [result, strategicAnswers]);

  // Executar cálculos quando answers mudam
  useEffect(() => {
    if (answers.length > 0) {
      setIsCalculating(true);

      // Simular delay de processamento para UX
      const timer = setTimeout(() => {
        const calculationResult = calculateScores();
        setResult(calculationResult);
        setIsCalculating(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [answers, calculateScores]);

  // Verificar se quiz está completo
  const isComplete = result?.isComplete || false;
  const canGenerateResult = isComplete && !isCalculating;

  return {
    // Estado
    result,
    isCalculating,
    isComplete,
    canGenerateResult,

    // Dados
    currentScores: result ? [result.primaryStyle, ...result.secondaryStyles] : [],
    progress: result ? Math.round((result.answeredQuestions / result.totalQuestions) * 100) : 0,

    // Ações
    generateResult,
    recalculate: () => {
      if (answers.length > 0) {
        const calculationResult = calculateScores();
        setResult(calculationResult);
      }
    },
  };
};
