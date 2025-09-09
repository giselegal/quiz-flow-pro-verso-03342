/**
 * 🔄 MIGRAÇÃO DE DADOS PARA SISTEMA CONTEXTUAL
 * 
 * Utilitário para migrar dados existentes do sistema antigo (sem contexto)
 * para o novo sistema com isolamento por contexto
 */

import { FunnelContext, generateContextualStorageKey } from '@/core/contexts/FunnelContext';

export interface MigrationResult {
  success: boolean;
  migratedItems: number;
  errors: string[];
  details: string[];
}

/**
 * Migra dados do localStorage antigo para o sistema contextual
 */
export const migrateLegacyFunnelData = (): MigrationResult => {
  const result: MigrationResult = {
    success: false,
    migratedItems: 0,
    errors: [],
    details: [],
  };

  try {
    console.log('🔄 Iniciando migração de dados legados...');

    // Padrões de chaves antigas que precisam ser migradas
    const legacyPatterns = [
      { pattern: /^funnel-/, context: FunnelContext.EDITOR },
      { pattern: /^funnels-list$/, context: FunnelContext.EDITOR },
      { pattern: /^editor:funnelId$/, context: FunnelContext.EDITOR },
      { pattern: /^quiz_/, context: FunnelContext.PREVIEW },
      { pattern: /^template-/, context: FunnelContext.TEMPLATES },
    ];

    // Escanear todas as chaves do localStorage
    const allKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) allKeys.push(key);
    }

    console.log(`📊 Encontradas ${allKeys.length} chaves no localStorage`);

    // Migrar cada chave que corresponde aos padrões legados
    for (const key of allKeys) {
      for (const { pattern, context } of legacyPatterns) {
        if (pattern.test(key)) {
          try {
            const success = migrateSingleKey(key, context);
            if (success) {
              result.migratedItems++;
              result.details.push(`✅ ${key} → ${context}`);
            } else {
              result.errors.push(`❌ Falha ao migrar: ${key}`);
            }
          } catch (error) {
            result.errors.push(`❌ Erro ao migrar ${key}: ${error}`);
          }
          break; // Parar no primeiro padrão que corresponder
        }
      }
    }

    // Migrar dados específicos conhecidos
    migrateSpecificData(result);

    result.success = result.errors.length === 0;
    
    console.log(`✅ Migração concluída:`);
    console.log(`  - Itens migrados: ${result.migratedItems}`);
    console.log(`  - Erros: ${result.errors.length}`);

    return result;
  } catch (error) {
    result.errors.push(`❌ Erro geral na migração: ${error}`);
    result.success = false;
    return result;
  }
};

/**
 * Migra uma chave específica para o contexto apropriado
 */
const migrateSingleKey = (oldKey: string, targetContext: FunnelContext): boolean => {
  try {
    const data = localStorage.getItem(oldKey);
    if (!data) return false;

    // Determinar nova chave baseada no padrão
    let newKey: string;

    if (oldKey.startsWith('funnel-')) {
      const funnelId = oldKey.replace('funnel-', '');
      newKey = generateContextualStorageKey(targetContext, 'funnel', funnelId);
    } else if (oldKey === 'funnels-list') {
      newKey = generateContextualStorageKey(targetContext, 'funnels-list');
    } else if (oldKey === 'editor:funnelId') {
      newKey = generateContextualStorageKey(targetContext, 'current-funnel-id');
    } else if (oldKey.startsWith('quiz_')) {
      const identifier = oldKey.replace('quiz_', '');
      newKey = generateContextualStorageKey(targetContext, 'quiz', identifier);
    } else if (oldKey.startsWith('template-')) {
      const templateId = oldKey.replace('template-', '');
      newKey = generateContextualStorageKey(targetContext, 'template', templateId);
    } else {
      // Fallback genérico
      newKey = generateContextualStorageKey(targetContext, 'legacy', oldKey);
    }

    // Verificar se a nova chave já existe
    if (localStorage.getItem(newKey)) {
      console.log(`⚠️ Chave contextual já existe: ${newKey}`);
      return false;
    }

    // Migrar dados
    localStorage.setItem(newKey, data);
    console.log(`🔄 Migrado: ${oldKey} → ${newKey}`);

    // Remover chave antiga (opcional - comentado por segurança)
    // localStorage.removeItem(oldKey);

    return true;
  } catch (error) {
    console.error(`❌ Erro ao migrar chave ${oldKey}:`, error);
    return false;
  }
};

