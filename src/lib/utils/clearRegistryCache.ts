/**
 * 🗑️ CLEAR REGISTRY CACHE - Utilitário de debug
 * 
 * Limpa todos os caches do TemplateService
 * Útil após alterações no código de normalização
 */

import { templateService } from '@/services';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Limpar cache e forçar recarga dos templates
 * 
 * Uso no console:
 * ```js
 * import('@/lib/utils/clearRegistryCache').then(m => m.clearAllCaches())
 * ```
 */
export async function clearAllCaches(): Promise<void> {
  console.group('🗑️ Limpando todos os caches...');
  
  try {
    // Limpar cache do TemplateService (Memory + IndexedDB)
    templateService.clearCache();
    appLogger.info('✅ Cache (Memory) limpo');
    
    // 3. Limpar versão do localStorage
    try {
      localStorage.removeItem('registry-cache-version');
      appLogger.info('✅ localStorage limpo');
    } catch {
      appLogger.warn('⚠️ Não foi possível limpar localStorage');
    }
    
    appLogger.info('\n✅ Todos os caches limpos com sucesso!');
    appLogger.info('💡 Recarregue a página (Ctrl+Shift+R) para aplicar as mudanças');
  } catch (error) {
    appLogger.error('❌ Erro ao limpar caches:', { data: [error] });
  }
  
  console.groupEnd();
}

/**
 * Limpar apenas cache em memória (mais rápido)
 */
export function clearMemoryCache(): void {
  templateService.clearCache();
  appLogger.info('✅ Cache limpo - recarregue a página');
}

/**
 * Expor no window para fácil acesso no console
 */
if (typeof window !== 'undefined') {
  (window as any).clearRegistryCache = clearAllCaches;
  (window as any).clearMemoryCache = clearMemoryCache;
  appLogger.info('💡 Debug utils disponíveis: clearRegistryCache() ou clearMemoryCache()');
}
