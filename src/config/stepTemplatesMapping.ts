// src/config/stepTemplatesMapping.ts
// Mapeamento das 21 etapas para seus templates específicos (usando templates TSX reais)

// ✅ IMPORTS DOS TEMPLATES TSX REAIS
import { getStep01Template } from '@/components/steps/Step01Template';
import { getStep02Template } from '@/components/steps/Step02Template';
import { getStep03Template } from '@/components/steps/Step03Template';
import { getStep04Template } from '@/components/steps/Step04Template';
import { getStep05Template } from '@/components/steps/Step05Template';
import { getStep06Template } from '@/components/steps/Step06Template';
import { getStep07Template } from '@/components/steps/Step07Template';
import { getStep08Template } from '@/components/steps/Step08Template';
import { getStep09Template } from '@/components/steps/Step09Template';
import { getStep10Template } from '@/components/steps/Step10Template';
import { getStep11Template } from '@/components/steps/Step11Template';
import { getStep12Template } from '@/components/steps/Step12Template';
import { getStep13Template } from '@/components/steps/Step13Template';
import { getStep14Template } from '@/components/steps/Step14Template';
import { getStep15Template } from '@/components/steps/Step15Template';
import { getStep16Template } from '@/components/steps/Step16Template';
import { getStep17Template } from '@/components/steps/Step17Template';
import { getStep18Template } from '@/components/steps/Step18Template';
import { getStep19Template } from '@/components/steps/Step19Template';
import { getStep20Template } from '@/components/steps/Step20Template';
import { getStep21Template } from '@/components/steps/Step21Template';

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
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
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
    },
  ];
};

// Templates específicos de etapas
const getStep1IntroTemplate = () => [
  {
    id: 'intro-header',
    type: 'quiz-intro-header',
    properties: {
      logoUrl:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
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
  },
];

// 📋 MAPEAMENTO DOS TEMPLATES TSX REAIS (CORRIGIDO)
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {
  1: { stepNumber: 1, templateFunction: getStep01Template, name: 'Introdução', description: 'Tela inicial do quiz' },
  2: { stepNumber: 2, templateFunction: getStep02Template, name: 'Nome', description: 'Coleta do nome pessoal' },
  3: { stepNumber: 3, templateFunction: getStep03Template, name: 'Roupa Favorita', description: 'Tipo de roupa preferida' },
  4: { stepNumber: 4, templateFunction: getStep04Template, name: 'Estilo Pessoal', description: 'Identificação do estilo' },
  5: { stepNumber: 5, templateFunction: getStep05Template, name: 'Ocasiões', description: 'Contextos de uso' },
  6: { stepNumber: 6, templateFunction: getStep06Template, name: 'Cores', description: 'Preferências de cores' },
  7: { stepNumber: 7, templateFunction: getStep07Template, name: 'Texturas', description: 'Texturas favoritas' },
  8: { stepNumber: 8, templateFunction: getStep08Template, name: 'Silhuetas', description: 'Formas preferidas' },
  9: { stepNumber: 9, templateFunction: getStep09Template, name: 'Acessórios', description: 'Acessórios de estilo' },
  10: { stepNumber: 10, templateFunction: getStep10Template, name: 'Inspiração', description: 'Referências de moda' },
  11: { stepNumber: 11, templateFunction: getStep11Template, name: 'Conforto', description: 'Prioridade de conforto' },
  12: { stepNumber: 12, templateFunction: getStep12Template, name: 'Tendências', description: 'Interesse em tendências' },
  13: { stepNumber: 13, templateFunction: getStep13Template, name: 'Investimento', description: 'Orçamento para roupas' },
  14: { stepNumber: 14, templateFunction: getStep14Template, name: 'Personalidade', description: 'Traços pessoais' },
  15: { stepNumber: 15, templateFunction: getStep15Template, name: 'Transição', description: 'Preparação para resultado' },
  16: { stepNumber: 16, templateFunction: getStep16Template, name: 'Processamento', description: 'Calculando resultado' },
  17: { stepNumber: 17, templateFunction: getStep17Template, name: 'Resultado Parcial', description: 'Primeiro resultado' },
  18: { stepNumber: 18, templateFunction: getStep18Template, name: 'Resultado Completo', description: 'Análise completa' },
  19: { stepNumber: 19, templateFunction: getStep19Template, name: 'Resultado Final', description: 'Apresentação final' },
  20: { 
    stepNumber: 20, 
    templateFunction: (userData?: any) => {
      // 🎯 STEP 20: Integração com dados personalizados
      const userName = localStorage.getItem('quizUserName') || userData?.userName || '';
      const styleCategory = localStorage.getItem('quizPrimaryStyle') || userData?.styleCategory || 'Elegante';
      const sessionId = userData?.sessionId || 'default-session';
      
      console.log('🎨 Step20 personalized data:', { userName, styleCategory, sessionId });
      
      return getStep20Template({ userName, styleCategory, sessionId });
    }, 
    name: 'Página de Conversão', 
    description: 'Oferta personalizada com resultado do usuário' 
  },
  21: { stepNumber: 21, templateFunction: getStep21Template, name: 'Thank You Page', description: 'Confirmação e próximos passos' },
};

// 🔧 FUNÇÕES UTILITÁRIAS ATUALIZADAS
export const getStepTemplate = (stepNumber: number, userData?: any): any[] => {
  const stepTemplate = STEP_TEMPLATES_MAPPING[stepNumber];
  
  if (stepTemplate) {
    // Para Step 20, passa dados do usuário se disponíveis
    if (stepNumber === 20) {
      return stepTemplate.templateFunction(userData);
    }
    // Para outras etapas, usa função normal
    return stepTemplate.templateFunction();
  }
  
  // Fallback para template padrão
  return getDefaultTemplate(stepNumber);
};

export const getStepInfo = (stepNumber: number) => {
  const template = STEP_TEMPLATES_MAPPING[stepNumber];
  return template ? { name: template.name, description: template.description } : null;
};

export const getAllSteps = (): StepTemplate[] => {
  return Object.values(STEP_TEMPLATES_MAPPING); // 🎯 RETORNA OS 21 TEMPLATES REAIS
};

// ✅ COMPATIBILIDADE: Array exportado também
export const STEP_TEMPLATES: StepTemplate[] = getAllSteps();

// 🔧 UTILITÁRIOS
export const getTemplateByStep = (stepNumber: number): StepTemplate | undefined => {
  return STEP_TEMPLATES_MAPPING[stepNumber];
};

export const getTotalSteps = (): number => {
  return Object.keys(STEP_TEMPLATES_MAPPING).length;
};

// 📋 CONFIGURAÇÃO EXPORTADA PARA PÁGINAS
export const STEP_CONFIG: StepConfig[] = getAllSteps().map(template => ({
  step: template.stepNumber,
  name: template.name,
  description: template.description,
}));

// 📊 ESTATÍSTICAS
export const getTemplateStats = () => {
  return {
    totalTemplates: getTotalSteps(),
    introSteps: 1, // Step 1
    questionSteps: 13, // Steps 2-14 (perguntas do quiz)
    strategicSteps: 4, // Steps 15-18 (perguntas estratégicas)
    resultSteps: 1, // Step 19 (apresentação resultado)
    conversionSteps: 1, // Step 20 (conversão/venda)
    thankYouSteps: 1, // Step 21 (confirmação)
  };
};

export default STEP_TEMPLATES_MAPPING;
