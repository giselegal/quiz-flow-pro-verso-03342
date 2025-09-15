import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { 
  QuizDataProvider,
  ResultHeaderModule,
  StyleRevealModule,
  UserGreetingModule,
  CompatibilityModule,
  SecondaryStylesModule,
  OfferModule
} from '../modules/step20';

/**
 * STEP 20 MODULAR BLOCKS - Wrapper components para integração com o editor
 * Cada componente é wrappado com QuizDataProvider para acesso aos dados do quiz
 */

// Result Header Block
export const Step20ResultHeaderBlock: React.FC<BlockComponentProps> = ({ 
  block, 
  isSelected = false, 
  onPropertyChange,
  className = '' 
}) => {
  return (
    <div className={cn('step20-result-header-block', className)}>
      <QuizDataProvider block={block}>
        <ResultHeaderModule
          {...(block?.properties || {})}
          isSelected={isSelected}
          onPropertyChange={onPropertyChange}
        />
      </QuizDataProvider>
    </div>
  );
};

// Style Reveal Block
export const Step20StyleRevealBlock: React.FC<BlockComponentProps> = ({ 
  block, 
  isSelected = false, 
  onPropertyChange,
  className = '' 
}) => {
  return (
    <div className={cn('step20-style-reveal-block', className)}>
      <QuizDataProvider block={block}>
        <StyleRevealModule
          {...(block?.properties || {})}
          isSelected={isSelected}
          onPropertyChange={onPropertyChange}
        />
      </QuizDataProvider>
    </div>
  );
};

// User Greeting Block
export const Step20UserGreetingBlock: React.FC<BlockComponentProps> = ({ 
  block, 
  isSelected = false, 
  onPropertyChange,
  className = '' 
}) => {
  return (
    <div className={cn('step20-user-greeting-block', className)}>
      <QuizDataProvider block={block}>
        <UserGreetingModule
          {...(block?.properties || {})}
          isSelected={isSelected}
          onPropertyChange={onPropertyChange}
        />
      </QuizDataProvider>
    </div>
  );
};

// Compatibility Block
export const Step20CompatibilityBlock: React.FC<BlockComponentProps> = ({ 
  block, 
  isSelected = false, 
  onPropertyChange,
  className = '' 
}) => {
  return (
    <div className={cn('step20-compatibility-block', className)}>
      <QuizDataProvider block={block}>
        <CompatibilityModule
          {...(block?.properties || {})}
          isSelected={isSelected}
          onPropertyChange={onPropertyChange}
        />
      </QuizDataProvider>
    </div>
  );
};

// Secondary Styles Block
export const Step20SecondaryStylesBlock: React.FC<BlockComponentProps> = ({ 
  block, 
  isSelected = false, 
  onPropertyChange,
  className = '' 
}) => {
  return (
    <div className={cn('step20-secondary-styles-block', className)}>
      <QuizDataProvider block={block}>
        <SecondaryStylesModule
          {...(block?.properties || {})}
          isSelected={isSelected}
          onPropertyChange={onPropertyChange}
        />
      </QuizDataProvider>
    </div>
  );
};

// Personalized Offer Block
export const Step20PersonalizedOfferBlock: React.FC<BlockComponentProps> = ({ 
  block, 
  isSelected = false, 
  onPropertyChange,
  className = '' 
}) => {
  return (
    <div className={cn('step20-personalized-offer-block', className)}>
      <QuizDataProvider block={block}>
        <OfferModule
          {...(block?.properties || {})}
          isSelected={isSelected}
          onPropertyChange={onPropertyChange}
        />
      </QuizDataProvider>
    </div>
  );
};

// Complete Step 20 Template Block
export const Step20CompleteTemplateBlock: React.FC<BlockComponentProps> = ({ 
  block, 
  isSelected = false, 
  onPropertyChange,
  className = '' 
}) => {
  const {
    showResultHeader = true,
    showUserGreeting = true,
    showStyleReveal = true,
    showCompatibility = true,
    showSecondaryStyles = true,
    showPersonalizedOffer = true,
    templateLayout = 'vertical',
    spacing = 'lg'
  } = block?.properties || {};

  const layoutClasses = {
    vertical: 'space-y-8',
    horizontal: 'grid grid-cols-1 md:grid-cols-2 gap-8',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
  };

  const spacingClasses = {
    sm: 'space-y-4 gap-4',
    md: 'space-y-6 gap-6', 
    lg: 'space-y-8 gap-8'
  };

  return (
    <div className={cn(
      'step20-complete-template-block w-full',
      layoutClasses[templateLayout as keyof typeof layoutClasses] || layoutClasses.vertical,
      spacingClasses[spacing as keyof typeof spacingClasses] || spacingClasses.lg,
      isSelected && 'ring-2 ring-primary ring-offset-4',
      className
    )}>
      <QuizDataProvider block={block}>
        {/* Header do resultado */}
        {showResultHeader && (
          <ResultHeaderModule
            {...(block?.properties?.resultHeader || {})}
            isSelected={false}
          />
        )}

        {/* Saudação do usuário */}
        {showUserGreeting && (
          <UserGreetingModule
            {...(block?.properties?.userGreeting || {})}
            isSelected={false}
          />
        )}

        {/* Layout principal */}
        <div className={templateLayout === 'vertical' ? 'space-y-6' : 'grid md:grid-cols-2 gap-6'}>
          {/* Revelação do estilo */}
          {showStyleReveal && (
            <StyleRevealModule
              {...(block?.properties?.styleReveal || {})}
              isSelected={false}
            />
          )}

          {/* Indicador de compatibilidade */}
          {showCompatibility && (
            <CompatibilityModule
              {...(block?.properties?.compatibility || {})}
              isSelected={false}
            />
          )}
        </div>

        {/* Estilos secundários */}
        {showSecondaryStyles && (
          <SecondaryStylesModule
            {...(block?.properties?.secondaryStyles || {})}
            isSelected={false}
          />
        )}

        {/* Oferta personalizada */}
        {showPersonalizedOffer && (
          <OfferModule
            {...(block?.properties?.personalizedOffer || {})}
            isSelected={false}
            onPropertyChange={onPropertyChange}
          />
        )}
      </QuizDataProvider>
    </div>
  );
};

export default {
  Step20ResultHeaderBlock,
  Step20StyleRevealBlock,
  Step20UserGreetingBlock,
  Step20CompatibilityBlock,
  Step20SecondaryStylesBlock,
  Step20PersonalizedOfferBlock,
  Step20CompleteTemplateBlock
};