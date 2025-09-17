import React from 'react';

/**
 * 🎯 UNIFIED BLOCK INTERFACES - CONSOLIDAÇÃO FASE 1
 * 
 * Consolida as definições conflitantes de:
 * - src/types/blocks.ts → BlockComponentProps
 * - src/types/blockComponentProps.ts → BlockComponentProps
 * 
 * ✅ BENEFÍCIOS:
 * - Resolve conflitos TypeScript entre arquivos
 * - Define interface única e consistente
 * - Mantém compatibilidade backward
 * - Reduz duplicação de código
 */

// =============================================
// CORE BLOCK DATA STRUCTURES
// =============================================

export interface BlockData {
    id: string;
    type: string;
    properties: Record<string, any>;
    content: Record<string, any>;
    order: number;
}

export interface BlockDefinition {
    type: string;
    name: string;
    description: string;
    category: string;
    icon: any;
    defaultProps: Record<string, any>;
    properties: Record<string, any>;
    subBlocks?: string[]; // Lista de tipos de blocos que podem ser usados como subcomponentes
}

// =============================================
// UNIFIED BLOCK COMPONENT PROPS
// =============================================

/**
 * 🎯 INTERFACE UNIFICADA - BlockComponentProps
 * 
 * Consolida todas as props necessárias para componentes de bloco:
 * - Props essenciais (block, properties, handlers)
 * - Props de quiz (navigation, session)
 * - Props de layout (positioning, spacing, styling)
 * - Props de editor (selection, validation)
 * - Flexibilidade para props adicionais
 */
export interface UnifiedBlockComponentProps {
    // ===== CORE PROPS =====
    id?: string;
    block?: BlockData | any; // Permite both structured e any para compatibilidade
    type?: string;
    properties?: Record<string, any>;
    className?: string;

    // ===== INTERACTION PROPS =====  
    isSelected?: boolean;
    isEditing?: boolean;
    onClick?: () => void;
    onPropertyChange?: (key: string, value: any) => void;
    onValidate?: (isValid: boolean) => void;

    // ===== QUIZ NAVIGATION PROPS =====
    isPreviewMode?: boolean;
    onNext?: () => void;
    onPrevious?: () => void;
    canProceed?: boolean;
    sessionId?: string;

    // ===== LAYOUT & POSITIONING PROPS =====
    containerWidth?: 'full' | 'large' | 'medium' | 'small';
    containerPosition?: 'center' | 'left' | 'right';
    spacing?: string;

    // ===== MARGIN & PADDING PROPS =====
    marginTop?: number;
    marginBottom?: number;
    paddingTop?: number;
    paddingBottom?: number;

    // ===== STYLING PROPS =====
    backgroundColor?: string;
    borderRadius?: number;
    shadow?: string;
    scale?: number;

    // ===== FLEXIBILITY =====
    // Allow any additional props for maximum compatibility
    [key: string]: any;
}

// =============================================
// COMPATIBILITY ALIASES
// =============================================

/**
 * 🔄 BACKWARD COMPATIBILITY
 * Aliases para manter compatibilidade com código existente
 */
export type BlockComponentProps = UnifiedBlockComponentProps;

// Legacy support
export interface LegacyBlockComponentProps extends UnifiedBlockComponentProps { }

// =============================================
// COMPONENT TYPE DEFINITIONS
// =============================================

// Type definition for components that accept these props
export type BlockComponent = React.ComponentType<UnifiedBlockComponentProps>;

// Type assertion helper for lazy components
export const asBlockComponent = (component: any): BlockComponent => component as BlockComponent;

// Factory function for creating block components with proper typing
export function createBlockComponent<T extends UnifiedBlockComponentProps = UnifiedBlockComponentProps>(
    component: React.ComponentType<T>
): BlockComponent {
    return component as BlockComponent;
}

// =============================================
// UTILITY TYPES
// =============================================

// For components that require specific block types
export interface TypedBlockComponentProps<TBlock = BlockData> extends UnifiedBlockComponentProps {
    block: TBlock;
}

// For components that are always in editing mode
export interface EditableBlockComponentProps extends UnifiedBlockComponentProps {
    isEditing: true;
    onPropertyChange: (key: string, value: any) => void;
}

// For quiz-specific components
export interface QuizBlockComponentProps extends UnifiedBlockComponentProps {
    isPreviewMode: boolean;
    sessionId: string;
    onNext: () => void;
    canProceed: boolean;
}

// =============================================
// VALIDATION HELPERS
// =============================================

/**
 * Type guard to check if props have required quiz properties
 */
export function isQuizBlockProps(props: UnifiedBlockComponentProps): props is QuizBlockComponentProps {
    return !!(
        props.isPreviewMode !== undefined &&
        props.sessionId &&
        props.onNext &&
        props.canProceed !== undefined
    );
}

/**
 * Type guard to check if props are in editing mode
 */
export function isEditableBlockProps(props: UnifiedBlockComponentProps): props is EditableBlockComponentProps {
    return props.isEditing === true && typeof props.onPropertyChange === 'function';
}