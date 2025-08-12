/**
 * Editor Components Index
 * Exportações centralizadas dos componentes do editor
 */

// Principais componentes do editor
export { default as ComponentList } from './ComponentList';
export { default as PageEditorCanvas } from './PageEditorCanvas';
export { default as QuizEditorSteps } from './QuizEditorSteps';
export { default as SchemaDrivenEditorResponsive } from './SchemaDrivenEditorResponsive';

// Componentes com named exports
export { AddBlockButton } from './AddBlockButton';
// export { ComponentsPanel } from "./ComponentsPanel";
// export { DeleteBlockButton } from "./DeleteBlockButton";
export { default as EditBlockContent } from './EditBlockContent';
// export { EditorBlockItem } from "./EditorBlockItem";
export { EmptyEditor } from './EmptyEditor';
export { default as ModernPropertyPanel } from './ModernPropertyPanel';
export { PageEditor } from './PageEditor';
export { PropertyPanel } from './PropertyPanel';
export { StepsPanel } from './StepsPanel';

// 🎯 PAINEL DE PROPRIEDADES RECOMENDADO (use este!)
export { EnhancedUniversalPropertiesPanel } from '../universal/EnhancedUniversalPropertiesPanel';

// ❌ DEPRECIADO: Componentes de propriedades antigos (não usar)
// Para compatibilidade apenas - use EnhancedUniversalPropertiesPanel de ../universal/
export * from './properties';
