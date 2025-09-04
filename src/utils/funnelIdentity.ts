/**
 * Utilitários de identidade para funil e etapas
 *
 * Normaliza o sistema de identificação:
 * - stageId (UUID interno) vs stepNumber (ordem)
 * - Labels de exibição padronizados
 * - Compatibilidade com sistema legado
 */

/**
 * Obtém ID do funil de várias fontes (URL, localStorage, env)
 */
export const getFunnelIdFromEnvOrStorage = (): string | null => {
  try {
    // Primeira tentativa: parâmetro da URL
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get('funnel'); // ✅ CORRIGIDO: usar 'funnel' em vez de 'funnelId'
    if (fromUrl) {
      console.log('🔍 FunnelId da URL:', fromUrl);
      return fromUrl;
    }

    // Segunda tentativa: localStorage
    const fromLs = window.localStorage.getItem('editor:funnelId');
    if (fromLs) {
      console.log('🔍 FunnelId do localStorage:', fromLs);
      return fromLs;
    }

    // Terceira tentativa: variável de ambiente
    const fromEnv = import.meta.env.VITE_DEFAULT_FUNNEL_ID as string | undefined;
    if (fromEnv) {
      console.log('🔍 FunnelId do env:', fromEnv);
      return fromEnv;
    }

    console.log('⚠️ Nenhum FunnelId encontrado, usando default');
    return 'default-funnel';
  } catch (error) {
    console.error('❌ Erro ao obter FunnelId:', error);
    return 'default-funnel';
  }
};

/**
 * Salva ID do funil no localStorage para persistência
 */
export const saveFunnelIdToStorage = (funnelId: string): void => {
  try {
    window.localStorage.setItem('editor:funnelId', funnelId);
    console.log('💾 FunnelId salvo:', funnelId);
  } catch (error) {
    console.error('❌ Erro ao salvar FunnelId:', error);
  }
};

/**
 * Extrai número da etapa de um stageId (compatibilidade com sistema legado)
 *
 * @example
 * parseStepNumberFromStageId("step-1") => 1
 * parseStepNumberFromStageId("step-01") => 1
 * parseStepNumberFromStageId("uuid-here") => 1 (fallback)
 */
export const parseStepNumberFromStageId = (stageId: string | null | undefined): number => {
  if (!stageId) return 1;

  const match = String(stageId).match(/step-(\d+)/);
  if (match) {
    const num = Math.max(1, parseInt(match[1], 10));
    console.log(`🔢 StepNumber extraído: ${stageId} => ${num}`);
    return num;
  }

  console.log(`⚠️ StageId não reconhecido: ${stageId}, usando 1`);
  return 1;
};

/**
 * Normaliza stageId para label de exibição consistente
 *
 * @example
 * normalizeStageIdLabel("step-01") => "step-1"
 * normalizeStageIdLabel("step-1") => "step-1"
 * normalizeStageIdLabel("uuid") => "step-1"
 */
export const normalizeStageIdLabel = (stageId: string | null | undefined): string => {
  const stepNumber = parseStepNumberFromStageId(stageId);
  const normalized = `step-${stepNumber}`;

  if (stageId !== normalized) {
    console.log(`📝 Label normalizado: ${stageId} => ${normalized}`);
  }

  return normalized;
};

/**
 * Gera instanceKey único para componente
 */
export const generateInstanceKey = (componentType: string, stepNumber: number): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const key = `${componentType}-${stepNumber}-${timestamp}-${random}`;

  console.log(`🔑 InstanceKey gerada: ${key}`);
  return key;
};

/**
 * Valida se um funnelId tem formato válido
 */
export const isValidFunnelId = (funnelId: string | null | undefined): boolean => {
  if (!funnelId || typeof funnelId !== 'string') return false;

  // Aceita UUIDs ou IDs alfanuméricos com hífens
  const isValid = /^[a-zA-Z0-9\-_]{3,50}$/.test(funnelId);

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
