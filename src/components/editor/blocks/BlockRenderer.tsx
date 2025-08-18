import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Block {
  id: string;
  type: string;
  properties: Record<string, any>;
  content: Record<string, any>;
  position: number;
}

interface BlockRendererProps {
  block: Block;
  isPreviewMode?: boolean;
  stepNumber?: number;
  userResponses?: Record<string, any>;
  setUserResponses?: (responses: Record<string, any>) => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isPreviewMode = false,
  stepNumber,
  userResponses = {},
  setUserResponses,
}) => {
  const handleUserInput = useCallback(
    (key: string, value: any) => {
      if (setUserResponses) {
        setUserResponses({
          ...userResponses,
          [key]: value,
        });
      }
    },
    [userResponses, setUserResponses]
  );

  const renderByType = () => {
    switch (block.type) {
      case 'text':
      case 'text-inline':
        return <TextBlock block={block} isPreviewMode={isPreviewMode} />;

      case 'quiz-intro-header':
      case 'quiz-header':
        return <QuizHeaderBlock block={block} stepNumber={stepNumber} />;

      case 'lead-form':
        return (
          <LeadFormBlock
            block={block}
            isPreviewMode={isPreviewMode}
            onUserInput={handleUserInput}
            userResponses={userResponses}
          />
        );

      case 'options-grid':
        return (
          <OptionsGridBlock
            block={block}
            isPreviewMode={isPreviewMode}
            stepNumber={stepNumber}
            onUserInput={handleUserInput}
            userResponses={userResponses}
          />
        );

      case 'button':
      case 'button-inline':
        return <ButtonBlock block={block} isPreviewMode={isPreviewMode} />;

      case 'image':
      case 'image-inline':
      case 'image-display-inline':
        return <ImageBlock block={block} />;

      case 'spacer':
      case 'spacer-inline':
        return <SpacerBlock block={block} />;

      case 'result-display':
        return <ResultDisplayBlock block={block} userResponses={userResponses} />;

      case 'offer-cta':
        return <OfferCTABlock block={block} isPreviewMode={isPreviewMode} />;

      default:
        return <DefaultBlock block={block} />;
    }
  };

  if (!isPreviewMode) {
    return (
      <div className="relative">
        <div className="text-xs text-muted-foreground font-mono mb-1 opacity-60">{block.type}</div>
        {renderByType()}
      </div>
    );
  }

  return renderByType();
};

// Individual Block Components

const TextBlock: React.FC<{ block: Block; isPreviewMode: boolean }> = ({ block }) => {
  const { text = 'Novo texto' } = block.content || {};
  const {
    fontSize = 'text-base',
    fontWeight = 'font-normal',
    textAlign = 'text-left',
    textColor = '#000000',
    backgroundColor = 'transparent',
  } = block.properties || {};

  return (
    <div
      className={cn('p-2 rounded', textAlign)}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <div className={cn(fontSize, fontWeight)}>{text}</div>
    </div>
  );
};

const QuizHeaderBlock: React.FC<{ block: Block; stepNumber?: number }> = ({
  block,
  stepNumber,
}) => {
  const properties = block.properties || {};
  const {
    logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt = 'Logo Gisele Galvão',
    progressValue,
    showProgress = true,
    progressColor = '#B89B7A',
    backgroundColor = '#FAF9F7',
  } = properties;

  // Safe numeric values with fallbacks
  const logoWidth = typeof properties.logoWidth === 'number' ? properties.logoWidth : 96;
  const logoHeight = typeof properties.logoHeight === 'number' ? properties.logoHeight : 96;

  const calculatedProgress = progressValue || ((stepNumber || 1) / 21) * 100;

  return (
    <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor }}>
      <img
        src={logoUrl}
        alt={logoAlt}
        className="w-12 h-12 rounded object-contain"
        style={{ width: `${logoWidth / 4}px`, height: `${logoHeight / 4}px` }}
      />

      {showProgress && (
        <div className="flex-1 mx-4">
          <Progress
            value={calculatedProgress}
            className="w-full h-2"
            style={
              {
                '--progress-background': progressColor,
              } as any
            }
          />
        </div>
      )}

      <span className="text-sm font-medium text-muted-foreground">
        {Math.round(calculatedProgress)}%
      </span>
    </div>
  );
};

