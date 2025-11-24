/**
 * 🔄 IMPORTS CENTRALIZADOS - FASE 3
 * 
 * Exporta funções de acesso aos serviços principais
 * para evitar imports circulares e warnings do Vite
 */

import { UnifiedQuizStorageService } from './UnifiedQuizStorage';
import { FunnelContext } from '@/core/contexts/FunnelContext';

// Instância singleton do UnifiedQuizStorage
let unifiedQuizStorageInstance: UnifiedQuizStorageService | null = null;

/**
 * Obtém instância do UnifiedQuizStorage
 */
export function getUnifiedQuizStorage(context: FunnelContext = FunnelContext.EDITOR): UnifiedQuizStorageService {
    if (!unifiedQuizStorageInstance) {
        unifiedQuizStorageInstance = new UnifiedQuizStorageService(context);
    }
    return unifiedQuizStorageInstance;
}

/**
 * Reseta instância (útil para testes)
 */
export function resetUnifiedQuizStorage(): void {
    unifiedQuizStorageInstance = null;
}

export default {
    getUnifiedQuizStorage,
    resetUnifiedQuizStorage,
};
