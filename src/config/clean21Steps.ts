// ✅ CONFIGURAÇÃO LIMPA DAS 21 ETAPAS SEM DUPLICAÇÃO
// Arquivo criado para resolver problemas de etapas repetidas no editor

export interface CleanStepConfig {
  stepNumber: number;
  id: string;
  name: string;
  description: string;
  type: 'intro' | 'question' | 'transition' | 'processing' | 'result' | 'lead' | 'offer';
  category: 'start' | 'questions' | 'strategic' | 'results' | 'conversion';
}

// 🎯 CONFIGURAÇÃO DAS 21 ETAPAS ÚNICAS (SEM REPETIÇÃO)
export const CLEAN_21_STEPS: CleanStepConfig[] = [
  // 📍 INÍCIO (1 etapa)
  {
    stepNumber: 1,
    id: 'step-01',
    name: 'Introdução',
    description: 'Tela inicial do quiz de estilo',
    type: 'intro',
    category: 'start'
  },

  // ❓ PERGUNTAS PRINCIPAIS (13 etapas)
  {
    stepNumber: 2,
    id: 'step-02',
    name: 'Nome',
    description: 'Coleta do nome pessoal',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 3,
    id: 'step-03',
    name: 'Roupa Favorita',
    description: 'Tipo de roupa preferida',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 4,
    id: 'step-04',
    name: 'Estilo Pessoal',
    description: 'Identificação do estilo',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 5,
    id: 'step-05',
    name: 'Ocasiões',
    description: 'Contextos de uso',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 6,
    id: 'step-06',
    name: 'Cores',
    description: 'Preferências de cores',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 7,
    id: 'step-07',
    name: 'Texturas',
    description: 'Texturas favoritas',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 8,
    id: 'step-08',
    name: 'Silhuetas',
    description: 'Formas preferidas',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 9,
    id: 'step-09',
    name: 'Acessórios',
    description: 'Acessórios de estilo',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 10,
    id: 'step-10',
    name: 'Inspiração',
    description: 'Referências de moda',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 11,
    id: 'step-11',
    name: 'Conforto',
    description: 'Prioridade de conforto',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 12,
    id: 'step-12',
    name: 'Tendências',
    description: 'Interesse em tendências',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 13,
    id: 'step-13',
    name: 'Investimento',
    description: 'Orçamento para roupas',
    type: 'question',
    category: 'questions'
  },
  {
    stepNumber: 14,
    id: 'step-14',
    name: 'Personalidade',
    description: 'Traços pessoais',
    type: 'question',
    category: 'questions'
  },

  // 🔄 TRANSIÇÃO (1 etapa)
  {
    stepNumber: 15,
    id: 'step-15',
    name: 'Transição',
    description: 'Preparação para resultado',
    type: 'transition',
    category: 'strategic'
  },

  // ⚙️ PROCESSAMENTO (1 etapa)
  {
    stepNumber: 16,
    id: 'step-16',
    name: 'Processamento',
    description: 'Calculando resultado',
    type: 'processing',
    category: 'strategic'
  },

  // 🎯 RESULTADOS (3 etapas)
  {
    stepNumber: 17,
    id: 'step-17',
    name: 'Resultado Parcial',
    description: 'Primeiro resultado',
    type: 'result',
    category: 'results'
  },
  {
    stepNumber: 18,
    id: 'step-18',
    name: 'Resultado Completo',
    description: 'Análise detalhada',
    type: 'result',
    category: 'results'
  },
  {
    stepNumber: 19,
    id: 'step-19',
    name: 'Resultado Final',
    description: 'Apresentação final',
    type: 'result',
    category: 'results'
  },

  // 📧 CAPTURA DE LEAD (1 etapa)
  {
    stepNumber: 20,
    id: 'step-20',
    name: 'Lead Capture',
    description: 'Captura de contato',
    type: 'lead',
    category: 'conversion'
  },

  // 💰 OFERTA (1 etapa)
  {
    stepNumber: 21,
    id: 'step-21',
    name: 'Oferta',
    description: 'Página de oferta final',
    type: 'offer',
    category: 'conversion'
  }
];

// 🔧 UTILITÁRIOS
export const getCleanStepById = (stepId: string): CleanStepConfig | undefined => {
  return CLEAN_21_STEPS.find(step => step.id === stepId);
};

export const getCleanStepByNumber = (stepNumber: number): CleanStepConfig | undefined => {
  return CLEAN_21_STEPS.find(step => step.stepNumber === stepNumber);
};

export const getStepsByCategory = (category: CleanStepConfig['category']): CleanStepConfig[] => {
  return CLEAN_21_STEPS.filter(step => step.category === category);
};

export const getStepsByType = (type: CleanStepConfig['type']): CleanStepConfig[] => {
  return CLEAN_21_STEPS.filter(step => step.type === type);
};

// 📊 ESTATÍSTICAS DAS 21 ETAPAS
export const getCleanStepsStats = () => {
  const stats = {
    total: CLEAN_21_STEPS.length,
    byType: {
      intro: CLEAN_21_STEPS.filter(s => s.type === 'intro').length,
      question: CLEAN_21_STEPS.filter(s => s.type === 'question').length,
      transition: CLEAN_21_STEPS.filter(s => s.type === 'transition').length,
      processing: CLEAN_21_STEPS.filter(s => s.type === 'processing').length,
      result: CLEAN_21_STEPS.filter(s => s.type === 'result').length,
      lead: CLEAN_21_STEPS.filter(s => s.type === 'lead').length,
      offer: CLEAN_21_STEPS.filter(s => s.type === 'offer').length,
    },
    byCategory: {
      start: CLEAN_21_STEPS.filter(s => s.category === 'start').length,
      questions: CLEAN_21_STEPS.filter(s => s.category === 'questions').length,
      strategic: CLEAN_21_STEPS.filter(s => s.category === 'strategic').length,
      results: CLEAN_21_STEPS.filter(s => s.category === 'results').length,
      conversion: CLEAN_21_STEPS.filter(s => s.category === 'conversion').length,
    }
  };

  return stats;
};

// 🚀 VALIDAÇÃO
export const validateCleanSteps = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Verificar se há 21 etapas
  if (CLEAN_21_STEPS.length !== 21) {
    errors.push(`Expected 21 steps, found ${CLEAN_21_STEPS.length}`);
  }

  // Verificar numeração sequencial
  const expectedNumbers = Array.from({length: 21}, (_, i) => i + 1);
  const actualNumbers = CLEAN_21_STEPS.map(s => s.stepNumber).sort();
  
  if (JSON.stringify(expectedNumbers) !== JSON.stringify(actualNumbers)) {
    errors.push('Step numbers are not sequential 1-21');
  }

  // Verificar IDs únicos
  const ids = CLEAN_21_STEPS.map(s => s.id);
  const uniqueIds = [...new Set(ids)];
  if (ids.length !== uniqueIds.length) {
    errors.push('Duplicate step IDs found');
  }

  // Verificar nomes únicos
  const names = CLEAN_21_STEPS.map(s => s.name);
  const uniqueNames = [...new Set(names)];
  if (names.length !== uniqueNames.length) {
    errors.push('Duplicate step names found');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 🎯 DEBUG - Executar validação ao importar
const validation = validateCleanSteps();
if (!validation.isValid) {
  console.error('❌ Clean Steps Validation Failed:', validation.errors);
} else {
  console.log('✅ Clean 21 Steps validated successfully');
  console.log('📊 Stats:', getCleanStepsStats());
}
