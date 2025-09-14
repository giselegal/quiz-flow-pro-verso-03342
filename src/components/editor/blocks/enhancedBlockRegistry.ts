/**
 * @deprecated Este arquivo está sendo descontinuado. Importe de './EnhancedBlockRegistry' em vez disso.
 * 
 * Este arquivo é mantido apenas para compatibilidade com código existente.
 * Será removido em uma versão futura.
 */

// 🔁 Evitar ciclo circular: não reexportar, apenas definir stub
export const ENHANCED_BLOCK_REGISTRY = {};
export const getEnhancedBlockComponent = (type: string) => null;
export const AVAILABLE_COMPONENTS = [];
export const getRegistryStats = () => ({ total: 0, loaded: 0 });
export const normalizeBlockProperties = (block: any) => block;
export const getDeprecatedRegistryStats = getRegistryStats;
export default ENHANCED_BLOCK_REGISTRY;