// src/config/stepTemplatesMapping.ts
// Mapeamento das 21 etapas para seus templates específicos (usando templates TSX reais)

// ✅ IMPORTS DOS TEMPLATES TSX REAIS
import { getStep01Template } from '@/components/steps/Step01Template';
import { getConnectedStep02Template } from '@/components/steps/ConnectedStep02Template';
import { getConnectedStep03Template } from '@/components/steps/ConnectedStep03Template';
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
  templateFunction: (userData?: any) => any[];
  name: string;
  description: string;
}

export interface StepConfig {
  step: number;
  name: string;
  description: string;
}

// 🎯 DADOS REAIS DAS QUESTÕES (usados pelos templates conectados)
// import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

// 🎯 CONFIGURAÇÃO DAS 21 ETAPAS COM NOMES REAIS DAS QUESTÕES
const STEP_CONFIGS = [
  { name: 'Quiz de Estilo Pessoal', description: 'Descubra seu estilo único' },
  { name: 'VAMOS NOS CONHECER?', description: 'Digite seu nome para personalizar' },
  { name: 'QUAL O SEU TIPO DE ROUPA FAVORITA?', description: 'Primeira questão do quiz' },
  { name: 'RESUMA A SUA PERSONALIDADE:', description: 'Segunda questão do quiz' },
  { name: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?', description: 'Terceira questão do quiz' },
  { name: 'QUAIS DETALHES VOCÊ GOSTA?', description: 'Quarta questão do quiz' },
  { name: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?', description: 'Quinta questão do quiz' },
  { name: 'QUAL CASACO É SEU FAVORITO?', description: 'Sexta questão do quiz' },
  { name: 'QUAL SUA CALÇA FAVORITA?', description: 'Sétima questão do quiz' },
  { name: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?', description: 'Oitava questão do quiz' },
  { name: 'QUAL BOLSA É A SUA CARA?', description: 'Nona questão do quiz' },
  { name: 'QUAL SITUAÇÃO VOCÊ MAIS VIVE NO SEU DIA A DIA?', description: 'Décima questão do quiz' },
  { name: 'Questões Estratégicas 1', description: 'Perguntas complementares' },
  { name: 'Questões Estratégicas 2', description: 'Perguntas complementares' },
  { name: 'Questões Estratégicas 3', description: 'Perguntas complementares' },
  { name: 'Analisando Respostas...', description: 'Processando seu perfil' },
  { name: 'Calculando Resultado...', description: 'Definindo seu estilo' },
  { name: 'Seu Resultado Está Pronto!', description: 'Descobrindo seu estilo' },
  { name: 'SEU ESTILO PESSOAL É:', description: 'Apresentação do resultado' },
  { name: 'Resultado Completo', description: 'Análise detalhada' },
  { name: 'RECEBA SEU GUIA DE ESTILO COMPLETO', description: 'Captura de lead' },
  { name: 'Oferta Especial', description: 'Página de conversão' },
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

// Templates específicos removidos para evitar duplicação

// 📋 MAPEAMENTO DOS TEMPLATES TSX REAIS COM NOMES CORRETOS
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {
  1: { stepNumber: 1, templateFunction: getStep01Template, name: STEP_CONFIGS[0].name, description: STEP_CONFIGS[0].description },
  2: { stepNumber: 2, templateFunction: getConnectedStep02Template, name: STEP_CONFIGS[1].name, description: STEP_CONFIGS[1].description },
  3: { stepNumber: 3, templateFunction: getConnectedStep03Template, name: STEP_CONFIGS[2].name, description: STEP_CONFIGS[2].description },
  4: { stepNumber: 4, templateFunction: getStep04Template, name: STEP_CONFIGS[3].name, description: STEP_CONFIGS[3].description },
  5: { stepNumber: 5, templateFunction: getStep05Template, name: STEP_CONFIGS[4].name, description: STEP_CONFIGS[4].description },
  6: { stepNumber: 6, templateFunction: getStep06Template, name: STEP_CONFIGS[5].name, description: STEP_CONFIGS[5].description },
  7: { stepNumber: 7, templateFunction: getStep07Template, name: STEP_CONFIGS[6].name, description: STEP_CONFIGS[6].description },
  8: { stepNumber: 8, templateFunction: getStep08Template, name: STEP_CONFIGS[7].name, description: STEP_CONFIGS[7].description },
  9: { stepNumber: 9, templateFunction: getStep09Template, name: STEP_CONFIGS[8].name, description: STEP_CONFIGS[8].description },
  10: { stepNumber: 10, templateFunction: getStep10Template, name: STEP_CONFIGS[9].name, description: STEP_CONFIGS[9].description },
  11: { stepNumber: 11, templateFunction: getStep11Template, name: STEP_CONFIGS[10].name, description: STEP_CONFIGS[10].description },
  12: { stepNumber: 12, templateFunction: getStep12Template, name: STEP_CONFIGS[11].name, description: STEP_CONFIGS[11].description },
  13: { stepNumber: 13, templateFunction: getStep13Template, name: STEP_CONFIGS[12].name, description: STEP_CONFIGS[12].description },
  14: { stepNumber: 14, templateFunction: getStep14Template, name: STEP_CONFIGS[13].name, description: STEP_CONFIGS[13].description },
  15: { stepNumber: 15, templateFunction: getStep15Template, name: STEP_CONFIGS[14].name, description: STEP_CONFIGS[14].description },
  16: { stepNumber: 16, templateFunction: getStep16Template, name: STEP_CONFIGS[15].name, description: STEP_CONFIGS[15].description },
  17: { stepNumber: 17, templateFunction: getStep17Template, name: STEP_CONFIGS[16].name, description: STEP_CONFIGS[16].description },
  18: { stepNumber: 18, templateFunction: getStep18Template, name: STEP_CONFIGS[17].name, description: STEP_CONFIGS[17].description },
  19: { stepNumber: 19, templateFunction: getStep19Template, name: STEP_CONFIGS[18].name, description: STEP_CONFIGS[18].description },
  20: { 
    stepNumber: 20, 
    templateFunction: (userData?: any) => {
      const userName = localStorage.getItem('quizUserName') || userData?.userName || '';
      const styleCategory = localStorage.getItem('quizPrimaryStyle') || userData?.styleCategory || 'Elegante';
      const sessionId = userData?.sessionId || 'default-session';
      
      console.log('🎨 Step20 personalized data:', { userName, styleCategory, sessionId });
      
      return getStep20Template({ userName, styleCategory, sessionId });
    }, 
    name: STEP_CONFIGS[19].name, 
    description: STEP_CONFIGS[19].description 
  },
  21: { stepNumber: 21, templateFunction: getStep21Template, name: STEP_CONFIGS[20].name, description: STEP_CONFIGS[20].description },
};

// 🔧 FUNÇÕES UTILITÁRIAS ATUALIZADAS
export const getStepTemplate = (stepNumber: number, userData?: any): any[] => {
  const stepTemplate = STEP_TEMPLATES_MAPPING[stepNumber];
  
  if (stepTemplate) {
    // Para Step 20, passa dados do usuário se disponíveis
    if (stepNumber === 20 && typeof stepTemplate.templateFunction === 'function') {
      return stepTemplate.templateFunction(userData);
    }
    // Para outras etapas, usa função normal
    if (typeof stepTemplate.templateFunction === 'function') {
      return stepTemplate.templateFunction();
    }
    return [];
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

// 📊 ESTATÍSTICAS ATUALIZADAS
export const getTemplateStats = () => {
  return {
    totalTemplates: getTotalSteps(),
    introSteps: 1, // Step 1 - Quiz intro
    nameSteps: 1, // Step 2 - Nome
    questionSteps: 9, // Steps 3-11 (perguntas principais)
    strategicSteps: 3, // Steps 12-14 (perguntas estratégicas) 
    transitionSteps: 2, // Steps 15-16 (transição/processamento)
    resultSteps: 4, // Steps 17-20 (resultado/lead)
    conversionSteps: 1, // Step 21 (oferta)
    connectedTemplates: 2, // Steps 2-3 já conectados aos hooks
    pendingConnections: 19, // Steps restantes para conectar
  };
};

export default STEP_TEMPLATES_MAPPING;
