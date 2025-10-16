/**
 * 🔄 STEP DATA ADAPTER - Normalização de Dados Robusta
 * 
 * Converte dados do editor (EditableQuizStep) para formato
 * esperado pelos componentes de step de produção.
 * 
 * FEATURES:
 * - Fallbacks defensivos completos por tipo de step
 * - Validação de dados obrigatórios
 * - Normalização consistente de metadata
 * - Type-safe com inferência automática
 * 
 * @created Sprint 4 - Modularização Completa
 */

import { EditableQuizStep, StepType } from '@/components/editor/quiz/types';
import { QUIZ_STEPS, QuizStep } from '@/data/quizSteps';

/**
 * 🎯 DEFAULTS POR TIPO DE STEP
 * Garante que sempre temos dados válidos mesmo sem metadata
 */
const STEP_DEFAULTS: Record<StepType, Partial<QuizStep>> = {
  'intro': {
    title: 'Bem-vindo ao Quiz de Estilo',
    formQuestion: 'Como posso te chamar?',
    placeholder: 'Digite seu primeiro nome aqui...',
    buttonText: 'Começar Quiz',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
  },
  'question': {
    questionNumber: '1 de 10',
    questionText: 'Selecione suas preferências',
    requiredSelections: 3,
    options: [],
  },
  'strategic-question': {
    questionNumber: '1 de 6',
    questionText: 'Selecione uma opção',
    requiredSelections: 1,
    options: [],
  },
  'transition': {
    title: 'Calculando seu resultado...',
    text: 'Aguarde enquanto analisamos suas respostas',
    duration: 3000,
    showContinueButton: false,
  },
  'transition-result': {
    title: 'Preparando seu resultado personalizado...',
    text: 'Seu estilo está sendo definido',
    duration: 2000,
    showContinueButton: false,
  },
  'result': {
    title: 'Seu Estilo Predominante',
    text: 'Descubra sua essência',
  },
  'offer': {
    title: 'Transforme Seu Estilo Hoje',
    text: 'Oferta especial personalizada',
    buttonText: 'Quero Conhecer',
    offerMap: {},
  },
};

/**
 * 🔄 ADAPTER PRINCIPAL
 * Converte EditableQuizStep para QuizStep com fallbacks completos
 */
export type AdaptSourceMode = 'merge' | 'production-only';

export const adaptStepData = (
  editableStep: EditableQuizStep,
  options?: { source?: AdaptSourceMode }
): QuizStep => {
  const mode: AdaptSourceMode = options?.source ?? 'merge';
  const stepType = editableStep.type;
  const defaults = STEP_DEFAULTS[stepType] || {};
  
  // Extrair metadata (pode estar em vários lugares)
  const metadata = extractMetadata(editableStep);
  
  // Buscar dados de produção se disponível
  const productionData = getProductionStepData(editableStep.id);
  
  // Se solicitado, usar apenas dados canônicos de produção + defaults (ignora metadata do editor)
  if (mode === 'production-only') {
    const adaptedProductionOnly: QuizStep = {
      id: editableStep.id,
      type: stepType,
      title: productionData?.title || defaults.title,
      questionNumber: productionData?.questionNumber || defaults.questionNumber,
      questionText: productionData?.questionText || defaults.questionText,
      formQuestion: productionData?.formQuestion || defaults.formQuestion,
      placeholder: productionData?.placeholder || defaults.placeholder,
      buttonText: productionData?.buttonText || defaults.buttonText,
      text: productionData?.text || defaults.text,
      image: productionData?.image || defaults.image,
      requiredSelections: productionData?.requiredSelections || defaults.requiredSelections,
      options: productionData?.options || defaults.options || [],
      nextStep: productionData?.nextStep,
      offerMap: productionData?.offerMap || defaults.offerMap,
      showContinueButton: productionData?.showContinueButton ?? defaults.showContinueButton,
      continueButtonText: productionData?.continueButtonText,
      duration: productionData?.duration || defaults.duration,
    };

    validateAdaptedData(adaptedProductionOnly);
    return adaptedProductionOnly;
  }

  // Merge com prioridade: metadata > productionData > defaults
  const adapted: QuizStep = {
    id: editableStep.id,
    type: stepType,
    
    // Textos principais
    title: metadata.title || productionData?.title || defaults.title,
    questionNumber: metadata.questionNumber || productionData?.questionNumber || defaults.questionNumber,
    questionText: metadata.questionText || (metadata as any).question || productionData?.questionText || defaults.questionText,
    formQuestion: metadata.formQuestion || productionData?.formQuestion || defaults.formQuestion,
    placeholder: metadata.placeholder || productionData?.placeholder || defaults.placeholder,
    buttonText: metadata.buttonText || productionData?.buttonText || defaults.buttonText,
    text: metadata.text || (metadata as any).description || productionData?.text || defaults.text,
    
    // Imagens e media
    image: metadata.image || (metadata as any).imageUrl || productionData?.image || defaults.image,
    
    // Configurações de questões
    requiredSelections: metadata.requiredSelections || productionData?.requiredSelections || defaults.requiredSelections,
    options: metadata.options || productionData?.options || defaults.options || [],
    
    // Navegação
    nextStep: editableStep.nextStep || productionData?.nextStep,
    
    // Dados específicos de offer
    offerMap: (editableStep as any).offerMap || productionData?.offerMap || defaults.offerMap,
    
    // Configurações de transição
    showContinueButton: metadata.showContinueButton ?? productionData?.showContinueButton ?? defaults.showContinueButton,
    continueButtonText: metadata.continueButtonText || productionData?.continueButtonText,
    duration: metadata.duration || productionData?.duration || defaults.duration,
  };
  
  // Validação pós-adaptação
  validateAdaptedData(adapted);
  
  return adapted;
};

