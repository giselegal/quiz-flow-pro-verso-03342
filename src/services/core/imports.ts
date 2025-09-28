/**
 * 🎯 CENTRALIZED CORE SERVICE IMPORTS
 * 
 * Este arquivo centraliza todos os imports de serviços core para evitar
 * warnings do Vite sobre imports dinâmicos/estáticos misturados.
 */

// Import estático do UnifiedQuizStorage
import { unifiedQuizStorage } from './UnifiedQuizStorage';

// Export centralizado para uso em imports dinâmicos
export const getUnifiedQuizStorage = () => unifiedQuizStorage;

// Função para carregar serviço de forma consistente
export const loadCoreService = async (serviceName: string) => {
  switch (serviceName) {
    case 'UnifiedQuizStorage':
      return {
        service: unifiedQuizStorage,
        source: 'static-import'
      };
    default:
      return null;
  }
};

// Export do serviço para compatibilidade
export { unifiedQuizStorage };
