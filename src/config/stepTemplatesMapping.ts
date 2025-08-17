// src/config/stepTemplatesMapping.ts
// Mapeamento das 21 etapas para seus templates específicos (usando templates TSX reais)

// ✅ IMPORTS DOS TEMPLATES CORRIGIDOS
import { getConnectedStep02Template } from '@/components/steps/ConnectedStep02Template';
import {
  getConnectedStep03Template,
  getConnectedStep04Template,
  getConnectedStep05Template,
  getConnectedStep06Template,
  getConnectedStep07Template,
  getConnectedStep08Template,
  getConnectedStep09Template,
  getConnectedStep10Template,
  getConnectedStep11Template,
  getConnectedStep12Template,
  getConnectedStep13Template,
  getConnectedStep14Template,
  getConnectedStep15Template,
  getConnectedStep16Template,
  getConnectedStep17Template,
  getConnectedStep18Template,
  getConnectedStep19Template,
} from '@/components/steps/ConnectedStepsFixed';

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
  { name: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?', description: 'Nona questão do quiz' },
  {
    name: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
    description: 'Décima questão do quiz',
  },
  {
    name: 'Enquanto calculamos o seu resultado...',
    description: 'Transição para questões estratégicas',
  },
  { name: 'Como você se vê hoje?', description: 'Primeira questão estratégica' },
  {
    name: 'O que mais te desafia na hora de se vestir?',
    description: 'Segunda questão estratégica',
  },
  {
    name: 'Com que frequência você se pega pensando: "Com que roupa eu vou?"',
    description: 'Terceira questão estratégica',
  },
  {
    name: 'Ter acesso a um material estratégico faria diferença?',
    description: 'Quarta questão estratégica',
  },
  {
    name: 'Você consideraria R$ 97,00 um bom investimento?',
    description: 'Quinta questão estratégica',
  },
  {
    name: 'Qual resultado você mais gostaria de alcançar?',
    description: 'Sexta questão estratégica',
  },
  { name: 'Obrigada por compartilhar...', description: 'Transição para resultado' },
  { name: 'SEU ESTILO PESSOAL É:', description: 'Apresentação do resultado' },
  { name: 'RECEBA SEU GUIA DE ESTILO COMPLETO', description: 'Página de conversão' },
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

// 📋 MAPEAMENTO DOS TEMPLATES TSX CONECTADOS COM NOMES CORRETOS
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {
  1: {
    stepNumber: 1,
    templateFunction: getStep01Template,
    name: STEP_CONFIGS[0]?.name || 'Quiz de Estilo Pessoal',
    description: STEP_CONFIGS[0]?.description || 'Descubra seu estilo único',
  },
  2: {
    stepNumber: 2,
    templateFunction: getConnectedStep02Template,
    name: STEP_CONFIGS[1]?.name || 'VAMOS NOS CONHECER?',
    description: STEP_CONFIGS[1]?.description || 'Digite seu nome para personalizar',
  },
  3: {
    stepNumber: 3,
    templateFunction: getConnectedStep03Template,
    name: STEP_CONFIGS[2]?.name || 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    description: STEP_CONFIGS[2]?.description || 'Primeira questão do quiz',
  },
  4: {
    stepNumber: 4,
    templateFunction: getConnectedStep04Template,
    name: STEP_CONFIGS[3]?.name || 'RESUMA A SUA PERSONALIDADE:',
    description: STEP_CONFIGS[3]?.description || 'Segunda questão do quiz',
  },
  5: {
    stepNumber: 5,
    templateFunction: getConnectedStep05Template,
    name: STEP_CONFIGS[4]?.name || 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
    description: STEP_CONFIGS[4]?.description || 'Terceira questão do quiz',
  },
  6: {
    stepNumber: 6,
    templateFunction: getConnectedStep06Template,
    name: STEP_CONFIGS[5]?.name || 'QUAIS DETALHES VOCÊ GOSTA?',
    description: STEP_CONFIGS[5]?.description || 'Quarta questão do quiz',
  },
  7: {
    stepNumber: 7,
    templateFunction: getConnectedStep07Template,
    name: STEP_CONFIGS[6]?.name || 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    description: STEP_CONFIGS[6]?.description || 'Quinta questão do quiz',
  },
  8: {
    stepNumber: 8,
    templateFunction: getConnectedStep08Template,
    name: STEP_CONFIGS[7]?.name || 'QUAL CASACO É SEU FAVORITO?',
    description: STEP_CONFIGS[7]?.description || 'Sexta questão do quiz',
  },
  9: {
    stepNumber: 9,
    templateFunction: getConnectedStep09Template,
    name: STEP_CONFIGS[8]?.name || 'QUAL SUA CALÇA FAVORITA?',
    description: STEP_CONFIGS[8]?.description || 'Sétima questão do quiz',
  },
  10: {
    stepNumber: 10,
    templateFunction: getConnectedStep10Template,
    name: STEP_CONFIGS[9]?.name || 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
    description: STEP_CONFIGS[9]?.description || 'Oitava questão do quiz',
  },
  11: {
    stepNumber: 11,
    templateFunction: getConnectedStep11Template,
    name: STEP_CONFIGS[10]?.name || 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
    description: STEP_CONFIGS[10]?.description || 'Nona questão do quiz',
  },
  12: {
    stepNumber: 12,
    templateFunction: getConnectedStep12Template,
    name: STEP_CONFIGS[11]?.name || 'VOCÊ ESCOLHE CERTOS TECIDOS...',
    description: STEP_CONFIGS[11]?.description || 'Décima questão do quiz',
  },
  13: {
    stepNumber: 13,
    templateFunction: getConnectedStep13Template,
    name: STEP_CONFIGS[12]?.name || 'Enquanto calculamos...',
    description: STEP_CONFIGS[12]?.description || 'Transição para questões estratégicas',
  },
  14: {
    stepNumber: 14,
    templateFunction: getConnectedStep14Template,
    name: STEP_CONFIGS[13]?.name || 'Como você se vê hoje?',
    description: STEP_CONFIGS[13]?.description || 'Primeira questão estratégica',
  },
  15: {
    stepNumber: 15,
    templateFunction: getConnectedStep15Template,
    name: STEP_CONFIGS[14]?.name || 'O que mais te desafia?',
    description: STEP_CONFIGS[14]?.description || 'Segunda questão estratégica',
  },
  16: {
    stepNumber: 16,
    templateFunction: getConnectedStep16Template,
    name: STEP_CONFIGS[15]?.name || 'Com que frequência...',
    description: STEP_CONFIGS[15]?.description || 'Terceira questão estratégica',
  },
  17: {
    stepNumber: 17,
    templateFunction: getConnectedStep17Template,
    name: STEP_CONFIGS[16]?.name || 'Ter acesso a material estratégico?',
    description: STEP_CONFIGS[16]?.description || 'Quarta questão estratégica',
  },
  18: {
    stepNumber: 18,
    templateFunction: getConnectedStep18Template,
    name: STEP_CONFIGS[17]?.name || 'R$ 97,00 um bom investimento?',
    description: STEP_CONFIGS[17]?.description || 'Quinta questão estratégica',
  },
  19: {
    stepNumber: 19,
    templateFunction: getConnectedStep19Template,
    name: STEP_CONFIGS[18]?.name || 'Qual resultado gostaria?',
    description: STEP_CONFIGS[18]?.description || 'Sexta questão estratégica',
  },
  20: {
    stepNumber: 20,
    templateFunction: (userData?: any) => {
      const userName = localStorage.getItem('quizUserName') || userData?.userName || '';
      const styleCategory =
        localStorage.getItem('quizPrimaryStyle') || userData?.styleCategory || 'Elegante';
      const sessionId = userData?.sessionId || 'default-session';

      console.log('🎨 Step20 personalized data:', { userName, styleCategory, sessionId });

      return [];
    },
    name: STEP_CONFIGS[19]?.name || 'SEU ESTILO PESSOAL É:',
    description: STEP_CONFIGS[19]?.description || 'Apresentação do resultado',
  },
  21: {
    stepNumber: 21,
    templateFunction: getStep21Template,
    name: STEP_CONFIGS[20]?.name || 'RECEBA SEU GUIA COMPLETO',
    description: STEP_CONFIGS[20]?.description || 'Página de conversão',
  },
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
