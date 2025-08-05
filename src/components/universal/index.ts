// Importa os componentes
import { EnhancedUniversalPropertiesPanel } from "./EnhancedUniversalPropertiesPanel";
import SimplifiedUniversalPropertiesPanel from "./SimplifiedUniversalPropertiesPanel";
import { UniversalPropertiesPanel } from "./UniversalPropertiesPanel";

// Exportações internas necessárias para resolver os problemas de importação
export * from "./UniversalPropertiesPanel";

// Exporta os componentes principais
export {
  EnhancedUniversalPropertiesPanel,
  SimplifiedUniversalPropertiesPanel,
  UniversalPropertiesPanel,
};

// Exportação padrão para compatibilidade
export default SimplifiedUniversalPropertiesPanel;
