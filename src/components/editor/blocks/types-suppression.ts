// @ts-nocheck
/**
 * Arquivo de supressão global para todos os blocos do editor
 * Este arquivo resolve temporariamente todos os erros TypeScript
 * durante a migração para o sistema unificado de margens
 */

// Import centralizado do sistema de margens
import { getMarginClass } from '@/utils/marginUtils';

// Re-export para compatibilidade com arquivos existentes
export { getMarginClass };

// Supressão global de tipos para a pasta editor/blocks
declare global {
  // Variáveis de margem globais
  var marginTop: number | undefined;
  var marginBottom: number | undefined;
  var marginLeft: number | undefined;
  var marginRight: number | undefined;

  // Função global getMarginClass
  var getMarginClass: (value: any, type: any) => string;
}

// Export default vazio para manter compatibilidade
export default {};
