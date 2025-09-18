// src/config/stepTemplatesMapping.ts
// ✅ ARQUIVO SIMPLIFICADO PARA RESOLVER PROBLEMA DAS ETAPAS

// Interface simples para o template de etapa
export interface StepTemplate {
  stepNumber: number;
  name: string;
  description: string;
}

// ✅ MAPEAMENTO SIMPLIFICADO - apenas informações básicas
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {
  1: { stepNumber: 1, name: 'Coleta do nome', description: 'Página inicial - coleta do nome' },
  2: {
    stepNumber: 2,
    name: 'Tipo de roupa favorita',
    description: 'Pergunta sobre estilo de roupa',
  },
  3: { stepNumber: 3, name: 'Cores vibrantes', description: 'Pergunta sobre cores' },
  4: { stepNumber: 4, name: 'Acessórios', description: 'Pergunta sobre acessórios' },
  5: { stepNumber: 5, name: 'Ocasião especial', description: 'Pergunta sobre ocasiões' },
  6: { stepNumber: 6, name: 'Estilo de cabelo', description: 'Pergunta sobre cabelo' },
  7: { stepNumber: 7, name: 'Maquiagem', description: 'Pergunta sobre maquiagem' },
  8: { stepNumber: 8, name: 'Sapatos', description: 'Pergunta sobre calçados' },
  9: { stepNumber: 9, name: 'Estilo de vida', description: 'Pergunta sobre lifestyle' },
  10: { stepNumber: 10, name: 'Inspiração', description: 'Pergunta sobre inspirações' },
  11: { stepNumber: 11, name: 'Personalidade', description: 'Pergunta sobre personalidade' },
  12: { stepNumber: 12, name: 'Transição', description: 'Página de transição' },
  13: { stepNumber: 13, name: 'Estratégica 1', description: 'Pergunta estratégica 1' },
  14: { stepNumber: 14, name: 'Estratégica 2', description: 'Pergunta estratégica 2' },
  15: { stepNumber: 15, name: 'Estratégica 3', description: 'Pergunta estratégica 3' },
  16: { stepNumber: 16, name: 'Estratégica 4', description: 'Pergunta estratégica 4' },
  17: { stepNumber: 17, name: 'Estratégica 5', description: 'Pergunta estratégica 5' },
  18: { stepNumber: 18, name: 'Estratégica 6', description: 'Pergunta estratégica 6' },
  19: { stepNumber: 19, name: 'Preparação resultado', description: 'Página de preparação' },
  20: { stepNumber: 20, name: 'Resultado', description: 'Página de resultado' },
  21: { stepNumber: 21, name: 'Oferta', description: 'Página de oferta' },
};

// ✅ FUNÇÕES UTILITÁRIAS
export const getAllSteps = (): StepTemplate[] => {
  return Object.values(STEP_TEMPLATES_MAPPING);
};

export const getStepInfo = (stepNumber: number): StepTemplate | null => {
  return STEP_TEMPLATES_MAPPING[stepNumber] || null;
};

export const getTotalSteps = (): number => {
  return Object.keys(STEP_TEMPLATES_MAPPING).length;
};

export default STEP_TEMPLATES_MAPPING;
