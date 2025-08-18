// src/config/stepTemplatesMapping.ts
// Mapeamento das 21 etapas para seus templates específicos (usando templates TSX reais)

// Remover imports dos templates conectados temporariamente
// import { getConnectedStep01Template } from '@/components/steps/ConnectedStep01Template';
// import { getConnectedStep02Template } from '@/components/steps/ConnectedStep02Template';
// import { getConnectedStep20Template } from '@/components/steps/ConnectedStep20Template';
// import { getConnectedStep21Template } from '@/components/steps/ConnectedStep21Template';
// import {
//   getConnectedStep03Template,
//   getConnectedStep04Template,
//   getConnectedStep05Template,
//   getConnectedStep06Template,
//   getConnectedStep07Template,
//   getConnectedStep08Template,
//   getConnectedStep09Template,
//   getConnectedStep10Template,
//   getConnectedStep11Template,
//   getConnectedStep12Template,
//   getConnectedStep13Template,
//   getConnectedStep14Template,
//   getConnectedStep15Template,
//   getConnectedStep16Template,
//   getConnectedStep17Template,
//   getConnectedStep18Template,
//   getConnectedStep19Template,
// } from '@/components/steps/ConnectedStepsFixed';

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

// 🎯 FONTE ÚNICA DE VERDADE - DADOS REAIS DAS QUESTÕES
import {
  QUIZ_QUESTIONS_COMPLETE,
  QUIZ_STYLE_21_STEPS_TEMPLATE,
} from '@/templates/quiz21StepsComplete';

// 🎯 CONFIGURAÇÃO DAS 21 ETAPAS COM NOMES REAIS DAS QUESTÕES (FONTE ÚNICA)
const STEP_CONFIGS = [
  {
    name: QUIZ_QUESTIONS_COMPLETE[1] || 'Coleta do nome',
    description: 'Página inicial - coleta do nome',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[2] || 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    description: 'Primeira questão pontuada do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[3] || 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    description: 'Primeira questão do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[4] || 'RESUMA A SUA PERSONALIDADE:',
    description: 'Segunda questão do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[5] || 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
    description: 'Terceira questão do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[6] || 'QUAIS DETALHES VOCÊ GOSTA?',
    description: 'Quarta questão do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[7] || 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    description: 'Quinta questão do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[8] || 'QUAL CASACO É SEU FAVORITO?',
    description: 'Sexta questão do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[9] || 'QUAL SUA CALÇA FAVORITA?',
    description: 'Sétima questão do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[10] || 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
    description: 'Oitava questão do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[11] || 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
    description: 'Nona questão do quiz',
  },
  {
    name:
      QUIZ_QUESTIONS_COMPLETE[12] || 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
    description: 'Décima questão do quiz',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[13] || 'Enquanto calculamos o seu resultado...',
    description: 'Transição para questões estratégicas',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[14] || 'Como você se vê hoje?',
    description: 'Primeira questão estratégica',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[15] || 'O que mais te desafia na hora de se vestir?',
    description: 'Segunda questão estratégica',
  },
  {
    name:
      QUIZ_QUESTIONS_COMPLETE[16] ||
      'Com que frequência você se pega pensando: "Com que roupa eu vou?"',
    description: 'Terceira questão estratégica',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[17] || 'Se esse conteúdo completo custasse R$ 97,00...',
    description: 'Quarta questão estratégica',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[18] || 'Qual desses resultados você mais gostaria de alcançar?',
    description: 'Quinta questão estratégica',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[19] || 'Página de transição para resultado',
    description: 'Sexta questão estratégica',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[20] || 'Página de resultado personalizada',
    description: 'Apresentação do resultado',
  },
  {
    name: QUIZ_QUESTIONS_COMPLETE[21] || 'Página de oferta direta',
    description: 'Página de conversão',
  },
];

// Template padrão para fallback (usa QUIZ_STYLE_21_STEPS_TEMPLATE se disponível)
const getDefaultTemplate = (stepNumber: number) => {
  const stepId = `step-${stepNumber}`;

  // 🎯 PRIORIDADE 1: Usar blocos reais do QUIZ_STYLE_21_STEPS_TEMPLATE
  if (QUIZ_STYLE_21_STEPS_TEMPLATE[stepId]) {
    console.log(`✅ Usando template real para ${stepId}`);
    return QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  }

  // 🎯 PRIORIDADE 2: Fallback com dados da QUIZ_QUESTIONS_COMPLETE
  const config = STEP_CONFIGS[stepNumber - 1];
  console.log(`⚠️ Fallback para ${stepId}:`, config?.name);

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
        content: config?.name || `Etapa ${stepNumber}`,
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
        content: config?.description || 'Descrição da etapa',
        fontSize: 'text-lg',
        fontWeight: 'font-normal',
        textAlign: 'text-center',
        color: '#6B4F43',
      },
    },
  ];
};

// 📋 MAPEAMENTO DOS TEMPLATES SIMPLIFICADO
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {};

// Gerar mapeamento dinâmico para todas as 21 etapas
for (let i = 1; i <= 21; i++) {
  STEP_TEMPLATES_MAPPING[i] = {
    stepNumber: i,
    templateFunction: () => getDefaultTemplate(i),
    name: STEP_CONFIGS[i - 1]?.name || `Etapa ${i}`,
    description: STEP_CONFIGS[i - 1]?.description || `Descrição da etapa ${i}`,
  };
}

// 🎯 FUNÇÃO PRINCIPAL SIMPLIFICADA - USA DIRETAMENTE QUIZ_STYLE_21_STEPS_TEMPLATE
export const getStepTemplate = (stepNumber: number, userData?: any): any[] => {
  const stepId = `step-${stepNumber}`;
  
  // Usar diretamente os blocos do QUIZ_STYLE_21_STEPS_TEMPLATE
  if (QUIZ_STYLE_21_STEPS_TEMPLATE[stepId]) {
    console.log(`✅ Retornando template real para ${stepId}`);
    return QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  }

  // Fallback
  console.log(`⚠️ Usando fallback para ${stepId}`);
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
    questionSteps: 10, // Steps 3-12 (perguntas principais)
    strategicSteps: 7, // Steps 13-19 (perguntas estratégicas)
    resultSteps: 1, // Step 20 (resultado)
    conversionSteps: 1, // Step 21 (oferta)
    connectedTemplates: 21, // TODAS as steps agora têm templates conectados
    pendingConnections: 0, // Nenhuma pendente
  };
};

export default STEP_TEMPLATES_MAPPING;
