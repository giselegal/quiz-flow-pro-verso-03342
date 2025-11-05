/**
 * 🧩 EditorProviderCanonical
 * Provider único recomendado. Encaminha para EditorProviderUnified e reexporta seus tipos/hooks.
 * @deprecated Substitui gradualmente EditorProviderAdapter e EditorProviderMigrationAdapter
 */

export {
    EditorProviderUnified as EditorProviderCanonical,
    EditorProviderUnified as EditorProvider,
    EditorProviderUnified,
    useEditor,
    useEditorOptional,
    EditorContext,
} from './EditorProviderUnified';

export type { EditorContextValue, EditorState } from './EditorProviderUnified';
