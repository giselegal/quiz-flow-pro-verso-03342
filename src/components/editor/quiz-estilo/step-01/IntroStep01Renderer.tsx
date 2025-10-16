/**
 * 🎨 STEP-01 RENDERER - SISTEMA DE RENDERIZAÇÃO
 * 
 * Renderiza o Step-01 (Introdução) do quiz-estilo usando os componentes modulares
 * Suporta 3 modos: preview | production | editable
 * 
 * @module components/editor/quiz-estilo/step-01/IntroStep01Renderer
 * @version 1.0.0
 */

import React from 'react';
import { IntroStep01_Main } from './IntroStep01_Main';
import type { IntroStep01MainData } from '@/schemas/step01Schema';
import { normalizeIntroStep01Data } from '@/schemas/step01Schema';

// ============================================================================
// TYPES
// ============================================================================

export type RenderMode = 'preview' | 'production' | 'editable';

export interface IntroStep01RendererProps {
    /** Dados do step (pode ser parcial) */
    data?: Partial<IntroStep01MainData>;

    /** Modo de renderização */
    mode?: RenderMode;

    /** Callback quando nome é submetido */
    onNameSubmit?: (name: string) => void;

    /** Callback quando campo é editado (modo editable) */
    onEdit?: (field: string, value: any) => void;

    /** Callback quando step avança */
    onNext?: () => void;

    /** Callback quando volta */
    onBack?: () => void;

    /** Estado do quiz (para modo production) */
    quizState?: {
        userName?: string;
        currentStep?: number;
        totalSteps?: number;
    };

    /** CSS classes adicionais */
    className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Renderiza o Step-01 (Introdução) com validação e normalização
 */
export const IntroStep01Renderer: React.FC<IntroStep01RendererProps> = ({
    data = {},
    mode = 'production',
    onNameSubmit,
    onEdit,
    onNext,
    onBack,
    quizState,
    className = '',
}) => {
    console.log('🎨 IntroStep01Renderer: Rendering with mode:', mode);

    // Normaliza dados com valores padrão
    const normalizedData = normalizeIntroStep01Data(data);

    // Atualiza progressValue se quizState disponível
    if (quizState?.currentStep && quizState?.totalSteps) {
        normalizedData.progressValue = Math.round((quizState.currentStep / quizState.totalSteps) * 100);
    }

    // Handler para submit de nome
    const handleNameSubmit = (name: string) => {
        console.log('📝 IntroStep01Renderer: Name submitted:', name);

        if (onNameSubmit) {
            onNameSubmit(name);
        }

        if (onNext) {
            onNext();
        }
    };

    // Handler para edição (modo editable)
    const handleEdit = (field: string, value: any) => {
        console.log('✏️ IntroStep01Renderer: Field edited:', field, value);

        if (onEdit) {
            onEdit(field, value);
        }
    };

    // Define se é editável
    const isEditable = mode === 'editable';

    return (
        <div
            className={`intro-step-01-renderer ${className}`}
            data-mode={mode}
            data-step="step-01"
        >
            <IntroStep01_Main
                data={normalizedData}
                onNameSubmit={handleNameSubmit}
                isEditable={isEditable}
                onEdit={isEditable ? handleEdit : undefined}
            />
        </div>
    );
};

// ============================================================================
// ADAPTER PARA UNIFIED STEP RENDERER
// ============================================================================

/**
 * Adapter que conecta IntroStep01Renderer ao UnifiedStepRenderer
 * Converte props do sistema unificado para props do Step-01
 */
export const IntroStep01RendererAdapter: React.FC<any> = (props) => {
    console.log('🔌 IntroStep01RendererAdapter: Props received:', props);

    const {
        mode = 'production',
        stepProps = {},
        quizState = {},
        onStepUpdate,
        onNext,
        onBack,
    } = props;

    // Extrair dados do step
    const stepData = stepProps.data || stepProps;

    // Handler para submit de nome
    const handleNameSubmit = (name: string) => {
        console.log('📝 Adapter: Name submitted:', name);

        // Atualizar quiz state com nome
        if (onStepUpdate) {
            onStepUpdate('step-01', { userName: name });
        }

        // Avançar para próximo step
        if (onNext) {
            onNext();
        }
    };

    // Handler para edição
    const handleEdit = (field: string, value: any) => {
        if (onStepUpdate) {
            onStepUpdate('step-01', { [field]: value });
        }
    };

    return (
        <IntroStep01Renderer
            data={stepData}
            mode={mode}
            onNameSubmit={handleNameSubmit}
            onEdit={mode === 'editable' ? handleEdit : undefined}
            onNext={onNext}
            onBack={onBack}
            quizState={quizState}
        />
    );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default IntroStep01Renderer;

// Export adapter como named export
export { IntroStep01RendererAdapter as Adapter };
