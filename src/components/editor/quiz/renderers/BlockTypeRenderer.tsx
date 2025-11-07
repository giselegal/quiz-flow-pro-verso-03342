import React from 'react';
import SafeBoundary from '@/components/common/SafeBoundary';
import type { Block } from '@/types/editor';
import QuizIntroHeaderBlock from './blocks/QuizIntroHeaderBlock';
// Versões atômicas
import TextInlineAtomic from '@/components/editor/blocks/atomic/TextInlineBlock';
import ImageInlineAtomic from '@/components/editor/blocks/atomic/ImageInlineBlock';
// Preferir bloco atômico para grid de opções
import OptionsGridAtomic from '@/components/editor/blocks/atomic/OptionsGridBlock';
import CTAButtonAtomic from '@/components/editor/blocks/atomic/CTAButtonBlock';
import TransitionHeroBlock from '@/components/editor/blocks/atomic/TransitionHeroBlock';
// Formulário de boas-vindas (atômico)
import IntroFormBlock from '@/components/editor/blocks/atomic/IntroFormBlock';
import QuizQuestionHeaderBlock from './blocks/QuizQuestionHeaderBlock';
// Navegação de perguntas (atômico)
import QuestionNavigationBlock from '@/components/editor/blocks/atomic/QuestionNavigationBlock';
// 🆕 Score/Pontuação (Sistema de Scoring v2.0)
import QuizScoreDisplay from '@/components/quiz/blocks/QuizScoreDisplay';
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
import OfferHeroBlock from '@/components/editor/blocks/OfferHeroBlock';
import OfferBenefitsBlock from '@/components/editor/blocks/OfferBenefitsBlock';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
// Blocos atômicos específicos usados no Step 01
import IntroLogoBlock from '@/components/editor/blocks/atomic/IntroLogoBlock';
import IntroLogoHeaderBlock from '@/components/editor/blocks/atomic/IntroLogoHeaderBlock';
// (já importado acima)
import IntroTitleBlock from '@/components/editor/blocks/atomic/IntroTitleBlock';
import IntroImageBlock from '@/components/editor/blocks/atomic/IntroImageBlock';
import IntroDescriptionBlock from '@/components/editor/blocks/atomic/IntroDescriptionBlock';
import FooterCopyrightBlock from '@/components/editor/blocks/atomic/FooterCopyrightBlock';
// Transição (atômicos)
import TransitionTitleBlock from '@/components/editor/blocks/atomic/TransitionTitleBlock';
import TransitionTextBlock from '@/components/editor/blocks/atomic/TransitionTextBlock';
import QuestionProgressBlock from '@/components/editor/blocks/atomic/QuestionProgressBlock';
import QuestionNumberBlock from '@/components/editor/blocks/atomic/QuestionNumberBlock';
import QuestionTextBlock from '@/components/editor/blocks/atomic/QuestionTextBlock';
import QuestionTitleBlock from '@/components/editor/blocks/atomic/QuestionTitleBlock';
import QuestionHeroBlock from '@/components/editor/blocks/atomic/QuestionHeroBlock';
import QuestionInstructionsBlock from '@/components/editor/blocks/atomic/QuestionInstructionsBlock';
// Result blocks (atômicos)
import ResultMainBlock from '@/components/editor/blocks/atomic/ResultMainBlock';
import ResultImageBlock from '@/components/editor/blocks/atomic/ResultImageBlock';
import ResultDescriptionBlock from '@/components/editor/blocks/atomic/ResultDescriptionBlock';
import ResultSecondaryStylesBlock from '@/components/editor/blocks/atomic/ResultSecondaryStylesBlock';
import ResultShareBlock from '@/components/editor/blocks/atomic/ResultShareBlock';
import ResultCTABlock from '@/components/editor/blocks/atomic/ResultCTABlock';
// (já importado acima)

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
    const content = (() => {
        // ✅ FASE 4: Aliases expandidos para tipos legacy
        const normalizedType = String(block.type).toLowerCase().trim();

        switch (normalizedType) {
            // ===== ALIASES DE TIPOS CRÍTICOS =====
            case 'hero-block':
            case 'hero':
                return <IntroLogoHeaderBlock block={block} {...rest} />;

            case 'welcome-form-block':
                return <IntroFormBlock block={block} {...rest} onNameSubmit={(rest as any)?.contextData?.onNameSubmit} />;

            case 'heading':
            case 'title':
                return <TextInlineAtomic block={block} {...rest} />;

            case 'question-block':
                return <OptionsGridAtomic block={block} {...rest} contextData={rest.contextData} />;

            case 'option-grid':
            case 'options grid':
                return <OptionsGridAtomic block={block} {...rest} contextData={rest.contextData} />;

            // 🆕 SCORE/PONTUAÇÃO (Sistema de Scoring v2.0)
            case 'quiz-score-display':
            case 'quiz-score-header':
            case 'score-display':
                return (
                    <SelectableBlock
                        blockId={block.id}
                        isSelected={!!rest.isSelected}
                        isEditable={!!rest.isEditable}
                        onSelect={() => rest.onSelect?.(block.id)}
                        blockType="Pontuação do Quiz"
                        onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                        isDraggable={true}
                    >
                        <QuizScoreDisplay block={block} isSelected={rest.isSelected} onClick={() => rest.onSelect?.(block.id)} />
                    </SelectableBlock>
                );

            case 'transition.next':
                return <TransitionHeroBlock block={block} {...rest} contextData={rest.contextData} />;

            case 'result.headline':
                return <ResultMainBlock block={block} {...rest} />;

            case 'result.secondarylist':
                return <ResultSecondaryStylesBlock block={block} {...rest} />;

            case 'offer.core':
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

            case 'offer.testimonial':
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

            // ===== INTRO (Step 01) =====
            case 'intro-hero':
            case 'intro-logo-header':
                // Preferir bloco atômico para cabeçalho (logo + linha decorativa)
                return <IntroLogoHeaderBlock block={block} {...rest} />;
            case 'quiz-intro-header':
                // ✅ FASE 4: Alias para intro-logo-header
                return <IntroLogoHeaderBlock block={block} {...rest} />;
            case 'welcome-form':
                // Mapear seção v3 para bloco atômico do form
                return <IntroFormBlock block={block} {...rest} />;
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
                // Novo bloco atômico de formulário com visual completo
                // Encaminhar explicitamente onNameSubmit do contextData, quando disponível
                return (
                    <IntroFormBlock
                        block={block}
                        {...rest}
                        onNameSubmit={(rest as any)?.contextData?.onNameSubmit}
                    />
                );
            case 'intro-title':
                // Novo bloco atômico de título (com suporte a content.titleHtml/title)
                return <IntroTitleBlock block={block as any} isSelected={rest.isSelected} onClick={() => rest.onSelect?.(block.id)} />;
            case 'intro-image':
                // Novo bloco atômico de imagem (suporta content.imageUrl)
                return <IntroImageBlock block={block as any} isSelected={rest.isSelected} onClick={() => rest.onSelect?.(block.id)} />;
            case 'intro-description':
                // Novo bloco atômico de descrição (suporta HTML em content.text)
                return <IntroDescriptionBlock block={block as any} isSelected={rest.isSelected} onClick={() => rest.onSelect?.(block.id)} />;
            case 'image-display-inline':
                // Usar versão atômica de imagem
                return <ImageInlineAtomic block={block} {...rest} />;
            case 'footer-copyright':
                // Novo bloco de footer com copyright
                return <FooterCopyrightBlock block={block} {...rest} />;
            // ===== QUESTIONS (Steps 02-11) - NOVOS BLOCOS MODULARES =====
            case 'question-progress':
                return <QuestionProgressBlock block={block} {...rest} />;
            case 'question-number':
                return <QuestionNumberBlock block={block} {...rest} />;
            case 'question-text':
                return <QuestionTextBlock block={block} {...rest} />;
            case 'question-instructions':
                return <QuestionInstructionsBlock block={block} {...rest} contextData={rest.contextData} />;
            case 'question-navigation':
                return <QuestionNavigationBlock block={block} {...rest} contextData={rest.contextData} />;
            // ===== QUESTIONS (Steps 02-18) =====
            case 'question-title':
                // ✅ CORRIGIDO: Usar QuestionTextBlock dedicado para título + subtítulo
                return <QuestionTextBlock block={block} {...rest} />;
            case 'question-hero':
                // Template v3: question-hero section → header completo
                return <QuizQuestionHeaderBlock block={block} {...rest} />;
            case 'CTAButton':
                // Versão atômica do CTA (passa contextData para navegação)
                return <CTAButtonAtomic block={block} {...rest} contextData={rest.contextData} />;
            // ===== HEADER/TÍTULO GENÉRICO =====
            case 'heading-inline':
                return <TextInlineAtomic block={block} {...rest} />;
            case 'quiz-question-header':
            case 'question-header':
                // Não há equivalente atômico dedicado para o header composto; fallback ao inline text atômico
                return <TextInlineAtomic block={block} {...rest} />;
            case 'text-inline':
                return <TextInlineAtomic block={block} {...rest} />;
            case 'image-inline':
            case 'image':
                return <ImageInlineAtomic block={block} {...rest} />;
            case 'form-input':
            case 'input-field':
                // Fallback: não há atômico genérico de input, manter IntroFormBlock quando aplicável
                return <IntroFormBlock block={block} {...rest} />;
            case 'button-inline':
            case 'button':
                return <CTAButtonAtomic block={block} {...rest} />;
            case 'quiz-options':
            case 'options-grid':
                // Bloco atômico de grid de opções (usa contextData para seleção)
                return <OptionsGridAtomic block={block} {...rest} contextData={rest.contextData} />;
            case 'quiz-navigation':
            case 'navigation':
                return <QuestionNavigationBlock block={block} {...rest} contextData={rest.contextData} />;
            // ===== TRANSITION (Steps 12, 19) =====
            case 'transition-hero':
                // Hero de transição com auto-advance
                return <TransitionHeroBlock block={block} {...rest} contextData={rest.contextData} />;
            case 'transition-title':
                return <TransitionTitleBlock block={block as any} {...rest} />;
            case 'transition-text':
                return <TransitionTextBlock block={block as any} {...rest} />;
            // ===== RESULT (Step 20) =====
            case 'result-main':
                // Título principal do resultado
                return <ResultMainBlock block={block} {...rest} />;
            case 'result-congrats':
                // Mensagem de congratulações → usar ResultMainBlock para manter consistência
                return <ResultMainBlock block={block} {...rest} />;
            case 'result-image':
                // Imagem do estilo predominante
                return <ResultImageBlock block={block} {...rest} />;
            case 'result-description':
                // Descrição do estilo
                return <ResultDescriptionBlock block={block} {...rest} />;
            case 'result-progress-bars':
                // Barras de progresso dos estilos (usar ResultSecondaryStylesBlock que já tem barras)
                return <ResultSecondaryStylesBlock block={block} {...rest} />;
            case 'result-secondary-styles':
                // Estilos secundários
                return <ResultSecondaryStylesBlock block={block} {...rest} />;
            case 'result-share':
                // Botões de compartilhamento social
                return <ResultShareBlock block={block} {...rest} />;
            case 'result-cta':
                // CTA do resultado
                return <ResultCTABlock block={block} {...rest} />;
            case 'HeroSection':
                // Step 20: Hero do resultado → usar GenericBlock temporariamente
                return <GenericBlock block={block} {...rest} />;
            case 'StyleProfileSection':
                // Step 20: Perfil de estilo → usar GenericBlock temporariamente
                return <GenericBlock block={block} {...rest} />;
            case 'TransformationSection':
                // Step 20: Transformação → GenericBlock até criar componente dedicado
                return <GenericBlock block={block} {...rest} />;
            case 'MethodStepsSection':
                // Step 20: Passos do método → usar GenericBlock temporariamente
                return <GenericBlock block={block} {...rest} />;
            case 'BonusSection':
                // Step 20: Bônus → GenericBlock até criar componente dedicado
                return <GenericBlock block={block} {...rest} />;
            case 'SocialProofSection':
                // Step 20: Prova social → GenericBlock até criar componente dedicado
                return <GenericBlock block={block} {...rest} />;
            case 'OfferSection':
                // Step 20: Oferta → GenericBlock até criar componente dedicado
                return <GenericBlock block={block} {...rest} />;
            case 'GuaranteeSection':
                // Step 20: Garantia → GenericBlock até criar componente dedicado
                return <GenericBlock block={block} {...rest} />;
            // ===== OFFER (Steps 20, 21) =====
            case 'quiz-offer-hero':
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
                        <OfferHeroBlock block={block} isSelected={rest.isSelected} onSelect={rest.onSelect} />
                    </SelectableBlock>
                );
            case 'offer-benefits':
                return (
                    <SelectableBlock
                        blockId={block.id}
                        isSelected={!!rest.isSelected}
                        isEditable={!!rest.isEditable}
                        onSelect={() => rest.onSelect?.(block.id)}
                        blockType="Benefícios da Oferta"
                        onOpenProperties={() => rest.onOpenProperties?.(block.id)}
                        isDraggable={true}
                    >
                        <OfferBenefitsBlock block={block} isSelected={rest.isSelected} onSelect={rest.onSelect} />
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
    })();
    return (
        <SafeBoundary label={`Erro no bloco: ${String(block?.type || 'desconhecido')}`}>
            {content}
        </SafeBoundary>
    );
};

export default React.memo(BlockTypeRenderer);
