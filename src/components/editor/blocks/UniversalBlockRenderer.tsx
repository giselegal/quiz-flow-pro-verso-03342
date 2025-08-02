// UniversalBlockRenderer.tsx
// Renderizador universal para todos os componentes inline das 21 etapas
import React, { Suspense } from 'react';
import { cn } from '../../../lib/utils';
import { EditorBlock } from '../../../types/editor';
import { getBlockComponent } from './BlockRegistry';

// ===== IMPORTS DOS COMPONENTES INLINE (LAZY LOADING) =====
import {
  // Componentes básicos (sempre carregados)
  TextInlineBlock,
  HeadingInlineBlock,
  ButtonInlineBlock,
  BadgeInlineBlock,
  
  // Componentes de imagem e mídia
  ImageDisplayInlineBlock,
  ProgressInlineBlock,
  StatInlineBlock,
  CountdownInlineBlock,
  
  // Componentes de layout
  SpacerInlineBlock,
  DividerInlineBlock,
  
  // Componentes de marketing
  BenefitsInlineBlock,
  GuaranteeInlineBlock,
  CTAInlineBlock,
  StyleCardInlineBlock,
  ResultCardInlineBlock,
  PricingCardInlineBlock,
  TestimonialCardInlineBlock,
  ResultHeaderInlineBlock,
  TestimonialsInlineBlock,
  BeforeAfterInlineBlock,
  StepHeaderInlineBlock,
  QuizOfferPricingInlineBlock,
  QuizOfferCTAInlineBlock,
  BonusListInlineBlock,
  QuizIntroHeaderBlock,
  LoadingAnimationBlock,
  QuizStartPageInlineBlock,
  QuizPersonalInfoInlineBlock,
  QuizExperienceInlineBlock,
  QuizQuestionInlineBlock,
  QuizProgressInlineBlock,
  QuizTransitionInlineBlock,
  QuizLoadingInlineBlock,
  QuizResultInlineBlock,
  QuizCertificateInlineBlock,
  QuizLeaderboardInlineBlock,
} from './inline/index.lazy';

// ===== FALLBACK COMPONENT PARA LAZY LOADING =====
const LazyFallback = () => (
  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg animate-pulse border-2 border-dashed border-gray-200">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="text-sm text-gray-500">Carregando componente...</div>
    </div>
  </div>
);

// ===== MAPEAMENTO DE TIPOS PARA COMPONENTES =====
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  // ===== COMPONENTES BÁSICOS =====
  'text-inline': TextInlineBlock,
  'heading-inline': HeadingInlineBlock,
  'button-inline': ButtonInlineBlock,
  'image-display-inline': ImageDisplayInlineBlock,
  'badge-inline': BadgeInlineBlock,
  'progress-inline': ProgressInlineBlock,
  'stat-inline': StatInlineBlock,
  'countdown-inline': CountdownInlineBlock,
  
  // ===== COMPONENTES DE LAYOUT =====
  'spacer-inline': SpacerInlineBlock,
  'divider-inline': DividerInlineBlock,
  
  // ===== COMPONENTES DE MARKETING =====
  'benefits-inline': BenefitsInlineBlock,
  'guarantee-inline': GuaranteeInlineBlock,
  'cta-inline': CTAInlineBlock,
  
  // ===== COMPONENTES DE DESIGN =====
  'style-card-inline': StyleCardInlineBlock,
  'result-card-inline': ResultCardInlineBlock,
  'pricing-card-inline': PricingCardInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  
  // ===== COMPONENTES DE RESULTADO (ETAPA 20) =====
  'result-header-inline': ResultHeaderInlineBlock,
  'testimonials-inline': TestimonialsInlineBlock,
  'before-after-inline': BeforeAfterInlineBlock,
  'step-header-inline': StepHeaderInlineBlock,
  
  // ===== COMPONENTES DE OFERTA (ETAPA 21) =====
  'quiz-offer-pricing-inline': QuizOfferPricingInlineBlock,
  'quiz-offer-cta-inline': QuizOfferCTAInlineBlock,
  'bonus-list-inline': BonusListInlineBlock,
  
  // ===== COMPONENTES ESPECIALIZADOS QUIZ =====
  'quiz-intro-header': QuizIntroHeaderBlock,
  'loading-animation': LoadingAnimationBlock,
  
  // ===== COMPONENTES DAS 21 ETAPAS =====
  'quiz-start-page-inline': QuizStartPageInlineBlock,
  'quiz-personal-info-inline': QuizPersonalInfoInlineBlock,
  'quiz-experience-inline': QuizExperienceInlineBlock,
  'quiz-question-inline': QuizQuestionInlineBlock,
  'quiz-progress-inline': QuizProgressInlineBlock,
  'quiz-transition-inline': QuizTransitionInlineBlock,
  'quiz-loading-inline': QuizLoadingInlineBlock,
  'quiz-result-inline': QuizResultInlineBlock,
  'quiz-certificate-inline': QuizCertificateInlineBlock,
  'quiz-leaderboard-inline': QuizLeaderboardInlineBlock,
};

