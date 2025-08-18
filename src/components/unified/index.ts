/**
 * UNIFIED COMPONENTS INDEX - Sistema Consolidado de Componentes
 */

import ConsolidatedBlockRenderer from './ConsolidatedBlockRenderer';
import ConsolidatedPropertiesPanel from './ConsolidatedPropertiesPanel';

// Componentes consolidados principais
export { ConsolidatedBlockRenderer, ConsolidatedPropertiesPanel };

// Types unificados
export type { ConsolidatedBlockRendererProps } from './ConsolidatedBlockRenderer';

// Aliases para compatibilidade
export { ConsolidatedBlockRenderer as UniversalBlockRenderer };
export { ConsolidatedPropertiesPanel as UniversalPropertiesPanel };

// Sistema completo consolidado
export const ConsolidatedSystem = {
  BlockRenderer: ConsolidatedBlockRenderer,
  PropertiesPanel: ConsolidatedPropertiesPanel,
};

export default ConsolidatedSystem;
