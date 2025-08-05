// Importa as duas formas de exportação
import UniversalPropertiesPanelDefault, {
  UniversalPropertiesPanel as UniversalPropertiesPanelNamed,
} from "./UniversalPropertiesPanel";

// Re-exporta tanto como exportação nomeada quanto como padrão para compatibilidade
export const UniversalPropertiesPanel = UniversalPropertiesPanelNamed;
export default UniversalPropertiesPanelDefault;
