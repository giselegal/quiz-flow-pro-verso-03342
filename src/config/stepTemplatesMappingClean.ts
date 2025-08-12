// src/config/stepTemplatesMapping.ts
// Mapeamento das 21 etapas para seus templates específicos

// Importações dos templates de cada etapa (arquivos .tsx)
import { getStep01Template } from '@/components/steps/Step01Template';
import { getStep02Template } from '@/components/steps/Step02Template';
import { getStep03Template } from '@/components/steps/Step03Template';
import { getStep04Template } from '@/components/steps/Step04Template';
import { getStep05Template } from '@/components/steps/Step05Template';
import { getStep06Template } from '@/components/steps/Step06Template';
import { getStep07Template } from '@/components/steps/Step07Template';
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

// Importar a configuração completa do quiz
import { QUIZ_CONFIGURATION } from './quizConfiguration';

// Interface para o template de etapa
export interface StepTemplate {
  stepNumber: number;
  templateFunction: () => any[];
  name: string;
  description: string;
}

// 🎯 CONFIGURAÇÃO COMPLETA DO QUIZ DE ESTILO PESSOAL
// Exportar configuração do quiz baseada no JSON fornecido
export const FULL_QUIZ_TEMPLATE = QUIZ_CONFIGURATION;

// ✅ MAPEAMENTO DAS 21 ETAPAS (mantido para compatibilidade)
export const STEP_TEMPLATES: StepTemplate[] = [
  {
    stepNumber: 1,
    templateFunction: getStep01Template,
    name: 'Quiz Intro',
    description: 'Tela inicial com nome',
  },
  {
    stepNumber: 2,
    templateFunction: getStep02Template,
    name: 'Pergunta 1',
    description: 'Tipo de roupa favorita',
  },
  {
    stepNumber: 3,
    templateFunction: getStep03Template,
    name: 'Pergunta 2',
    description: 'Personalidade',
  },
  {
    stepNumber: 4,
    templateFunction: getStep04Template,
    name: 'Pergunta 3',
    description: 'Visual identificação',
  },
  {
    stepNumber: 5,
    templateFunction: getStep05Template,
    name: 'Pergunta 4',
    description: 'Perguntas adicionais',
  },
  {
    stepNumber: 6,
    templateFunction: getStep06Template,
    name: 'Pergunta 5',
    description: 'Perguntas adicionais',
  },
  {
    stepNumber: 7,
    templateFunction: getStep07Template,
    name: 'Pergunta 6',
    description: 'Perguntas adicionais',
  },
  {
    stepNumber: 8,
    name: 'Pergunta 7',
    description: 'Perguntas adicionais',
  },
  {
    stepNumber: 9,
    templateFunction: getStep09Template,
    name: 'Pergunta 8',
    description: 'Perguntas adicionais',
  },
  {
    stepNumber: 10,
    templateFunction: getStep10Template,
    name: 'Pergunta 9',
    description: 'Perguntas adicionais',
  },
  {
    stepNumber: 11,
    templateFunction: getStep11Template,
    name: 'Transição',
    description: 'Transição para estratégicas',
  },
  {
    stepNumber: 12,
    templateFunction: getStep12Template,
    name: 'Estratégica 1',
    description: 'Como se sente sobre estilo',
  },
  {
    stepNumber: 13,
    templateFunction: getStep13Template,
    name: 'Estratégica 2',
    description: 'Maior desafio ao se vestir',
  },
  {
    stepNumber: 14,
    templateFunction: getStep14Template,
    name: 'Estratégica 3',
    description: 'Investimento passado',
  },
  {
    stepNumber: 15,
    templateFunction: getStep15Template,
    name: 'Estratégica 4',
    description: 'Investimento disposto',
  },
  {
    stepNumber: 16,
    templateFunction: getStep16Template,
    name: 'Estratégica 5',
    description: 'Aspecto a melhorar',
  },
  {
    stepNumber: 17,
    templateFunction: getStep17Template,
    name: 'Estratégica 6',
    description: 'Objetivo com quiz',
  },
  {
    stepNumber: 18,
    templateFunction: getStep18Template,
    name: 'Transição Final',
    description: 'Preparando resultado',
  },
  {
    stepNumber: 19,
    templateFunction: getStep19Template,
    name: 'Resultado',
    description: 'Exibição do estilo',
  },
  {
    stepNumber: 20,
    templateFunction: getStep20Template,
    name: 'CTA',
    description: 'Call to action',
  },
  {
    stepNumber: 21,
    templateFunction: getStep21Template,
    name: 'Bonus',
    description: 'Conteúdo extra',
  },
];

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
    questionSteps: STEP_TEMPLATES.filter(t => t.name.includes('Pergunta')).length,
    strategicSteps: STEP_TEMPLATES.filter(t => t.name.includes('Estratégica')).length,
    transitionSteps: STEP_TEMPLATES.filter(t => t.name.includes('Transição')).length,
    resultSteps: STEP_TEMPLATES.filter(t => t.name.includes('Resultado')).length,
  };
};
