/**
 * 🗑️ CLEAR REGISTRY CACHE - Utilitário de debug
 * 
 * Limpa todos os caches do TemplateService
 * Útil após alterações no código de normalização
 */

import { templateService } from '@/services/canonical/TemplateService';

/**
 * Limpar cache e forçar recarga dos templates
 * 
 * Uso no console:
 * ```js
 * import('@/utils/clearRegistryCache').then(m => m.clearAllCaches())
 * ```
 */
export async function clearAllCaches(): Promise<void> {
  console.group('🗑️ Limpando todos os caches...');
  
  try {
    // Limpar cache do TemplateService (Memory + IndexedDB)
    templateService.clearCache();
    console.log('✅ Cache (Memory) limpo');
    
    // 3. Limpar versão do localStorage
    try {
      localStorage.removeItem('registry-cache-version');
      console.log('✅ localStorage limpo');
    } catch {
      console.warn('⚠️ Não foi possível limpar localStorage');
    }
    
    console.log('\n✅ Todos os caches limpos com sucesso!');
    console.log('💡 Recarregue a página (Ctrl+Shift+R) para aplicar as mudanças');
  } catch (error) {
    console.error('❌ Erro ao limpar caches:', error);
  }
  
  console.groupEnd();
}

/**
 * Limpar apenas cache em memória (mais rápido)
 */
export function clearMemoryCache(): void {
  templateService.clearCache();
  console.log('✅ Cache limpo - recarregue a página');
}

/**
 * Expor no window para fácil acesso no console
 */
if (typeof window !== 'undefined') {
  (window as any).clearRegistryCache = clearAllCaches;
  (window as any).clearMemoryCache = clearMemoryCache;
  console.log('💡 Debug utils disponíveis: clearRegistryCache() ou clearMemoryCache()');
}
