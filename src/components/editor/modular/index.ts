/**
 * 🎯 ÍNDICE DO SISTEMA MODULAR - VERSÃO LIMPA
 * 
 * Exportações seguras apenas dos componentes que realmente existem
 */

// 🏗️ Tipos que realmente existem
export type {
    ComponentType,
    ModularComponent,
    ModularQuizFunnel
} from '@/types/modular-editor';

// 🎨 Componentes principais que existem
export { default as ModernModularEditor } from './ModernModularEditor';
export { default as ModularSystemProof } from './ModularSystemProof';
export { default as ModularSystemDemo } from './ModularSystemDemo';
export { default as ModularQuizEditor } from './ModularQuizEditor';
export { default as ModularEditorExample } from './ModularEditorExample';

// 🎛️ Configuração segura para _config
export const DEFAULT_EDITOR_CONFIG = {
    theme: 'modern',
    layout: 'horizontal',
    showPreview: true,
    autoSave: true,
    debug: false
};

// 🔧 Utilitário de configuração segura
export const getEditorConfig = (config?: any) => {
    return config || DEFAULT_EDITOR_CONFIG;
};