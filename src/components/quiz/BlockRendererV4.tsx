/**
 * 🎯 BLOCK RENDERER V4
 * 
 * Renderiza blocks da estrutura v4 com validação Zod
 * Mapeia block types para componentes React
 * 
 * FASE 4: Integração E2E
 */

import React from 'react';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// COMPONENT REGISTRY
// ============================================================================

// Lazy load components for better performance
const QuestionProgress = React.lazy(() =>
    import('@/components/blocks/quiz/QuizNavigationBlock')
);

const QuestionNavigation = React.lazy(() =>
    import('@/components/blocks/quiz/QuizNavigationBlock')
);

const QuestionTitle = React.lazy(() =>
    import('@/components/blocks/RichTextBlock')
);

const TextInline = React.lazy(() =>
    import('@/components/blocks/RichTextBlock')
);

const QuizIntroHeader = React.lazy(() =>
    import('@/components/blocks/quiz/QuizIntroBlock')
);

const FormInput = React.lazy(() =>
    import('@/components/blocks/LeadFormBlock')
);

const OptionsGrid = React.lazy(() =>
    import('@/components/blocks/quiz/QuizOptionsGridBlock')
);

const ResultDisplay = React.lazy(() =>
    import('@/components/blocks/quiz/QuizResultsBlock')
);

const OfferCard = React.lazy(() =>
    import('@/components/blocks/ButtonBlock')
);

// Legacy support
const IntroLogo = React.lazy(() =>
    import('@/components/blocks/RichTextBlock')
);

const IntroTitle = React.lazy(() =>
    import('@/components/blocks/RichTextBlock')
);

const IntroSubtitle = React.lazy(() =>
    import('@/components/blocks/RichTextBlock')
);

const IntroDescription = React.lazy(() =>
    import('@/components/blocks/RichTextBlock')
);

const IntroForm = React.lazy(() =>
    import('@/components/blocks/LeadFormBlock')
);

const IntroButton = React.lazy(() =>
    import('@/components/blocks/ButtonBlock')
);

// Component map
const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
    'question-progress': QuestionProgress,
    'question-navigation': QuestionNavigation,
    'question-title': QuestionTitle,
    'text-inline': TextInline,
    'quiz-intro-header': QuizIntroHeader,
    'form-input': FormInput,
    'options-grid': OptionsGrid,
    'result-display': ResultDisplay,
    'offer-card': OfferCard,

    // Legacy support
    'intro-logo': IntroLogo,
    'intro-title': IntroTitle,
    'intro-subtitle': IntroSubtitle,
    'intro-description': IntroDescription,
    'intro-form': IntroForm,
    'intro-button': IntroButton,
};

// ============================================================================
// FALLBACK COMPONENT
// ============================================================================

function BlockFallback({ block }: { block: QuizBlock }) {
    return (
        <div
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
            data-block-id={block.id}
            data-block-type={block.type}
        >
            <p className="text-sm text-gray-600">
                Block type <code className="px-1 py-0.5 bg-gray-200 rounded">{block.type}</code> não implementado
            </p>
            <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer">Ver propriedades</summary>
                <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                    {JSON.stringify(block.properties, null, 2)}
                </pre>
            </details>
        </div>
    );
}

// ============================================================================
// BLOCK RENDERER
// ============================================================================

export interface BlockRendererV4Props {
    block: QuizBlock;
    stepId?: string;
    isEditable?: boolean;
    onUpdate?: (blockId: string, updates: Partial<QuizBlock>) => void;
    onDelete?: (blockId: string) => void;
    className?: string;
}

export function BlockRendererV4({
    block,
    stepId,
    isEditable = false,
    onUpdate,
    onDelete,
    className = '',
}: BlockRendererV4Props) {
    // Get component for block type
    const BlockComponent = BLOCK_COMPONENTS[block.type];

    // Log if component not found
    React.useEffect(() => {
        if (!BlockComponent) {
            appLogger.warn('⚠️ Componente não encontrado para block type:', {
                data: [block.type, block.id]
            });
        }
    }, [BlockComponent, block.type, block.id]);

    // Render fallback if component not found
    if (!BlockComponent) {
        return <BlockFallback block={block} />;
    }

    // Prepare props
    const componentProps = {
        ...block.properties,
        ...block.content,
        blockId: block.id,
        stepId,
        isEditable,
        onUpdate: onUpdate ? (updates: any) => onUpdate(block.id, { properties: updates }) : undefined,
        onDelete: onDelete ? () => onDelete(block.id) : undefined,
    };

    return (
        <div
            className={className}
            data-block-id={block.id}
            data-block-type={block.type}
            data-block-order={block.order}
        >
            <React.Suspense fallback={<div className="animate-pulse h-20 bg-gray-100 rounded" />}>
                <BlockComponent {...componentProps} />
            </React.Suspense>
        </div>
    );
}

// ============================================================================
// STEP RENDERER
// ============================================================================

export interface StepRendererV4Props {
    stepId: string;
    blocks: QuizBlock[];
    isEditable?: boolean;
    onBlockUpdate?: (blockId: string, updates: Partial<QuizBlock>) => void;
    onBlockDelete?: (blockId: string) => void;
    onBlockReorder?: (blockId: string, newOrder: number) => void;
    className?: string;
}

export function StepRendererV4({
    stepId,
    blocks,
    isEditable = false,
    onBlockUpdate,
    onBlockDelete,
    onBlockReorder,
    className = '',
}: StepRendererV4Props) {
    // Sort blocks by order
    const sortedBlocks = React.useMemo(() => {
        return [...blocks].sort((a, b) => a.order - b.order);
    }, [blocks]);

    return (
        <div className={`step-renderer-v4 ${className}`} data-step-id={stepId}>
            {sortedBlocks.map((block, index) => (
                <BlockRendererV4
                    key={block.id}
                    block={block}
                    stepId={stepId}
                    isEditable={isEditable}
                    onUpdate={onBlockUpdate}
                    onDelete={onBlockDelete}
                    className="mb-4"
                />
            ))}
        </div>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { BLOCK_COMPONENTS };
