// src/config/stepTemplatesMapping.ts
// Mapeamento das 21 etapas para seus templates específicos (usando templates JSON)

// Interface para o template de etapa
export interface StepTemplate {
  stepNumber: number;
  templateFunction: () => any[];
  name: string;
  description: string;
}

export interface StepConfig {
  step: number;
  name: string;
  description: string;
}

// 🎯 CONFIGURAÇÃO DAS 21 ETAPAS COM NOMES CORRETOS E SEM DUPLICAÇÃO
const STEP_CONFIGS = [
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
  const config = STEP_CONFIGS[stepNumber - 1];
  
  return [
    {
      id: `step${stepNumber}-header`,
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: (stepNumber / 21) * 100,
        progressMax: 100,
        showBackButton: stepNumber > 1,
        showProgress: true,
      },
    },
    {
      id: `step${stepNumber}-title`,
      type: 'text-inline',
      properties: {
        content: config.name,
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
      },
    },
    {
      id: `step${stepNumber}-description`,
      type: 'text-inline',
      properties: {
        content: config.description,
        fontSize: 'text-lg',
        fontWeight: 'font-normal',
        textAlign: 'text-center',
        color: '#6B4F43',
      },
    }
  ];
};

// Templates específicos de etapas
const getStep1IntroTemplate = () => [
  {
    id: 'intro-header',
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 0,
      progressMax: 100,
      showBackButton: false,
      showProgress: false,
    },
  },
  {
    id: 'intro-hero',
    type: 'hero-section',
    properties: {
      title: 'DESCUBRA SEU ESTILO ÚNICO',
      subtitle: 'Responda 21 perguntas simples e receba um guia personalizado',
      ctaText: 'COMEÇAR QUIZ GRATUITO',
      ctaColor: '#B89B7A',
      backgroundColor: '#FAF9F7',
    },
  }
];

// 📋 TEMPLATES COMPLETOS DE CADA ETAPA
export const STEP_TEMPLATES: StepTemplate[] = STEP_CONFIGS.map((config, index) => {
  const stepNumber = index + 1;
  
  return {
    stepNumber,
    templateFunction: stepNumber === 1 ? getStep1IntroTemplate : () => getDefaultTemplate(stepNumber),
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

// 📋 CONFIGURAÇÃO EXPORTADA PARA PÁGINAS
export const STEP_CONFIG: StepConfig[] = STEP_TEMPLATES.map(template => ({
  step: template.stepNumber,
  name: template.name,
  description: template.description
}));

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

export default STEP_TEMPLATES;
