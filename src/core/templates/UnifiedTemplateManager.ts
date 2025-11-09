/**
 * 🎯 UNIFIED TEMPLATE MANAGER - STUB
 * 
 * Mantido por compatibilidade - desabilitado temporariamente para permitir build
 */

interface TemplateManager {
  isEnabled: boolean;
  reason: string;
}

export const UnifiedTemplateManager: TemplateManager = {
  isEnabled: false,
  reason: 'Module conflicts - will be re-enabled in future release',
};

export default UnifiedTemplateManager;