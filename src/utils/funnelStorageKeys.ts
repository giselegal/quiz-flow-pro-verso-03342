/**
 * 🗝️ FUNNEL STORAGE KEYS
 * 
 * Utilitário para gerar chaves de armazenamento únicas por funil
 * Garante isolamento completo de dados entre diferentes funis
 */

/**
 * Gera chave única para armazenamento de dados específicos de um funil
 */
export const generateFunnelStorageKey = (
  dataType: 'session' | 'step' | 'response' | 'user' | 'progress' | 'config',
  funnelId: string,
  identifier?: string
): string => {
  const baseKey = `funnel_${dataType}_${funnelId}`;
  return identifier ? `${baseKey}_${identifier}` : baseKey;
};

/**
 * Gera chave para sessão específica de um funil
 */
export const getFunnelSessionKey = (funnelId: string): string => {
  return generateFunnelStorageKey('session', funnelId);
};

/**
 * Gera chave para dados de uma etapa específica
 */
export const getFunnelStepKey = (funnelId: string, stepId: string): string => {
  return generateFunnelStorageKey('step', funnelId, stepId);
};

/**
 * Gera chave para resposta de um componente específico
 */
export const getFunnelResponseKey = (funnelId: string, componentId: string): string => {
  return generateFunnelStorageKey('response', funnelId, componentId);
};

/**
 * Gera chave para dados do usuário em um funil específico
 */
export const getFunnelUserKey = (funnelId: string, userId?: string): string => {
  return generateFunnelStorageKey('user', funnelId, userId);
};

/**
 * Gera chave para progresso em um funil específico
 */
export const getFunnelProgressKey = (funnelId: string): string => {
  return generateFunnelStorageKey('progress', funnelId);
};

/**
 * Gera chave para configuração de um funil específico
 */
export const getFunnelConfigKey = (funnelId: string): string => {
  return generateFunnelStorageKey('config', funnelId);
};

/**
 * Lista todas as chaves relacionadas a um funil específico
 */
export const listFunnelKeys = (funnelId: string): string[] => {
  if (typeof window === 'undefined') return [];
  
  const funnelPrefix = `funnel_`;
  const funnelKeys: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(funnelPrefix) && key.includes(`_${funnelId}_`)) {
      funnelKeys.push(key);
    }
  }
  
  return funnelKeys;
};

/**
 * Remove todos os dados de um funil específico
 */
export const clearFunnelData = (funnelId: string): void => {
  if (typeof window === 'undefined') return;
  
  const keysToRemove = listFunnelKeys(funnelId);
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`🗑️ Removidos ${keysToRemove.length} itens do funil ${funnelId}`);
};

/**
 * Migra dados existentes para o novo formato com funnelId
 */
export const migrateLegacyData = (funnelId: string): void => {
  if (typeof window === 'undefined') return;
  
  const legacyPatterns = [
    'quiz_session_id',
    'quiz_step_',
    'quiz_response_',
    'quiz_user_name_',
    'quiz_progress'
  ];
  
  const migratedKeys: string[] = [];
  
  legacyPatterns.forEach(pattern => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(pattern)) {
        const value = localStorage.getItem(key);
        if (value) {
          // Determinar novo formato da chave
          let newKey: string;
          if (key === 'quiz_session_id') {
            newKey = getFunnelSessionKey(funnelId);
          } else if (key.startsWith('quiz_step_')) {
            const stepId = key.replace('quiz_step_', '');
            newKey = getFunnelStepKey(funnelId, stepId);
          } else if (key.startsWith('quiz_response_')) {
            const componentId = key.replace('quiz_response_', '');
            newKey = getFunnelResponseKey(funnelId, componentId);
          } else if (key.startsWith('quiz_user_name_')) {
            const userId = key.replace('quiz_user_name_', '');
            newKey = getFunnelUserKey(funnelId, userId);
          } else if (key === 'quiz_progress') {
            newKey = getFunnelProgressKey(funnelId);
          } else {
            continue;
          }
          
          // Migrar dados
          localStorage.setItem(newKey, value);
          migratedKeys.push(`${key} → ${newKey}`);
          
          // Remover chave antiga (opcional)
          // localStorage.removeItem(key);
        }
      }
    }
  });
  
  if (migratedKeys.length > 0) {
    console.log(`🔄 Migrados ${migratedKeys.length} itens para o funil ${funnelId}:`);
    migratedKeys.forEach(migration => console.log(`  ${migration}`));
  }
};

/**
 * Debug: Lista todos os dados de um funil
 */
export const debugFunnelData = (funnelId: string): Record<string, any> => {
  if (typeof window === 'undefined') return {};
  
  const funnelKeys = listFunnelKeys(funnelId);
  const data: Record<string, any> = {};
  
  funnelKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    }
  });
  
  return data;
};
