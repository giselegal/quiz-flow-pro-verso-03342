/**
 * 🎯 EDITABLE STEP PROPS
 * 
 * Interface comum para todos os componentes editáveis.
 * Define a estrutura padrão que cada componente editável deve seguir.
 */

import { QuizStep } from '@/data/quizSteps';

/**
 * 📋 PROPS BASE PARA COMPONENTES EDITÁVEIS
 */
export interface EditableStepProps {
    /** Dados do step (compatível com QuizStep) */
    data: QuizStep;

    /** Se o componente está em modo editável */
    isEditable: boolean;

    /** Se o componente está selecionado */
    isSelected: boolean;

    /** Callback quando propriedades são atualizadas */
    onUpdate: (updates: Partial<QuizStep>) => void;

    /** Callback quando componente é selecionado */
    onSelect: () => void;

    /** Callback para duplicar componente */
    onDuplicate?: () => void;

    /** Callback para deletar componente */
    onDelete?: () => void;

    /** Callback para mover componente para cima */
    onMoveUp?: () => void;

    /** Callback para mover componente para baixo */
    onMoveDown?: () => void;

    /** Se pode mover para cima */
    canMoveUp?: boolean;

    /** Se pode mover para baixo */
    canMoveDown?: boolean;

    /** Se pode ser deletado */
    canDelete?: boolean;

    /** ID único do componente para seleção */
    blockId?: string;

    /** Callback quando uma propriedade é clicada (integração com painel) */
    onPropertyClick?: (propKey: string, element: HTMLElement) => void;
}

/**
 * 🎨 VARIANTES DE PREVIEW
 */
export type PreviewMode = 'edit' | 'preview' | 'production';

/**
 * 📝 CONFIGURAÇÃO DE PROPRIEDADE EDITÁVEL
 */
export interface EditablePropInfo {
    key: string;
    label: string;
    type: 'text' | 'html' | 'number' | 'image' | 'color' | 'select' | 'boolean' | 'array';
    description?: string;
    required?: boolean;
    defaultValue?: any;
}

/**
 * 🔧 FACTORY PARA CRIAR PROPS PADRÃO
 */
export function createEditableStepProps(
    data: QuizStep,
    overrides?: Partial<EditableStepProps>
): EditableStepProps {
    return {
        data,
        isEditable: true,
        isSelected: false,
        onUpdate: () => { },
        onSelect: () => { },
        canMoveUp: true,
        canMoveDown: true,
        canDelete: true,
        ...overrides
    };
}