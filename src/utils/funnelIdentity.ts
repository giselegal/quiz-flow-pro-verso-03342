/**
 * 🔄 UTILITÁRIOS DE IDENTIDADE APRIMORADOS
 * 
 * Sistema melhorado de identificação que usa o novo sistema de validação:
 * - Validação rigorosa de IDs
 * - Normalização consistente
 * - Compatibilidade com sistema legado
 * - Error handling robusto
 */

import {
  validateFunnelId,
  parseStepNumber,
  normalizeStageId,
  generateInstanceKey
} from './idValidation';

/**
 * Obtém ID do funil com validação rigorosa de várias fontes
 */
export const getFunnelIdFromEnvOrStorage = (): string | null => {
  try {
    // Primeira tentativa: parâmetro da URL
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get('funnel');
    if (fromUrl) {
      const validation = validateFunnelId(fromUrl);
      if (validation.isValid) {
        console.log('✅ FunnelId válido da URL:', validation.normalized);
        return validation.normalized!;
      } else {
        console.warn('⚠️ FunnelId inválido na URL:', validation.error);
      }
    }

    // Segunda tentativa: localStorage
    const fromLs = window.localStorage.getItem('editor:funnelId');
    if (fromLs) {
      const validation = validateFunnelId(fromLs);
      if (validation.isValid) {
        console.log('✅ FunnelId válido do localStorage:', validation.normalized);
        return validation.normalized!;
      } else {
        console.warn('⚠️ FunnelId inválido no localStorage:', validation.error);
        // Remove ID inválido do localStorage
        window.localStorage.removeItem('editor:funnelId');
      }
    }

    // Terceira tentativa: variável de ambiente
    const fromEnv = import.meta.env.VITE_DEFAULT_FUNNEL_ID as string | undefined;
    if (fromEnv) {
      const validation = validateFunnelId(fromEnv);
      if (validation.isValid) {
        console.log('✅ FunnelId válido do env:', validation.normalized);
        return validation.normalized!;
      } else {
        console.warn('⚠️ FunnelId inválido no env:', validation.error);
      }
    }

    // Fallback: gerar novo ID válido
    const fallbackId = 'quiz21StepsComplete';
    console.log('🎯 Usando funnel ID padrão:', fallbackId);
    return fallbackId;
  } catch (error) {
    console.error('❌ Erro ao obter FunnelId:', error);
    return 'quiz21StepsComplete';
  }
};

/**
 * Salva ID do funil com validação no localStorage
 */
export const saveFunnelIdToStorage = (funnelId: string): boolean => {
  try {
    const validation = validateFunnelId(funnelId);

    if (!validation.isValid) {
      console.error('❌ Tentativa de salvar FunnelId inválido:', validation.error);
      return false;
    }

    window.localStorage.setItem('editor:funnelId', validation.normalized!);
    console.log('✅ FunnelId válido salvo:', validation.normalized);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar FunnelId:', error);
    return false;
  }
};

/**
 * Extrai e valida step number de stageId
 */
export const parseStepNumberFromStageId = (stageId: string | null | undefined): number => {
  return parseStepNumber(stageId);
};

/**
 * Normaliza stageId para label consistente
 */
export const normalizeStageIdLabel = (stageId: string | null | undefined): string => {
  return normalizeStageId(stageId);
};

/**
 * Gera instanceKey único com validação
 */
export const generateUniqueInstanceKey = (
  componentType: string,
  stepNumber: number
): string => {
  return generateInstanceKey(componentType, stepNumber);
};

/**
 * Valida se um funnelId tem formato válido - substituído por validateFunnelId
 * @deprecated Use validateFunnelId from idValidation.ts instead
 */
export const isValidFunnelId = (funnelId: string | null | undefined): boolean => {
  if (!funnelId || typeof funnelId !== 'string') return false;

  // Aceita UUIDs v4 válidos
  const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // Aceita IDs de template com prefixo
  const templatePattern = /^template-[a-zA-Z0-9\-_]{3,50}$/;

  // Aceita fallback padrão
  const defaultPattern = /^default-funnel$/;

  const isValid = uuidV4Pattern.test(funnelId) || templatePattern.test(funnelId) || defaultPattern.test(funnelId);

  if (!isValid) {
    console.warn(`⚠️ FunnelId inválido: ${funnelId}`);
  }

  return isValid;
};

/**
 * Obtém range de etapas disponíveis (1-21 por padrão)
 */
export const getAvailableStepNumbers = (maxSteps: number = 21): number[] => {
  return Array.from({ length: maxSteps }, (_, i) => i + 1);
};

/**
 * Verifica se um stepNumber está no range válido
 */
export const isValidStepNumber = (stepNumber: number, maxSteps: number = 21): boolean => {
  return Number.isInteger(stepNumber) && stepNumber >= 1 && stepNumber <= maxSteps;
};
