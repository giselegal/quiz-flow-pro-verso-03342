import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { MousePointer2, Edit3, ArrowRight, Download, Play, Star } from 'lucide-react';
import type { BlockComponentProps } from '../../../types/blocks';
import { userResponseService } from '../../../services/userResponseService';

/**
 * ButtonInlineBlock - Componente modular inline horizontal
 * Botão responsivo e configurável com múltiplas variantes
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ButtonInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  const {
    text = 'Clique Aqui',
    variant = 'primary', // primary, secondary, outline, ghost, destructive
    size = 'medium', // small, medium, large
    icon = 'none', // none, arrow-right, download, play, star
    iconPosition = 'right', // left, right, none
    fullWidth = false,
    disabled = false,
    href = '',
    target = '_blank',
    backgroundColor = '',
    textColor = '',
    borderColor = '',
    borderRadius = 'medium',
    requiresValidInput = false // Nova propriedade para validação
  } = block.properties;

  // Estado para controlar se o botão deve estar habilitado
  const [isValidated, setIsValidated] = useState(!requiresValidInput);

  // Verificar se há um nome válido quando requiresValidInput for true
  useEffect(() => {
    if (requiresValidInput) {
      // Verificar se há um nome salvo
      const nameInput = userResponseService.getResponse('intro-name-input');
      const hasValidName = nameInput && nameInput.trim().length > 0;
      setIsValidated(hasValidName);

      // Listener para mudanças via evento customizado
      const handleQuizInputChange = (event: CustomEvent) => {
        if (event.detail.blockId === 'intro-name-input') {
          setIsValidated(event.detail.valid && event.detail.value.length > 0);
        }
      };

      // Listener para mudanças no localStorage (backup)
      const handleStorageChange = () => {
        const updatedName = userResponseService.getResponse('intro-name-input');
        const hasUpdatedValidName = updatedName && updatedName.trim().length > 0;
        setIsValidated(hasUpdatedValidName);
      };

      // Adicionar listeners
      window.addEventListener('quiz-input-change', handleQuizInputChange as EventListener);
      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('quiz-input-change', handleQuizInputChange as EventListener);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [requiresValidInput]);

  // Determinar se o botão deve estar desabilitado
  const isButtonDisabled = disabled || (requiresValidInput && !isValidated);

  // Ícones disponíveis
  const iconMap = {
    'none': null,
    'arrow-right': ArrowRight,
    'download': Download,
    'play': Play,
    'star': Star
  };

  const IconComponent = iconMap[icon as keyof typeof iconMap];

  // Variantes de cor
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-900 border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900 border-transparent',
    destructive: 'bg-red-600 hover:bg-red-700 text-white border-red-600'
  };

  // Tamanhos
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  // Border radius
  const borderRadiusClasses = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full'
  };

  const customStyles = {
    backgroundColor: backgroundColor || undefined,
    color: textColor || undefined,
    borderColor: borderColor || undefined
  };

  const hasCustomStyles = backgroundColor || textColor || borderColor;

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível
        'flex-shrink-0 flex-grow-0 relative group',
        fullWidth ? 'w-full' : 'w-auto',
        // Container editável
        'p-1 rounded-lg cursor-pointer',
        isSelected && 'bg-blue-50/30',
        className
      )}
      onClick={onClick}
    >
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'hover:scale-105 active:scale-95',
          // Tamanho
          sizeClasses[size as keyof typeof sizeClasses],
          // Variante (aplicada apenas se não há estilos customizados)
          !hasCustomStyles && variantClasses[variant as keyof typeof variantClasses],
          // Border radius
          borderRadiusClasses[borderRadius as keyof typeof borderRadiusClasses],
          // Estados
          isButtonDisabled && 'opacity-50 cursor-not-allowed hover:scale-100',
          fullWidth && 'w-full'
        )}
        style={hasCustomStyles ? customStyles : undefined}
        disabled={isButtonDisabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!isButtonDisabled && href) {
            window.open(href, target);
          }
        }}
      >
        {/* Ícone à esquerda */}
        {IconComponent && iconPosition === 'left' && (
          <IconComponent className={cn(iconSizes[size as keyof typeof iconSizes], 'mr-2')} />
        )}

        {/* Texto do botão */}
        <span>{text || 'Clique Aqui'}</span>

        {/* Ícone à direita */}
        {IconComponent && iconPosition === 'right' && (
          <IconComponent className={cn(iconSizes[size as keyof typeof iconSizes], 'ml-2')} />
        )}
      </button>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
          <Edit3 className="w-3 h-3" />
        </div>
      )}

      {/* Empty state */}
      {!text && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-lg text-gray-500 text-sm">
          <MousePointer2 className="w-4 h-4 mr-2" />
          Clique para selecionar e editar no painel
        </div>
      )}
    </div>
  );
};

export default ButtonInlineBlock;