const LeadFormBlock: React.FC<{
  block: Block;
  isPreviewMode: boolean;
  onUserInput: (key: string, value: any) => void;
  userResponses: Record<string, any>;
}> = ({ block, isPreviewMode, onUserInput, userResponses }) => {
  const {
    title = 'Digite seu nome',
    placeholder = 'Nome',
    buttonText = 'Continuar',
    validationMessage = 'Por favor, digite seu nome para continuar',
  } = block.content || {};

  const {
    required = true,
    backgroundColor = '#ffffff',
    textColor = '#432818',
  } = block.properties || {};

  const [inputValue, setInputValue] = useState(userResponses['userName'] || '');
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = () => {
    if (required && !inputValue.trim()) {
      setShowValidation(true);
      return;
    }

    onUserInput('userName', inputValue.trim());
    // In real implementation, trigger navigation to next step
    console.log('Form submitted with name:', inputValue);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowValidation(false);
    if (value.trim()) {
      onUserInput('userName', value.trim());
    }
  };

  const isButtonEnabled = !required || inputValue.trim().length > 0;

  return (
    <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor, color: textColor }}>
      <h3 className="text-lg font-semibold text-center">{title}</h3>

      <div className="space-y-2">
        <Input
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className={cn('w-full', showValidation && 'border-destructive')}
          readOnly={!isPreviewMode}
        />

        {showValidation && <p className="text-sm text-destructive">{validationMessage}</p>}
      </div>

      <Button
        className="w-full"
        disabled={!isButtonEnabled}
        onClick={isPreviewMode ? handleSubmit : undefined}
        variant={isButtonEnabled ? 'default' : 'secondary'}
      >
        {buttonText}
      </Button>

      {isPreviewMode && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Seu nome é necessário para personalizar sua experiência
        </p>
      )}
    </div>
  );
};

