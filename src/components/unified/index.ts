/**
 * UNIFIED COMPONENTS INDEX - Sistema Consolidado de Componentes (Phase 3.2 Updated)
 */

// ✅ Import UniversalBlockRenderer instead of ConsolidatedBlockRenderer (Phase 3.2)
import UniversalBlockRenderer from '../editor/blocks/UniversalBlockRenderer';
import ConsolidatedPropertiesPanel from './ConsolidatedPropertiesPanel';

// ✅ Updated exports to use UniversalBlockRenderer (Phase 3.2 consolidation)
export { UniversalBlockRenderer, ConsolidatedPropertiesPanel };

// Types unificados
export type { UniversalBlockRendererProps } from '../editor/blocks/UniversalBlockRenderer';

// Legacy compatibility aliases
export { UniversalBlockRenderer as ConsolidatedBlockRenderer };
export { ConsolidatedPropertiesPanel as UniversalPropertiesPanel };

// Sistema completo consolidado
export const ConsolidatedSystem = {
  BlockRenderer: UniversalBlockRenderer,
  PropertiesPanel: ConsolidatedPropertiesPanel,
};

export default ConsolidatedSystem;
