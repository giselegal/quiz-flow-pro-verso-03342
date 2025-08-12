// src/config/stepTemplatesMapping.ts
// Mapeamento das 21 etapas para seus templates específicos (usando templates JSON)

// Interface para o template de etapa
export interface StepTemplate {
  stepNumber: number;
  templateFunction: () => any[];
  name: string;
  description: string;
}

// 🎯 CONFIGURAÇÃO DAS 21 ETAPAS COM NOMES CORRETOS E SEM DUPLICAÇÃO
const STEP_CONFIG = [
  { name: 'Introdução', description: 'Tela inicial do quiz' },
  { name: 'Nome', description: 'Coleta do nome pessoal' },
  { name: 'Roupa Favorita', description: 'Tipo de roupa preferida' },
  { name: 'Estilo Pessoal', description: 'Identificação do estilo' },
  { name: 'Ocasiões', description: 'Contextos de uso' },
  { name: 'Cores', description: 'Preferências de cores' },
  { name: 'Texturas', description: 'Texturas favoritas' },
  { name: 'Silhuetas', description: 'Formas preferidas' },
  { name: 'Acessórios', description: 'Acessórios de estilo' },
  { name: 'Inspiração', description: 'Referências de moda' },
  { name: 'Conforto', description: 'Prioridade de conforto' },
  { name: 'Tendências', description: 'Interesse em tendências' },
  { name: 'Investimento', description: 'Orçamento para roupas' },
  { name: 'Personalidade', description: 'Traços pessoais' },
  { name: 'Transição', description: 'Preparação para resultado' },
  { name: 'Processamento', description: 'Calculando resultado' },
  { name: 'Resultado Parcial', description: 'Primeiro resultado' },
  { name: 'Resultado Completo', description: 'Análise completa' },
  { name: 'Resultado Final', description: 'Apresentação final' },
  { name: 'Lead Capture', description: 'Captura de contato' },
  { name: 'Oferta', description: 'Página de oferta final' },
];

// Template padrão para fallback
const getDefaultTemplate = (stepNumber: number) => {
  const config = STEP_CONFIG[stepNumber - 1];

  return [
    {
      id: `step-${stepNumber.toString().padStart(2, '0')}-title`,
      type: 'text-inline',
      properties: {
        content: config?.name || `Etapa ${stepNumber}`,
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        containerWidth: 'full',
        spacing: 'medium',
      },
    },
    {
      id: `step-${stepNumber.toString().padStart(2, '0')}-description`,
      type: 'text-inline',
      properties: {
        content: config?.description || `Descrição da etapa ${stepNumber}`,
        fontSize: 'text-lg',
        textAlign: 'text-center',
        color: '#6B4F43',
        containerWidth: 'full',
        spacing: 'small',
      },
    },
  ];
};

// ✅ MAPEAMENTO DAS 21 ETAPAS ÚNICAS E CORRETAS
export const STEP_TEMPLATES: StepTemplate[] = STEP_CONFIG.map((config, index) => {
  const stepNumber = index + 1;

  return {
    stepNumber,
    templateFunction: () => getDefaultTemplate(stepNumber),
    name: config.name,
    description: config.description,
  };
});

// 🔧 UTILITÁRIOS
export const getTemplateByStep = (stepNumber: number): StepTemplate | undefined => {
  return STEP_TEMPLATES.find(template => template.stepNumber === stepNumber);
};

export const getTotalSteps = (): number => {
  return STEP_TEMPLATES.length;
};

// 📊 ESTATÍSTICAS
export const getTemplateStats = () => {
  return {
    totalTemplates: STEP_TEMPLATES.length,
    introSteps: 1,
    questionSteps: 13,
    transitionSteps: 1,
    processingSteps: 1,
    resultSteps: 3,
    leadSteps: 1,
    offerSteps: 1,
  };
};