const OptionsGridBlock: React.FC<{
  block: Block;
  isPreviewMode: boolean;
  stepNumber?: number;
  onUserInput: (key: string, value: any) => void;
  userResponses: Record<string, any>;
}> = ({ block, isPreviewMode, stepNumber, onUserInput, userResponses }) => {
  const { title = 'Selecione suas opções', options = [] } = block.content || {};

  const {
    requiredSelections = 3,
    autoAdvance = true,
    showImages = false,
    columns = 2,
    showBorders = true,
    borderRadius = 8,
  } = block.properties || {};

  const responseKey = `step_${stepNumber}_selections`;
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    userResponses[responseKey] || []
  );

  const handleOptionSelect = (optionId: string) => {
    if (!isPreviewMode) return;

    let newSelections = [...selectedOptions];

    if (newSelections.includes(optionId)) {
      newSelections = newSelections.filter(id => id !== optionId);
    } else {
      if (newSelections.length < requiredSelections) {
        newSelections.push(optionId);
      }
    }

    setSelectedOptions(newSelections);
    onUserInput(responseKey, newSelections);

    // Auto-advance logic
    if (autoAdvance && newSelections.length === requiredSelections) {
      setTimeout(() => {
        console.log('Auto-advancing to next step...');
        // Implement navigation logic here
      }, 1500);
    }
  };

  const isComplete = selectedOptions.length === requiredSelections;
  const gridClass = columns === 1 ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-bold text-center text-primary">{title}</h3>

      <div className="text-center text-sm text-muted-foreground">
        Selecione {requiredSelections} opções ({selectedOptions.length}/{requiredSelections})
      </div>

      <div className={cn('grid gap-3', gridClass)}>
        {options.map((option: any) => {
          const isSelected = selectedOptions.includes(option.id);

          return (
            <div
              key={option.id}
              className={cn(
                'p-3 rounded cursor-pointer transition-all border-2',
                showBorders ? 'border-border' : 'border-transparent',
                isSelected ? 'border-primary bg-primary/10' : 'hover:border-primary/50',
                !isPreviewMode && 'cursor-default'
              )}
              style={{ borderRadius: `${borderRadius}px` }}
              onClick={() => handleOptionSelect(option.id)}
            >
              {showImages && option.imageUrl && (
                <div className="mb-2">
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}

              <div className="text-sm font-medium text-center">{option.text}</div>

              {option.description && (
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {option.description}
                </div>
              )}

              {isSelected && (
                <div className="mt-2 text-center">
                  <Badge variant="default">✓</Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!autoAdvance && (
        <Button
          className="w-full"
          disabled={!isComplete}
          variant={isComplete ? 'default' : 'secondary'}
        >
          Avançar
        </Button>
      )}

      {autoAdvance && isComplete && (
        <div className="text-center text-sm text-muted-foreground">
          Avançando automaticamente...
        </div>
      )}
    </div>
  );
};

const ButtonBlock: React.FC<{ block: Block; isPreviewMode: boolean }> = ({
  block,
  isPreviewMode,
}) => {
  const { text = 'Clique aqui', url = '#' } = block.content || {};
  const {
    disabled = false,
    backgroundColor = 'hsl(var(--primary))',
    textColor = 'hsl(var(--primary-foreground))',
  } = block.properties || {};

  return (
    <div className="p-2">
      <Button
        className="w-full"
        disabled={disabled}
        style={{
          backgroundColor,
          color: textColor,
        }}
        onClick={isPreviewMode ? () => window.open(url, '_blank') : undefined}
      >
        {text}
      </Button>
    </div>
  );
};

const ImageBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { url = '', alt = 'Imagem', caption = '' } = block.content || {};

  const { borderRadius = 8, maxWidth = '100%' } = block.properties || {};

  if (!url) {
    return (
      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
        <div className="text-4xl mb-2">🖼️</div>
        <p>Adicionar imagem</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <img
        src={url}
        alt={alt}
        className="w-full h-auto rounded"
        style={{
          borderRadius: `${borderRadius}px`,
          maxWidth,
        }}
      />
      {caption && <p className="text-sm text-muted-foreground text-center">{caption}</p>}
    </div>
  );
};

const SpacerBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { height = 40 } = block.properties || {};

  return <div className="w-full bg-transparent" style={{ height: `${height}px` }} />;
};

const ResultDisplayBlock: React.FC<{
  block: Block;
  userResponses: Record<string, any>;
}> = ({ userResponses }) => {
  const userName = userResponses['userName'] || 'Usuário';
  const styleCategory = userResponses['primaryStyle'] || 'Elegante';

  return (
    <div className="text-center space-y-4 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
      <h2 className="text-2xl font-bold">Olá, {userName}!</h2>
      <h3 className="text-xl text-primary font-semibold">Seu estilo é: {styleCategory}</h3>
      <p className="text-muted-foreground">Descubra como aplicar seu estilo único no dia a dia</p>
    </div>
  );
};

const OfferCTABlock: React.FC<{ block: Block; isPreviewMode: boolean }> = ({
  block,
  isPreviewMode,
}) => {
  const {
    title = 'Oferta Especial',
    description = 'Não perca esta oportunidade única!',
    buttonText = 'Quero Aproveitar',
    buttonUrl = '#',
    price = 'R$ 97,00',
    originalPrice = 'R$ 197,00',
  } = block.content;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center space-y-4">
      <h3 className="text-xl font-bold text-green-800">{title}</h3>

      <p className="text-green-700">{description}</p>

      <div className="space-y-2">
        {originalPrice && (
          <div className="text-sm line-through text-muted-foreground">De {originalPrice}</div>
        )}
        <div className="text-2xl font-bold text-green-600">Por apenas {price}</div>
      </div>

      <Button
        size="lg"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={isPreviewMode ? () => window.open(buttonUrl, '_blank') : undefined}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const DefaultBlock: React.FC<{ block: Block }> = ({ block }) => {
  return (
    <div className="p-4 bg-muted/30 rounded border border-dashed border-muted-foreground/30">
      <div className="text-sm font-medium mb-2">Componente: {block.type}</div>
      <div className="text-xs text-muted-foreground">ID: {block.id}</div>
    </div>
  );
};

export default BlockRenderer;
