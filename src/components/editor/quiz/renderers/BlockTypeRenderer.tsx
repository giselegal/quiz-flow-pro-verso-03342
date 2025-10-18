import React from 'react';
import type { Block } from '@/types/editor';
import QuizIntroHeaderBlock from './blocks/QuizIntroHeaderBlock';
import TextInlineBlock from './blocks/TextInlineBlock';
import ImageDisplayBlock from './blocks/ImageDisplayBlock';
import QuizOptionsBlock from './blocks/QuizOptionsBlock';
import ButtonInlineBlock from './blocks/ButtonInlineBlock';
import FormInputBlock from './blocks/FormInputBlock';
import QuizQuestionHeaderBlock from './blocks/QuizQuestionHeaderBlock';
import QuizNavigationBlock from './blocks/QuizNavigationBlock';
// Blocos de oferta (editor) — importados do registro aprimorado
import CTAInlineBlock from '@/components/editor/blocks/CTAInlineBlock';
import ValueAnchoringBlock from '@/components/editor/blocks/ValueAnchoringBlock';
import SecurePurchaseBlock from '@/components/editor/blocks/SecurePurchaseBlock';
import UrgencyTimerInlineBlock from '@/components/editor/blocks/UrgencyTimerInlineBlock';
import GuaranteeBlock from '@/components/editor/blocks/GuaranteeBlock';
import BenefitsListBlock from '@/components/editor/blocks/BenefitsListBlock';
import TestimonialsBlock from '@/components/editor/blocks/TestimonialsBlock';
import PricingInlineBlock from '@/components/editor/blocks/PricingInlineBlock';
import QuizOfferHeroBlock from '@/components/editor/blocks/QuizOfferHeroBlock';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
// Blocos atômicos específicos usados no Step 01
import IntroLogoBlock from '@/components/editor/blocks/atomic/IntroLogoBlock';

export interface BlockRendererProps {
    block: Block;
    isSelected?: boolean;
    isEditable?: boolean;
    onSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    contextData?: Record<string, any>;
}

const GenericBlock: React.FC<BlockRendererProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties }) => {
    const id = block?.id || 'unknown';
    const type = block?.type || 'unknown';
    return (
        <div
            className={`p-3 border rounded bg-white ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
            onClick={() => onSelect?.(id)}
            role="group"
            aria-label={`Bloco ${type}`}
        >
            <div className="text-xs text-gray-500 mb-1">{type}</div>
            <pre className="text-[10px] text-gray-400 overflow-auto max-h-40">{JSON.stringify(block.properties || {}, null, 2)}</pre>
            {isEditable && (
                <button
                    type="button"
                    className="mt-2 text-xs text-blue-600 underline"
                    onClick={(e) => { e.stopPropagation(); onOpenProperties?.(id); }}
                >
                    Abrir propriedades
                </button>
            )}
        </div>
    );
};

export const BlockTypeRenderer: React.FC<BlockRendererProps> = ({ block, ...rest }) => {
    switch (String(block.type)) {
        // ===== INTRO (Step 01) =====
        case 'intro-logo':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="Intro • Logo"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    <IntroLogoBlock block={block as any} isSelected={rest.isSelected} onClick={() => rest.onSelect?.(block.id)} />
                </SelectableBlock>
            );
        case 'intro-form':
            // Alias direto para o bloco de input de formulário
            return <FormInputBlock block={block} {...rest} />;
        // ===== HEADER/TÍTULO GENÉRICO =====
        case 'heading-inline':
            return <TextInlineBlock block={block} {...rest} />;
        case 'quiz-question-header':
        case 'question-header':
            return <QuizQuestionHeaderBlock block={block} {...rest} />;
        case 'quiz-intro-header':
            return <QuizIntroHeaderBlock block={block} {...rest} />;
        case 'text-inline':
            return <TextInlineBlock block={block} {...rest} />;
        case 'image-display-inline':
        case 'image-inline':
        case 'image':
            return <ImageDisplayBlock block={block} {...rest} />;
        case 'form-input':
        case 'input-field':
            return <FormInputBlock block={block} {...rest} />;
        case 'button-inline':
        case 'button':
            return <ButtonInlineBlock block={block} {...rest} />;
        case 'quiz-options':
        case 'options-grid':
            return <QuizOptionsBlock block={block} {...rest} />;
        case 'quiz-navigation':
        case 'navigation':
            return <QuizNavigationBlock block={block} {...rest} />;
        // ===== MAPEAMENTOS ESPECÍFICOS DE OFERTA =====
        case 'quiz-offer-hero':
        case 'offer-hero':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="Hero da Oferta"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    <QuizOfferHeroBlock properties={(block as any).properties || {}} isSelected={rest.isSelected} onClick={() => rest.onSelect?.(block.id)} />
                </SelectableBlock>
            );
        case 'quiz-offer-cta-inline':
        case 'cta-inline':
        case 'offer.core':
        case 'conversion':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="CTA da Oferta"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    <CTAInlineBlock block={block as any} isSelected={rest.isSelected} />
                </SelectableBlock>
            );
        case 'value-anchoring':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="Ancoragem de Valor"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    {React.createElement(ValueAnchoringBlock as any, { block } as any)}
                </SelectableBlock>
            );
        case 'secure-purchase':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="Compra Segura"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    <SecurePurchaseBlock block={block as any} />
                </SelectableBlock>
            );
        case 'urgency-timer-inline':
        case 'offer.urgency':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="Urgência"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    <UrgencyTimerInlineBlock block={block as any} isSelected={rest.isSelected} />
                </SelectableBlock>
            );
        case 'guarantee':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="Garantia"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    <GuaranteeBlock block={block as any} />
                </SelectableBlock>
            );
        case 'benefits':
        case 'benefits-list':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="Benefícios"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    <BenefitsListBlock block={block as any} />
                </SelectableBlock>
            );
        case 'testimonials':
        case 'testimonials-grid':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="Depoimentos"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    <TestimonialsBlock block={block as any} />
                </SelectableBlock>
            );
        case 'pricing-inline':
        case 'pricing':
            return (
                <SelectableBlock
                    blockId={block.id}
                    isSelected={!!rest.isSelected}
                    isEditable={!!rest.isEditable}
                    onSelect={() => rest.onSelect?.(block.id)}
                    blockType="Preço"
                    onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                    isDraggable={true}
                >
                    <PricingInlineBlock block={block as any} isSelected={rest.isSelected} />
                </SelectableBlock>
            );
        default:
            return <GenericBlock block={block} {...rest} />;
    }
};

export default React.memo(BlockTypeRenderer);