/**
 * 🔍 EXTRAÇÃO DE METADATA
 * Suporta múltiplos formatos de metadata
 */
function extractMetadata(step: EditableQuizStep): Partial<QuizStep> {
  // Tentar várias fontes de metadata
  const metadata = (step as any).metadata || {};
  const settings = (step as any).settings || {};
  const properties = (step as any).properties || {};
  
  // Merge de todas as fontes
  return {
    ...properties,
    ...settings,
    ...metadata,
  };
}

/**
 * 📦 BUSCA DE DADOS DE PRODUÇÃO
 * Usa quizSteps.ts como fonte de verdade
 */
function getProductionStepData(stepId: string): QuizStep | undefined {
  return QUIZ_STEPS[stepId];
}

/**
 * ✅ VALIDAÇÃO DE DADOS ADAPTADOS
 * Garante integridade dos dados antes de renderizar
 */
function validateAdaptedData(data: QuizStep): void {
  const errors: string[] = [];
  
  // Validações por tipo
  switch (data.type) {
    case 'intro':
      if (!data.formQuestion) errors.push('Intro step missing formQuestion');
      if (!data.buttonText) errors.push('Intro step missing buttonText');
      break;
      
    case 'question':
    case 'strategic-question':
      if (!data.questionText) errors.push(`${data.type} missing questionText`);
      if (!data.options || data.options.length === 0) {
        errors.push(`${data.type} has no options`);
      }
      if (!data.requiredSelections || data.requiredSelections < 1) {
        errors.push(`${data.type} has invalid requiredSelections`);
      }
      break;
      
    case 'transition':
    case 'transition-result':
      if (!data.title && !data.text) {
        errors.push('Transition step missing title or text');
      }
      break;
      
    case 'result':
      if (!data.title) errors.push('Result step missing title');
      break;
      
    case 'offer':
      if (!data.buttonText) errors.push('Offer step missing buttonText');
      break;
  }
  
  // Log errors (não bloqueia renderização, usa fallbacks)
  if (errors.length > 0) {
    console.warn(`⚠️ Step ${data.id} validation warnings:`, errors);
  }
}

/**
 * 🎯 HELPER: Extrair número da etapa do ID
 */
export function extractStepNumber(stepId: string): number {
  const match = stepId.match(/step-?(\d+)/i);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * 🎯 HELPER: Obter tipo de step baseado no número
 */
export function inferStepType(stepNumber: number): StepType {
  if (stepNumber === 1) return 'intro';
  if (stepNumber >= 2 && stepNumber <= 11) return 'question';
  if (stepNumber === 12) return 'transition';
  if (stepNumber >= 13 && stepNumber <= 18) return 'strategic-question';
  if (stepNumber === 19) return 'transition-result';
  if (stepNumber === 20) return 'result';
  if (stepNumber === 21) return 'offer';
  return 'question';
}

/**
 * 🔧 HELPER: Validar se step precisa de answers
 */
export function requiresAnswers(stepType: StepType): boolean {
  return stepType === 'question' || stepType === 'strategic-question';
}

/**
 * 🔧 HELPER: Validar se step pode avançar automaticamente
 */
export function canAutoAdvance(stepType: StepType): boolean {
  return stepType === 'transition' || stepType === 'transition-result';
}
