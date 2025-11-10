import { appLogger } from '@/lib/utils/appLogger';
// @ts-nocheck
/**
 * Utility to clean localStorage from invalid quiz-question blocks
 * that shouldn't appear in Step 1 of the funnel
 */

export const cleanEditorLocalStorage = () => {
  try {
    const savedConfig = localStorage.getItem('editor_config');
    if (!savedConfig) return;

    const config = JSON.parse(savedConfig);
    if (!config.blocks) return;

    // Count quiz-question blocks before cleanup
    const quizQuestionsBefore = config.blocks.filter(
      (block: any) => block.type === 'quiz-question',
    ).length;

    // Remove quiz-question blocks (these belong in steps 2-11, not step 1)
    config.blocks = config.blocks.filter((block: any) => {
      const isQuizQuestion = block.type === 'quiz-question';
      if (isQuizQuestion) {
        appLogger.warn('🧹 Removing invalid quiz-question block:', { data: [{
                    id: block.id,
                    type: block.type,
                    content: block.content,
                  }] });
      }
      return !isQuizQuestion;
    });

    // Save cleaned config back to localStorage
    localStorage.setItem('editor_config', JSON.stringify(config));

    if (quizQuestionsBefore > 0) {
      appLogger.info(`✅ Cleaned ${quizQuestionsBefore} invalid quiz-question blocks from localStorage`);
      return quizQuestionsBefore;
    }

    return 0;
  } catch (error) {
    appLogger.error('❌ Error cleaning localStorage:', { data: [error] });
    return 0;
  }
};

/**
 * 🧹 CORREÇÃO CRÍTICA - LIMPEZA AUTOMÁTICA PARA ETAPA 20
 * 
 * Limpa automaticamente dados corrompidos ou excessivos do localStorage
 * que podem estar causando falhas no carregamento da etapa 20
 */
export const cleanStorageForStep20 = () => {
  try {
    const usage = JSON.stringify(localStorage).length;
    const maxSize = 5 * 1024 * 1024; // 5MB
    let cleaned = 0;
    
    appLogger.info(`📊 [Step20] localStorage usage: ${(usage / 1024 / 1024).toFixed(2)}MB`);
    
    // Lista de chaves para limpeza
    const keysToClean = [
      'editor_config_backup',
      'quiz_old_cache',
      'temp_selections',
      'draft_blocks',
      'canvas_state',
      'preview_cache',
    ];
    
    // Limpar dados obsoletos
    keysToClean.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        cleaned++;
        appLogger.info(`🧹 Removed obsolete key: ${key}`);
      }
    });
    
    // Se ainda estiver próximo do limite, limpar dados antigos
    if (usage > maxSize * 0.8) {
      appLogger.warn('🚨 [Step20] localStorage próximo do limite, limpeza agressiva...');
      
      // Preservar apenas dados essenciais
      const essentialKeys = ['userName', 'user_name', 'quizResult', 'userSelections', 'quizAnswers'];
      const backup: Record<string, string> = {};
      
      // Backup de dados essenciais
      essentialKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) backup[key] = value;
      });
      
      // Limpar tudo e restaurar essenciais
      localStorage.clear();
      Object.entries(backup).forEach(([key, value]) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          appLogger.warn(`⚠️ Failed to restore ${key}:`, { data: [e] });
        }
      });
      
      cleaned += 10; // Aproximado
      appLogger.info('🧹 Performed aggressive cleanup, restored essential data only');
    }
    
    // Limpar editor_config corrompido
    try {
      const editorConfig = localStorage.getItem('editor_config');
      if (editorConfig) {
        const parsed = JSON.parse(editorConfig);
        if (!parsed || typeof parsed !== 'object') {
          localStorage.removeItem('editor_config');
          cleaned++;
          appLogger.info('🧹 Removed corrupted editor_config');
        }
      }
    } catch {
      localStorage.removeItem('editor_config');
      cleaned++;
      appLogger.info('🧹 Removed unparseable editor_config');
    }
    
    appLogger.info(`✅ [Step20] Cleaned ${cleaned} items from localStorage`);
    return cleaned;
    
  } catch (error) {
    appLogger.error('❌ [Step20] Error in storage cleanup:', { data: [error] });
    return 0;
  }
};

export const clearEditorLocalStorage = () => {
  try {
    localStorage.removeItem('editor_config');
    appLogger.info('✅ Cleared editor localStorage');
  } catch (error) {
    appLogger.error('❌ Error clearing localStorage:', { data: [error] });
  }
};
