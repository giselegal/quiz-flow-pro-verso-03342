/* @ts-nocheck */
// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BlockComponentProps,
  ProgressConfig,
  Alignment,
  Size,
  ButtonStyle,
  InteractionCallbacks,
} from './types';

/**
 * IntroPage - Componente de página de introdução configurável
 *
 * Renderiza uma página de boas-vindas com logo, título, subtítulo, imagem,
 * campo de nome, descrição e botão de ação. Totalmente configurável via props.
 *
 * @example
 * <IntroPage
 *   title="Descubra Seu Estilo Único"
 *   subtitle="Um quiz personalizado para transformar seu guarda-roupa"
 *   logoUrl="https://example.com/logo.png"
 *   imageUrl="https://example.com/intro.jpg"
 *   showNameInput={true}
 *   buttonText="Começar Quiz"
 *   onSubmit={(data) => console.log('Nome:', data.name)}
 * />
 */

export interface IntroPageProps extends BlockComponentProps, InteractionCallbacks {
  // Conteúdo principal
  title: string;
  subtitle?: string;
  description?: string;

  // Imagens
  logoUrl?: string;
  logoAlt?: string;
  logoSize?: Size;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'top' | 'bottom' | 'left' | 'right' | 'background';

  // Campo de nome
  showNameInput?: boolean;
  nameInputLabel?: string;
  nameInputPlaceholder?: string;
  nameRequired?: boolean;
  initialName?: string;

  // Botão de ação
  buttonText: string;
  buttonStyle?: ButtonStyle;
  buttonSize?: Size;
  buttonFullWidth?: boolean;

  // Layout e estilos
  alignment?: Alignment;
  titleSize?: Size;
  spacing?: Size;

  // Progresso
  progressConfig?: ProgressConfig;

  // Validação
  validateName?: (name: string) => string | null;
}

export const IntroPage: React.FC<IntroPageProps> = ({
  // Conteúdo
  title,
  subtitle,
  description,

  // Imagens
  logoUrl,
  logoAlt = 'Logo',
  logoSize = 'medium',
  imageUrl,
  imageAlt = 'Imagem ilustrativa',
  imagePosition = 'top',

  // Campo de nome
  showNameInput = true,
  nameInputLabel = 'Como você gostaria de ser chamada?',
  nameInputPlaceholder = 'Digite seu primeiro nome',
  nameRequired = true,
  initialName = '',

  // Botão
  buttonText,
  buttonStyle = 'primary',
  buttonSize = 'large',
  buttonFullWidth = true,

  // Layout
  alignment = 'center',
  titleSize = 'large',
  spacing = 'medium',

  // Progresso
  progressConfig,

  // Callbacks
  onSubmit,
  onChange,
  onValidation,
  onError,
  validateName,

  // Props base
  deviceView = 'desktop',
  className = '',
  style = {},
  testId = 'intro-page',
  ...props
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  // Classes de tamanho
  const sizeClasses = {
    small: {
      title: 'text-2xl md:text-3xl',
      subtitle: 'text-lg',
      logo: 'w-16 h-16',
      spacing: 'space-y-2',
    },
    medium: {
      title: 'text-3xl md:text-4xl',
      subtitle: 'text-xl',
      logo: 'w-20 h-20',
      spacing: 'space-y-2',
    },
    large: {
      title: 'text-4xl md:text-5xl',
      subtitle: 'text-2xl',
      logo: 'w-24 h-24',
      spacing: 'space-y-2',
    },
  };

  // Classes de alinhamento
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  // Classes de botão
  const buttonClasses = {
    primary: 'bg-[#B89B7A] hover:bg-[#A08766] text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    accent:
      'bg-gradient-to-r from-[#B89B7A] to-[#D4B896] hover:from-[#A08766] to-[#C4A886] text-white',
    outline: 'border-2 border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white',
  };

  const currentSizeClasses = sizeClasses[titleSize as keyof typeof sizeClasses];
  const currentAlignmentClasses = alignmentClasses[alignment as keyof typeof alignmentClasses];

  const handleNameChange = (value: string) => {
    setName(value);
    setError(null);

    if (validateName) {
      const validationError = validateName(value);
      if (validationError) {
        setError(validationError);
        onValidation?.(false);
      } else {
        onValidation?.(true);
      }
    }

    onChange?.(value);
  };

  const handleSubmit = () => {
    if (showNameInput && nameRequired && !name.trim()) {
      const errorMsg = 'Por favor, digite seu nome';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (validateName && showNameInput) {
      const validationError = validateName(name);
      if (validationError) {
        setError(validationError);
        onError?.(validationError);
        return;
      }
    }

    onSubmit?.({ name: name.trim() });
  };

  const containerClasses = getOptimizedContainerClasses(
    deviceView || 'desktop',
    'tight',
    'full',
    className
  );

  return (
    <div className={containerClasses} style={style} data-testid={testId} {...props}>
      {/* Barra de Progresso */}
      {progressConfig?.showProgress && (
        <div className="w-full max-w-md mx-auto mb-8">
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <div
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressConfig.progressValue || 0}%` }}
            />
          </div>
          {progressConfig.currentStep && progressConfig.totalSteps && (
            <p style={{ color: '#6B4F43' }}>
              Etapa {progressConfig.currentStep} de {progressConfig.totalSteps}
            </p>
          )}
        </div>
      )}

      {/* Logo */}
      {logoUrl && (
        <div className="mb-6">
          <img
            src={logoUrl}
            alt={logoAlt}
            className={`${currentSizeClasses.logo} object-contain mx-auto`}
          />
        </div>
      )}

      {/* Imagem Principal (se posição for top) */}
      {imageUrl && imagePosition === 'top' && (
        <div className="mb-8">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        {/* Título */}
        <h1 className={`${currentSizeClasses.title} font-bold text-[#432818] mb-4`}>{title}</h1>

        {/* Subtítulo */}
        {subtitle && (
          <h2 className={`${currentSizeClasses.subtitle} text-gray-600 mb-6`}>{subtitle}</h2>
        )}

        {/* Descrição */}
        {description && <p style={{ color: '#6B4F43' }}>{description}</p>}

        {/* Imagem (se posição for middle) */}
        {imageUrl && imagePosition === 'top' && (
          <div className="mb-8">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Campo de Nome */}
        {showNameInput && (
          <div className="mb-6">
            <label className="block text-lg font-medium text-[#432818] mb-3">
              {nameInputLabel}
            </label>
            <Input
              type="text"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder={nameInputPlaceholder}
              className={`text-lg py-6 ${error ? 'border-red-500' : ''}`}
              data-testid="name-input"
            />
            {error && <p style={{ color: '#432818' }}>{error}</p>}
          </div>
        )}

        {/* Botão de Ação */}
        <Button
          onClick={handleSubmit}
          size={buttonSize === 'small' ? 'sm' : buttonSize === 'large' ? 'lg' : 'default'}
          className={`
            ${buttonClasses[buttonStyle as keyof typeof buttonClasses]}
            ${buttonFullWidth ? 'w-full' : 'w-auto'}
            py-6 text-lg font-semibold transition-all duration-200
            ${deviceView === 'mobile' ? 'text-base py-4' : ''}
          `}
          data-testid="submit-button"
        >
          {buttonText}
        </Button>
      </div>

      {/* Imagem Principal (se posição for bottom) */}
      {imageUrl && imagePosition === 'bottom' && (
        <div className="mt-8">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default IntroPage;
