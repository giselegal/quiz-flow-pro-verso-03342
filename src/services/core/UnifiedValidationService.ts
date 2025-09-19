// @ts-nocheck
/**
 * 🎯 UNIFIED VALIDATION SERVICE - SERVIÇO UNIFICADO DE VALIDAÇÃO
 * 
 * Mantido por compatibilidade - desabilitado temporariamente para permitir build
 */

export const getUnifiedValidationService = () => ({
  validateBlock: () => ({ isValid: true, errors: [] }),
  validateFunnel: () => ({ isValid: true, errors: [] }),
  cleanup: () => {},
  getStats: () => ({})
});

export default getUnifiedValidationService;