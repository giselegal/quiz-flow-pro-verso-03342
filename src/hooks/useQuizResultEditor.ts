/**
 * 🎯 FASE 3 - QUIZ RESULT EDITOR HOOK
 * 
 * Sistema completo para edição de resultados do quiz
 * Permite alternar entre estilos e customizar conteúdo
 */

import { useState, useCallback } from 'react';

export interface QuizStyleResult {
  id: string;
  style: string;
  category: string;
  percentage: number;
  score: number;
  description: string;
  image?: string;
  color?: string;
  characteristics: string[];
  recommendations: string[];
}

export interface QuizResultData {
  primaryStyle: QuizStyleResult;
  secondaryStyles: QuizStyleResult[];
  userName: string;
  completedAt: string;
  totalScore: number;
  styleScores: Record<string, number>;
}

export interface ResultEditorState {
  currentResult: QuizResultData;
  availableStyles: QuizStyleResult[];
  isEditing: boolean;
  previewMode: 'single' | 'multiple' | 'comparison';
  customizations: {
    colors: Record<string, string>;
    texts: Record<string, string>;
    images: Record<string, string>;
  };
}

// Estilos disponíveis para preview
const AVAILABLE_STYLES: QuizStyleResult[] = [
  {
    id: 'classico',
    style: 'Clássico',
    category: 'Clássico',
    percentage: 85,
    score: 85,
    description: 'Seu estilo clássico reflete elegância e sofisticação. Você aprecia peças atemporais e bem estruturadas que transmitem confiança e profissionalismo.',
    color: '#8B4513',
    characteristics: [
      'Elegância atemporal',
      'Peças bem estruturadas',
      'Cores neutras e sofisticadas',
      'Qualidade sobre quantidade'
    ],
    recommendations: [
      'Invista em peças-chave de qualidade',
      'Priorize alfaiataria impecável',
      'Escolha acessórios discretos',
      'Mantenha uma paleta neutra'
    ]
  },
  {
    id: 'romantico',
    style: 'Romântico',
    category: 'Romântico',
    percentage: 75,
    score: 75,
    description: 'Seu estilo romântico expressa feminilidade e delicadeza. Você adora detalhes suaves, texturas fluidas e peças que realçam sua sensibilidade.',
    color: '#D4637A',
    characteristics: [
      'Feminilidade delicada',
      'Texturas fluidas e suaves',
      'Detalhes românticos',
      'Cores suaves e pastéis'
    ],
    recommendations: [
      'Use tecidos fluidos como seda e chiffon',
      'Adicione detalhes como babados e rendas',
      'Escolha cores suaves e femininas',
      'Invista em acessórios delicados'
    ]
  },
  {
    id: 'dramatico',
    style: 'Dramático',
    category: 'Dramático',
    percentage: 80,
    score: 80,
    description: 'Seu estilo dramático é marcante e impactante. Você não tem medo de se destacar e adora peças statement que expressam sua personalidade forte.',
    color: '#4B0082',
    characteristics: [
      'Presença marcante',
      'Peças statement',
      'Contrastes fortes',
      'Silhuetas estruturadas'
    ],
    recommendations: [
      'Use peças com impacto visual',
      'Aposte em contrastes marcantes',
      'Escolha silhuetas geométricas',
      'Adicione acessórios statement'
    ]
  },
  {
    id: 'natural',
    style: 'Natural',
    category: 'Natural',
    percentage: 70,
    score: 70,
    description: 'Seu estilo natural prioriza conforto e autenticidade. Você prefere peças descomplicadas que permitem movimento livre e expressão genuína.',
    color: '#228B22',
    characteristics: [
      'Conforto e praticidade',
      'Texturas naturais',
      'Silhuetas relaxadas',
      'Cores terrosas'
    ],
    recommendations: [
      'Priorize tecidos naturais',
      'Escolha silhuetas confortáveis',
      'Use cores terrosas e neutras',
      'Evite excessos e complicações'
    ]
  },
  {
    id: 'criativo',
    style: 'Criativo',
    category: 'Criativo',
    percentage: 90,
    score: 90,
    description: 'Seu estilo criativo é único e experimental. Você adora misturar estampas, texturas e cores de forma inovadora, criando looks únicos.',
    color: '#FF6347',
    characteristics: [
      'Experimentação constante',
      'Mix de estampas e texturas',
      'Cores vibrantes',
      'Peças únicas e artísticas'
    ],
    recommendations: [
      'Misture estampas com confiança',
      'Experimente combinações inusitadas',
      'Invista em peças artísticas',
      'Use cores vibrantes e contrastantes'
    ]
  }
];

/**
 * Hook principal para edição de resultados
 */