// Fallback para compatibilidade com sistema antigo
import * as BlockComponents from './index';

export interface BlockRendererProps {
  block: EditorBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<EditorBlock>) => void;
  onDelete: () => void;
  isPreview?: boolean;
}

export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block, isSelected, onSelect, onUpdate, onDelete, isPreview
}) => {
  console.log(`🔍 [UniversalBlockRenderer] Renderizando bloco tipo: ${block.type}`);
  
  // 1. Buscar componente no mapeamento moderno
  let ComponentToRender: React.ComponentType<any> | null = COMPONENT_MAP[block.type] || null;
  
  if (ComponentToRender) {
    console.log(`✅ [UniversalBlockRenderer] Componente encontrado no COMPONENT_MAP: ${block.type}`);
  } else {
    // 2. Fallback para BlockRegistry (sistema mais recente)
    const registryComponent = getBlockComponent(block.type);
    
    if (registryComponent) {
      ComponentToRender = registryComponent;
      console.log(`✅ [UniversalBlockRenderer] Componente encontrado no BlockRegistry: ${block.type}`);
    } else {
      // 3. Fallback para sistema antigo (PascalCase)
      const toPascal = (s: string) =>
        s.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
      
      const componentName = `${toPascal(block.type)}Block`;
      const legacyComponent = BlockComponents[componentName as keyof typeof BlockComponents];
      
      if (legacyComponent) {
        ComponentToRender = legacyComponent as React.ComponentType<any>;
        console.log(`✅ [UniversalBlockRenderer] Componente encontrado no sistema antigo: ${componentName}`);
      }
    }
  }

  // Se não encontrou o componente, mostrar placeholder informativo
  if (!ComponentToRender) {
    console.warn(`⚠️ [UniversalBlockRenderer] Componente não encontrado: ${block.type}`);
    return (
      <div 
        onClick={onSelect}
        className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50 cursor-pointer"
      >
        <div className="text-center">
          <p className="text-red-600 text-sm font-medium">
            ⚠️ Componente não encontrado
          </p>
          <p className="text-red-500 text-xs mt-1">
            Tipo: <code className="bg-red-100 px-1 rounded">{block.type}</code>
          </p>
          <p className="text-red-400 text-xs mt-1">
            Verifique se o componente está implementado e mapeado.
          </p>
        </div>
      </div>
    );
  }
  
  // Função para atualizar propriedades do bloco
  const handleContentUpdate = (key: string, value: any) => {
    console.log(`🔧 [UniversalBlockRenderer] Atualizando propriedade ${key}:`, value);
    onUpdate({ 
      ...block,
      properties: { ...block.properties, [key]: value } 
    });
  };

  return (
    <div
      onClick={onSelect}
      data-block-type={block.type}
      data-block-id={block.id}
      className={cn(
        "relative cursor-pointer transition-all duration-200 rounded-lg",
        isSelected
          ? 'ring-2 ring-[#B89B7A] ring-opacity-50 bg-[#FAF9F7]'
          : 'hover:bg-gray-50',
        !isPreview && 'border border-transparent hover:border-gray-200 p-2'
      )}
    >
      <Suspense fallback={<LazyFallback />}>
        <ComponentToRender
          {...block.properties}
          block={block}
          isSelected={isSelected}
          onClick={onSelect}
          onPropertyChange={handleContentUpdate}
          disabled={isPreview}
        />
      </Suspense>
      
      {!isPreview && isSelected && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          {/* Indicador do tipo do bloco */}
          <span className="px-2 py-1 bg-[#B89B7A] text-white text-xs rounded-full">
            {block.type}
          </span>
          {/* Botão de deletar */}
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
            title="Deletar bloco"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversalBlockRenderer;
