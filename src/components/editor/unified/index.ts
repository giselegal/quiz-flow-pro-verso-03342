/**
 * 🎨 EDITOR UNIFICADO - EXPORTS
 *
 * Exporta todos os componentes do sistema Editor Unificado
 */

// Componentes principais
export { EditorControlsManager } from './EditorControlsManager';
export { EditorPropertiesPanel } from './EditorPropertiesPanel';
export { EditorStageManager } from './EditorStageManager';
export { SortablePreviewBlockWrapper } from './SortablePreviewBlockWrapper';
export { UnifiedPreviewEngine } from './UnifiedPreviewEngine';
export { ProductionPreviewEngine } from './ProductionPreviewEngine';
export { EditorBlockRenderer } from './EditorBlockRenderer';
export { EnhancedBlockRenderer } from './EnhancedBlockRenderer';
export { MockDataProvider, useMockData, useMockStepData } from './MockDataProvider';
export { ValidationIndicator, ValidationBadge, useValidation } from './ValidationIndicator';
export { UnifiedQuizStepLoader } from './UnifiedQuizStepLoader';

// Componentes de resultado (Fase 3)
export { EditableStep20Result } from '../result/EditableStep20Result';
export { EditableText } from '../result/EditableText';
export { EditableColor } from '../result/EditableColor';
export { StyleSelector } from '../result/StyleSelector';
export { ResultPreviewSwitcher } from '../result/ResultPreviewSwitcher';
export { MockResultGenerator } from '../result/MockResultGenerator';

// Componentes interativos (Fase 4)
export { InlineEditableBlock } from '../interactive/InlineEditableBlock';
export { BlockPropertyPanel } from '../interactive/BlockPropertyPanel';
export { DragDropBlockManager } from '../interactive/DragDropBlockManager';
export { InteractivePreviewEngine } from '../interactive/InteractivePreviewEngine';

// Types
export type { EditorControlsManagerProps } from './EditorControlsManager';
export type { EditorPropertiesPanelProps, PropertyConfig } from './EditorPropertiesPanel';
export type { EditorStageManagerProps } from './EditorStageManager';
export type { UnifiedPreviewEngineProps } from './UnifiedPreviewEngine';
export type { ProductionPreviewEngineProps } from './ProductionPreviewEngine';
export type { EditorBlockRendererProps } from './EditorBlockRenderer';
export type { ValidationIndicatorProps, ValidationState } from './ValidationIndicator';

// Hooks (Fase 3 & 4)
export { useQuizResultEditor } from '@/hooks/useQuizResultEditor';
export { useInlineEditor } from '@/hooks/useInlineEditor';

/**
 * 🎯 EDITOR UNIFICADO COMPLETO
 *
 * Todos os 6 componentes necessários para o sistema unificado:
 *
 * 1. ✅ UnifiedPreviewEngine - Engine de preview com fidelidade 100% (usa ProductionPreviewEngine)
 * 2. ✅ ProductionPreviewEngine - Engine de renderização real dos componentes
 * 3. ✅ EditorBlockRenderer - Renderizador específico para blocos do editor
 * 4. ✅ ValidationIndicator - Sistema de validação visual
 * 5. ✅ MockDataProvider - Dados mockados para preview realístico
 * 6. ✅ EditableStep20Result - Editor completo do Step 20 com customização
 * 7. ✅ StyleSelector - Seletor de estilos para preview de diferentes resultados
 * 8. ✅ ResultPreviewSwitcher - Alternador entre modos de preview (único/múltiplos/comparação)
 * 9. ✅ useQuizResultEditor - Hook completo para edição de resultados
 * 10. ✅ EditorControlsManager - Sistema de controles unificado
 * 11. ✅ EditorStageManager - Gerenciador de etapas do quiz
 * 12. ✅ EditorPropertiesPanel - Painel de propriedades unificado
 * 13. ✅ SortablePreviewBlockWrapper - Componente para arrastar e soltar
 *
 * Status: 🎉 FASE 4 IMPLEMENTADA - Sistema de Edição Interativa Completo
 * 
 * Novas funcionalidades Phase 4:
 * 14. ✅ useInlineEditor - Hook para gerenciar edição inline
 * 15. ✅ InlineEditableBlock - Wrapper para edição inline de blocos
 * 16. ✅ BlockPropertyPanel - Painel de propriedades em tempo real
 * 17. ✅ DragDropBlockManager - Sistema de arrastar e soltar
 * 18. ✅ InteractivePreviewEngine - Engine principal de edição interativa
 */