export const useQuizResultEditor = () => {
  const [editorState, setEditorState] = useState<ResultEditorState>({
    currentResult: {
      primaryStyle: AVAILABLE_STYLES[0],
      secondaryStyles: [AVAILABLE_STYLES[1], AVAILABLE_STYLES[3]],
      userName: 'Maria Silva',
      completedAt: new Date().toISOString(),
      totalScore: 85,
      styleScores: {
        classico: 85,
        romantico: 75,
        natural: 70,
        dramatico: 80,
        criativo: 60
      }
    },
    availableStyles: AVAILABLE_STYLES,
    isEditing: false,
    previewMode: 'single',
    customizations: {
      colors: {},
      texts: {},
      images: {}
    }
  });

  // Alternar estilo principal
  const switchPrimaryStyle = useCallback((styleId: string) => {
    const newStyle = AVAILABLE_STYLES.find(s => s.id === styleId);
    if (!newStyle) return;

    setEditorState(prev => ({
      ...prev,
      currentResult: {
        ...prev.currentResult,
        primaryStyle: newStyle,
        totalScore: newStyle.score
      }
    }));
  }, []);

  // Atualizar estilos secundários
  const updateSecondaryStyles = useCallback((styleIds: string[]) => {
    const newStyles = styleIds.map(id => 
      AVAILABLE_STYLES.find(s => s.id === id)
    ).filter(Boolean) as QuizStyleResult[];

    setEditorState(prev => ({
      ...prev,
      currentResult: {
        ...prev.currentResult,
        secondaryStyles: newStyles
      }
    }));
  }, []);

  // Customizar texto
  const updateText = useCallback((key: string, value: string) => {
    setEditorState(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        texts: {
          ...prev.customizations.texts,
          [key]: value
        }
      }
    }));
  }, []);

  // Customizar cor
  const updateColor = useCallback((key: string, value: string) => {
    setEditorState(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        colors: {
          ...prev.customizations.colors,
          [key]: value
        }
      }
    }));
  }, []);

  // Customizar imagem
  const updateImage = useCallback((key: string, value: string) => {
    setEditorState(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        images: {
          ...prev.customizations.images,
          [key]: value
        }
      }
    }));
  }, []);

  // Alternar modo de preview
  const setPreviewMode = useCallback((mode: 'single' | 'multiple' | 'comparison') => {
    setEditorState(prev => ({
      ...prev,
      previewMode: mode
    }));
  }, []);

  // Ativar/desativar modo de edição
  const toggleEditMode = useCallback(() => {
    setEditorState(prev => ({
      ...prev,
      isEditing: !prev.isEditing
    }));
  }, []);

  // Gerar resultado simulado baseado em seleções mockadas
  const generateMockResult = useCallback((mockAnswers?: Record<number, string[]>) => {
    if (!mockAnswers) {
      // Usar resultado padrão
      return;
    }

    // Simular cálculo de estilo baseado nas respostas
    const styleScores = AVAILABLE_STYLES.reduce((acc, style) => {
      // Simular pontuação baseada nas respostas mockadas
      let score = Math.random() * 40 + 50; // 50-90 pontos
      
      // Adicionar bonus baseado em certas respostas
      Object.values(mockAnswers).forEach(answers => {
        if (answers.includes('opcao1') && style.id === 'classico') score += 10;
        if (answers.includes('opcao2') && style.id === 'romantico') score += 10;
        if (answers.includes('opcao3') && style.id === 'dramatico') score += 10;
        if (answers.includes('opcao4') && style.id === 'natural') score += 10;
        if (answers.includes('opcao5') && style.id === 'criativo') score += 10;
      });

      acc[style.id] = Math.min(Math.round(score), 100);
      return acc;
    }, {} as Record<string, number>);

    // Encontrar estilo com maior pontuação
    const topStyleId = Object.entries(styleScores)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    const primaryStyle = AVAILABLE_STYLES.find(s => s.id === topStyleId)!;
    
    // Estilos secundários (2º e 3º colocados)
    const secondaryStyleIds = Object.entries(styleScores)
      .sort(([,a], [,b]) => b - a)
      .slice(1, 3)
      .map(([id]) => id);
    
    const secondaryStyles = secondaryStyleIds.map(id => 
      AVAILABLE_STYLES.find(s => s.id === id)!
    );

    setEditorState(prev => ({
      ...prev,
      currentResult: {
        ...prev.currentResult,
        primaryStyle: {
          ...primaryStyle,
          percentage: styleScores[topStyleId],
          score: styleScores[topStyleId]
        },
        secondaryStyles: secondaryStyles.map(style => ({
          ...style,
          percentage: styleScores[style.id],
          score: styleScores[style.id]
        })),
        totalScore: styleScores[topStyleId],
        styleScores
      }
    }));
  }, []);

  // Obter texto customizado ou padrão
  const getCustomText = useCallback((key: string, defaultValue: string) => {
    return editorState.customizations.texts[key] || defaultValue;
  }, [editorState.customizations.texts]);

  // Obter cor customizada ou padrão
  const getCustomColor = useCallback((key: string, defaultValue: string) => {
    return editorState.customizations.colors[key] || defaultValue;
  }, [editorState.customizations.colors]);

  // Obter imagem customizada ou padrão
  const getCustomImage = useCallback((key: string, defaultValue: string) => {
    return editorState.customizations.images[key] || defaultValue;
  }, [editorState.customizations.images]);

  // Resetar customizações
  const resetCustomizations = useCallback(() => {
    setEditorState(prev => ({
      ...prev,
      customizations: {
        colors: {},
        texts: {},
        images: {}
      }
    }));
  }, []);

  // Exportar configuração atual
  const exportConfig = useCallback(() => {
    return {
      result: editorState.currentResult,
      customizations: editorState.customizations,
      timestamp: new Date().toISOString()
    };
  }, [editorState]);

  return {
    // Estado
    editorState,
    
    // Dados atuais
    currentResult: editorState.currentResult,
    availableStyles: editorState.availableStyles,
    isEditing: editorState.isEditing,
    previewMode: editorState.previewMode,
    customizations: editorState.customizations,
    
    // Ações de estilo
    switchPrimaryStyle,
    updateSecondaryStyles,
    
    // Customizações
    updateText,
    updateColor,
    updateImage,
    getCustomText,
    getCustomColor,
    getCustomImage,
    resetCustomizations,
    
    // Controles
    setPreviewMode,
    toggleEditMode,
    generateMockResult,
    exportConfig
  };
};

export default useQuizResultEditor;