/**
 * Migra dados específicos conhecidos
 */
const migrateSpecificData = (result: MigrationResult): void => {
  // Migrar ID do funil ativo do editor
  const editorFunnelId = localStorage.getItem('editor:funnelId');
  if (editorFunnelId && !localStorage.getItem(generateContextualStorageKey(FunnelContext.EDITOR, 'current-funnel-id'))) {
    localStorage.setItem(
      generateContextualStorageKey(FunnelContext.EDITOR, 'current-funnel-id'),
      editorFunnelId
    );
    result.migratedItems++;
    result.details.push(`✅ Editor funnel ID migrado: ${editorFunnelId}`);
  }

  // Migrar configurações de quiz
  const quizConfig = localStorage.getItem('quiz_funnel_config');
  if (quizConfig && !localStorage.getItem(generateContextualStorageKey(FunnelContext.PREVIEW, 'config'))) {
    localStorage.setItem(
      generateContextualStorageKey(FunnelContext.PREVIEW, 'config'),
      quizConfig
    );
    result.migratedItems++;
    result.details.push(`✅ Quiz config migrado`);
  }

  // Migrar respostas de quiz
  const quizResponses = localStorage.getItem('quizResponses');
  if (quizResponses && !localStorage.getItem(generateContextualStorageKey(FunnelContext.PREVIEW, 'responses'))) {
    localStorage.setItem(
      generateContextualStorageKey(FunnelContext.PREVIEW, 'responses'),
      quizResponses
    );
    result.migratedItems++;
    result.details.push(`✅ Quiz responses migradas`);
  }
};

/**
 * Verifica se há dados legados que precisam ser migrados
 */
export const checkForLegacyData = (): boolean => {
  const legacyKeys = [
    'funnel-',
    'funnels-list',
    'editor:funnelId',
    'quiz_',
    'template-',
    'quizResponses',
    'quiz_funnel_config',
  ];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      for (const legacyKey of legacyKeys) {
        if (key.startsWith(legacyKey) || key === legacyKey) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Limpa dados legados após migração bem-sucedida
 */
export const cleanupLegacyData = (): number => {
  const legacyKeys = [
    'funnel-',
    'funnels-list',
    'editor:funnelId',
    'quiz_',
    'template-',
    'quizResponses',
    'quiz_funnel_config',
  ];

  let removedCount = 0;
  const allKeys: string[] = [];
  
  // Coletar todas as chaves
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) allKeys.push(key);
  }

  // Remover chaves legadas
  for (const key of allKeys) {
    for (const legacyKey of legacyKeys) {
      if (key.startsWith(legacyKey) || key === legacyKey) {
        localStorage.removeItem(key);
        removedCount++;
        console.log(`🗑️ Removido dado legado: ${key}`);
        break;
      }
    }
  }

  console.log(`🧹 Limpeza concluída: ${removedCount} itens legados removidos`);
  return removedCount;
};

/**
 * Executa migração completa com confirmação
 */
export const executeMigrationWithConfirmation = (): Promise<MigrationResult> => {
  return new Promise((resolve) => {
    const hasLegacyData = checkForLegacyData();
    
    if (!hasLegacyData) {
      console.log('✅ Nenhum dado legado encontrado');
      resolve({
        success: true,
        migratedItems: 0,
        errors: [],
        details: ['ℹ️ Nenhum dado legado para migrar'],
      });
      return;
    }

    console.log('⚠️ Dados legados encontrados. Iniciando migração...');
    const result = migrateLegacyFunnelData();
    
    if (result.success && result.migratedItems > 0) {
      console.log('🎉 Migração bem-sucedida!');
      
      // Opcional: limpar dados legados após migração
      // const cleanedCount = cleanupLegacyData();
      // result.details.push(`🧹 ${cleanedCount} itens legados removidos`);
    }

    resolve(result);
  });
};
