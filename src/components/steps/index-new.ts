// 🎯 CENTRALIZADOR DE TODAS AS ETAPAS - NOVA ARQUITETURA
// Este arquivo mapeia cada etapa para seu respectivo template

import { getStep01Template } from './Step01Template';
import { getStep02Template } from './Step02Template';
import { getStep03Template } from './Step03Template';
import { getStep04Template } from './Step04Template';
import { getStep05Template } from './Step05Template';
import { getStep06Template } from './Step06Template';
import { getStep07Template } from './Step07Template';
import { getStep08Template } from './Step08Template';
import { getStep09Template } from './Step09Template';
import { getStep10Template } from './Step10Template';
import { getStep11Template } from './Step11Template';
import { getStep12Template } from './Step12Template';
import { getStep13Template } from './Step13Template';
import { getStep14Template } from './Step14Template';
import { getStep15Template } from './Step15Template';
import { getStep16Template } from './Step16Template';
import { getStep17Template } from './Step17Template';
import { getStep18Template } from './Step18Template';
import { getStep19Template } from './Step19Template';
import { getStep20Template } from './Step20Template';
import { getStep21Template } from './Step21Template';

export interface StepInfo {
  id: string;
  name: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';
  description: string;
  progress: number;
}

// 🗺️ MAPA COMPLETO DAS 21 ETAPAS
export const STEP_TEMPLATES = {
  'etapa-1': getStep01Template,
  'etapa-2': getStep02Template,
  'etapa-3': getStep03Template,
  'etapa-4': getStep04Template,
  'etapa-5': getStep05Template,
  'etapa-6': getStep06Template,
  'etapa-7': getStep07Template,
  'etapa-8': getStep08Template,
  'etapa-9': getStep09Template,
  'etapa-10': getStep10Template,
  'etapa-11': getStep11Template,
  'etapa-12': getStep12Template,
  'etapa-13': getStep13Template,
  'etapa-14': getStep14Template,
  'etapa-15': getStep15Template,
  'etapa-16': getStep16Template,
  'etapa-17': getStep17Template,
  'etapa-18': getStep18Template,
  'etapa-19': getStep19Template,
  'etapa-20': getStep20Template,
  'etapa-21': getStep21Template,
} as const;

// 📊 METADADOS DAS ETAPAS
export const STEP_INFO: Record<string, StepInfo> = {
  'etapa-1': { id: 'etapa-1', name: 'Introdução', type: 'intro', description: 'Página inicial do quiz com coleta de nome', progress: 0 },
  'etapa-2': { id: 'etapa-2', name: 'Questão 1', type: 'question', description: 'Tipo de roupa preferida', progress: 10 },
  'etapa-3': { id: 'etapa-3', name: 'Questão 2', type: 'question', description: 'Cores preferidas', progress: 15 },
  'etapa-4': { id: 'etapa-4', name: 'Questão 3', type: 'question', description: 'Estilo de vida', progress: 20 },
  'etapa-5': { id: 'etapa-5', name: 'Questão 4', type: 'question', description: 'Ocasiões de uso', progress: 25 },
  'etapa-6': { id: 'etapa-6', name: 'Questão 5', type: 'question', description: 'Acessórios preferidos', progress: 30 },
  'etapa-7': { id: 'etapa-7', name: 'Questão 6', type: 'question', description: 'Tecidos favoritos', progress: 35 },
  'etapa-8': { id: 'etapa-8', name: 'Questão 7', type: 'question', description: 'Silhuetas preferidas', progress: 40 },
  'etapa-9': { id: 'etapa-9', name: 'Questão 8', type: 'question', description: 'Estampas e padrões', progress: 45 },
  'etapa-10': { id: 'etapa-10', name: 'Questão 9', type: 'question', description: 'Calçados preferidos', progress: 50 },
  'etapa-11': { id: 'etapa-11', name: 'Questão 10', type: 'question', description: 'Personalidade de estilo', progress: 55 },
  'etapa-12': { id: 'etapa-12', name: 'Transição', type: 'transition', description: 'Transição para questões estratégicas', progress: 60 },
  'etapa-13': { id: 'etapa-13', name: 'Estratégica 1', type: 'strategic', description: 'Problemas no guarda-roupa', progress: 65 },
  'etapa-14': { id: 'etapa-14', name: 'Estratégica 2', type: 'strategic', description: 'Investimento mensal', progress: 70 },
  'etapa-15': { id: 'etapa-15', name: 'Estratégica 3', type: 'strategic', description: 'Dificuldades no vestir', progress: 75 },
  'etapa-16': { id: 'etapa-16', name: 'Estratégica 4', type: 'strategic', description: 'Objetivos de mudança', progress: 80 },
  'etapa-17': { id: 'etapa-17', name: 'Estratégica 5', type: 'strategic', description: 'Preferência de orientação', progress: 85 },
  'etapa-18': { id: 'etapa-18', name: 'Estratégica 6', type: 'strategic', description: 'Disposição para investir', progress: 90 },
  'etapa-19': { id: 'etapa-19', name: 'Análise', type: 'transition', description: 'Transição final e análise', progress: 95 },
  'etapa-20': { id: 'etapa-20', name: 'Resultado', type: 'result', description: 'Página de resultado personalizado', progress: 100 },
  'etapa-21': { id: 'etapa-21', name: 'Oferta Final', type: 'offer', description: 'Oferta final e call-to-action', progress: 100 }
};

// 🔧 FUNÇÕES UTILITÁRIAS
export const getStepTemplate = (stepId: string) => {
  const templateFn = STEP_TEMPLATES[stepId as keyof typeof STEP_TEMPLATES];
  if (!templateFn) {
    console.warn(`❌ Template não encontrado para: ${stepId}`);
    return null;
  }
  
  try {
    const template = templateFn();
    console.log(`✅ Template carregado para ${stepId}: ${template.length} blocos`);
    return template;
  } catch (error) {
    console.error(`❌ Erro ao carregar template para ${stepId}:`, error);
    return null;
  }
};

export const getStepInfo = (stepId: string): StepInfo | null => {
  return STEP_INFO[stepId] || null;
};

export const getAllSteps = (): StepInfo[] => {
  return Object.values(STEP_INFO);
};
