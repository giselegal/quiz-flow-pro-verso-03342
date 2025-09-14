/**
 * Editor Components Index
 * Exportações centralizadas dos componentes do editor
 */

// Principais componentes do editor
export { default as ComponentList } from './ComponentList';
// PageEditorCanvas removido - era apenas um placeholder que retornava null
export { default as QuizEditorSteps } from './QuizEditorSteps';
export { default as SchemaDrivenEditorResponsive } from './SchemaDrivenEditorResponsive';

// Componentes com named exports
export { AddBlockButton } from './AddBlockButton';
// export { ComponentsPanel } from "./ComponentsPanel";
// export { DeleteBlockButton } from "./DeleteBlockButton";
export { default as EditBlockContent } from './EditBlockContent';
// export { EditorBlockItem } from "./EditorBlockItem";
export { EmptyEditor } from './EmptyEditor';
export { PageEditor } from './PageEditor';
export { StepsPanel } from './StepsPanel';

// 🎯 PAINEL DE PROPRIEDADES RECOMENDADO (use este!)
export { EnhancedUniversalPropertiesPanel } from '../universal/EnhancedUniversalPropertiesPanel';

// ❌ DEPRECIADO: Componentes de propriedades antigos (não usar)
// Para compatibilidade apenas - use EnhancedUniversalPropertiesPanel de ../universal/
export * from './properties';
