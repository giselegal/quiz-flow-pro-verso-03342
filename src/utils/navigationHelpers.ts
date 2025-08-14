/**
 * UTILITÁRIOS DE NAVEGAÇÃO PADRONIZADA
 * Converte entre formatos de ID de etapas e gerencia navegação
 */

// Converte número para ID de etapa padronizado
export const numberToStageId = (stepNumber: number): string => {
  return `step-${String(stepNumber).padStart(2, '0')}`;
};

// Converte ID de etapa para número
export const stageIdToNumber = (stageId: string): number => {
  const match = stageId.match(/step-(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
};

// Validação de etapa
export const isValidStepNumber = (stepNumber: number): boolean => {
  return stepNumber >= 1 && stepNumber <= 21 && Number.isInteger(stepNumber);
};

// Validação de ID de etapa
export const isValidStageId = (stageId: string): boolean => {
  const stepNumber = stageIdToNumber(stageId);
  return isValidStepNumber(stepNumber);
};

// Próxima etapa válida
export const getNextStepNumber = (currentStep: number): number | null => {
  const next = currentStep + 1;
  return isValidStepNumber(next) ? next : null;
};

// Etapa anterior válida
export const getPreviousStepNumber = (currentStep: number): number | null => {
  const previous = currentStep - 1;
  return isValidStepNumber(previous) ? previous : null;
};

// Lista completa de etapas
export const getAllStepNumbers = (): number[] => {
  return Array.from({ length: 21 }, (_, i) => i + 1);
};

// Lista completa de IDs de etapas
export const getAllStageIds = (): string[] => {
  return getAllStepNumbers().map(numberToStageId);
};

// Nomes das etapas
export const getStepName = (stepNumber: number): string => {
  const stepNames: Record<number, string> = {
    1: 'Introdução',
    2: 'Nome',
    3: 'Roupa Favorita',
    4: 'Estilo Pessoal', 
    5: 'Ocasiões',
    6: 'Cores',
    7: 'Texturas',
    8: 'Silhuetas',
    9: 'Acessórios',
    10: 'Inspiração',
    11: 'Conforto',
    12: 'Tendências',
    13: 'Investimento',
    14: 'Personalidade',
    15: 'Transição',
    16: 'Processamento',
    17: 'Resultado Parcial',
    18: 'Resultado Completo',
    19: 'Resultado Final',
    20: 'Lead Capture',
    21: 'Oferta'
  };
  return stepNames[stepNumber] || `Etapa ${stepNumber}`;
};

// Progresso percentual
export const calculateProgress = (currentStep: number, totalSteps: number = 21): number => {
  if (!isValidStepNumber(currentStep)) return 0;
  return Math.round((currentStep / totalSteps) * 100);
};