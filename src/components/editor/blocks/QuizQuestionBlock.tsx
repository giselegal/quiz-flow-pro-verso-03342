import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Heart, ArrowRight, ArrowLeft, Settings, Star, Tag, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorQuizContext } from '../../../contexts/EditorQuizContext';

interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory?: string;
  points?: number;
  keywords?: string[];
}

interface QuizQuestionBlockProps {
  question?: string;
  options?: Array<QuestionOption>;
  allowMultiple?: boolean;
  showImages?: boolean;
  maxSelections?: number;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  onNext?: () => void;
  onBack?: () => void;
  progressPercent?: number;
  logoUrl?: string;
  className?: string;
  block?: any;
  isSelected?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
  isEditing?: boolean;
  showPropertiesPanel?: boolean;
}

const QuizQuestionBlock = ({
  question = 'Etapa 1: Qual dessas opções representa melhor seu estilo predominante?',
  options = [
    { 
      id: '1', 
      text: 'Clássico e elegante', 
      imageUrl: 'https://res.cloudinary.com/dtx0k4ue6/image/upload/v1710847234/estilo-classico_urkpfx.jpg',
      styleCategory: 'Clássico',
      points: 2,
      keywords: ['elegante', 'sofisticado', 'atemporal']
    },
    { 
      id: '2', 
      text: 'Moderno e descolado', 
      imageUrl: 'https://res.cloudinary.com/dtx0k4ue6/image/upload/v1710847235/estilo-moderno_hqxmzv.jpg',
      styleCategory: 'Contemporâneo',
      points: 3,
      keywords: ['moderno', 'descolado', 'inovador']
    },
    { 
      id: '3', 
      text: 'Natural e autêntico', 
      imageUrl: 'https://res.cloudinary.com/dtx0k4ue6/image/upload/v1710847236/estilo-natural_wnxkdi.jpg',
      styleCategory: 'Natural',
      points: 1,
      keywords: ['natural', 'autêntico', 'orgânico']
    },
    { 
      id: '4', 
      text: 'Casual e descontraído',
      styleCategory: 'Natural',
      points: 1,
      keywords: ['casual', 'descontraído', 'relaxado']
    }
  ],
  allowMultiple = true,
  showImages = true,
  maxSelections = 3,
  autoAdvance = true,
  autoAdvanceDelay = 1500,
  onNext,
  onBack,
  progressPercent = 0,
  logoUrl = 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
  className,
  block,
  isSelected = false,
  onPropertyChange,
  isEditing = false,
  showPropertiesPanel = false
}: QuizQuestionBlockProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [showProperties, setShowProperties] = useState(showPropertiesPanel);

  // Configurações visuais
  const transition = 'all 0.3s ease-in-out';
  const selectedBg = 'bg-blue-100';
  const selectedBorder = 'border-blue-500';
  const hoverBg = 'hover:bg-gray-50';
  const hoverBorder = 'hover:border-gray-300';

  // Cores das categorias
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Natural': '#8B7355',
      'Clássico': '#4A4A4A',
      'Contemporâneo': '#2563EB',
      'Elegante': '#7C3AED',
      'Romântico': '#EC4899',
      'Sexy': '#EF4444',
      'Dramático': '#1F2937',
      'Criativo': '#F59E0B',
    };
    return colors[category || ''] || '#6B7280';
  };

  // Tentar usar context do editor, mas não falhar se não estiver disponível
  const editorQuizContext = (() => {
    try {
      return useEditorQuizContext();
    } catch {
      return null; // Editor em modo preview
    }
  })();

  // Auto-avanço quando atingir máximo de seleções
  useEffect(() => {
    if (autoAdvance && allowMultiple && selectedOptions.size === maxSelections) {
      setIsAutoAdvancing(true);
      const timer = setTimeout(() => {
        onNext?.();
        setIsAutoAdvancing(false);
      }, autoAdvanceDelay);
      
      return () => clearTimeout(timer);
    }
  }, [selectedOptions.size, autoAdvance, allowMultiple, maxSelections, autoAdvanceDelay, onNext]);

  const handleOptionClick = (optionId: string) => {
    const newSelected = new Set(selectedOptions);
    
    if (allowMultiple) {
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId);
      } else if (newSelected.size < maxSelections) {
        newSelected.add(optionId);
      }
    } else {
      newSelected.clear();
      newSelected.add(optionId);
      // Auto-avanço imediato para seleção única
      if (autoAdvance) {
        setTimeout(() => onNext?.(), autoAdvanceDelay);
      }
    }
    
    setSelectedOptions(newSelected);

    // ✅ INTEGRAÇÃO COM LÓGICA REAL DE CÁLCULO
    if (editorQuizContext && block?.id) {
      const selectedArray = Array.from(newSelected);
      editorQuizContext.handleAnswer(block.id, selectedArray);
    }
  };

  const canProceed = allowMultiple 
    ? selectedOptions.size === maxSelections 
    : selectedOptions.size > 0;

  // Destructuring das configurações de estilo
  const { transition } = ANIMATION_CONFIG;
  const { 
    default: defaultStyles, 
    selected: selectedStyles, 
    hover: hoverStyles 
  } = VISUAL_STATES_CONFIG;

  return (
    <div className={cn(
      "w-full h-full flex flex-col bg-white",
      // Layout responsivo HORIZONTAL - MÁXIMO 2 COLUNAS - LARGURA 100%
      "p-4 md:p-6 rounded-lg border border-gray-200",
      // LARGURA 100% DO CONTAINER - SEM ARGUMENTOS VERTICAIS
      "min-h-[200px] max-w-full",
      isSelected && "ring-2 ring-blue-500 bg-blue-50",
      className
    )}>
      
      {/* Vertical Canvas Header */}
      <div className="flex flex-row w-full h-auto justify-center relative mb-6" data-sentry-component="VerticalCanvasHeader">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="absolute left-0 h-10 w-10 hover:bg-primary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        {/* Logo and Progress Container */}
        <div className="flex flex-col w-full customizable-width justify-start items-center gap-4">
          {/* Logo */}
          {logoUrl && (
            <img 
              width="96" 
              height="96" 
              className="max-w-24 object-cover rounded-lg" 
              alt="Logo" 
              src={logoUrl}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          
          {/* Progress Bar */}
          {progressPercent > 0 && (
            <div 
              className="relative w-full overflow-hidden rounded-full bg-zinc-300 h-2"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
            >
              <div 
                className="progress h-full w-full flex-1 bg-[#B89B7A] transition-all duration-500"
                style={{ transform: `translateX(-${100 - progressPercent}%)` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar - Versão alternativa se não houver logo */}
      {!logoUrl && progressPercent > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Progresso</span>
            <span className="text-xs text-gray-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Question Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#aa6b5d] mb-3 leading-tight">
          {question}
        </h2>
        {allowMultiple && (
          <p className="text-[#8F7A6A] text-xs md:text-sm">
            {autoAdvance 
              ? `Escolha até ${maxSelections} opções - avanço automático ativado` 
              : `Você pode escolher até ${maxSelections} opções que mais combinam com você`
            }
          </p>
        )}
      </div>

      {/* Options Grid - RESPONSIVO MÁXIMO 2 COLUNAS - LAYOUT HORIZONTAL */}
      <div className={cn(
        "grid gap-3 md:gap-4 flex-1 w-full",
        // Converter opções para o formato correto usando spread operator
        OptionsGridUtils.getGridClasses(
          options.map(opt => ({ 
            ...opt, 
            value: opt.id,
            category: '' 
          })), 
          2
        )
      )}>
        {options.map((option) => {
          const isOptionSelected = selectedOptions.has(option.id);
          const hasImage = Boolean(option.imageUrl && option.imageUrl.trim() !== '');
          const { aspectRatio } = OptionsGridUtils.getCardAspectConfig(hasImage);
          
          return (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={cn(
                "relative cursor-pointer rounded-lg border-2 bg-white hover:shadow-md flex flex-col",
                transition,
                aspectRatio,
                isOptionSelected 
                  ? `${selectedStyles.border} ${selectedStyles.background} ${selectedStyles.shadow}` 
                  : `${defaultStyles.border} ${hoverStyles.border}/50`
              )}
            >
              {/* Selection Indicator */}
              {isOptionSelected && (
                <div className="absolute -top-1 -right-1 z-10">
                  <div className="w-5 h-5 bg-[#B89B7A] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              {/* Option Image */}
              {showImages && option.imageUrl && (
                <div className="aspect-video w-full rounded-t-lg overflow-hidden">
                  <img 
                    src={option.imageUrl} 
                    alt={option.text}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = OptionsGridUtils.getFallbackImageUrl(option.text);
                    }}
                  />
                </div>
              )}

              {/* Option Text */}
              <div className={cn(
                "p-3 text-center flex-1 flex items-center justify-center",
                !showImages && "py-6"
              )}>
                <h3 className={cn(
                  "font-medium text-[#432818] leading-tight text-center",
                  showImages ? "text-sm" : "text-base"
                )}>
                  {option.text}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Selection Counter */}
          {allowMultiple ? (
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#B89B7A]" />
              <span className="text-xs text-[#8F7A6A]">
                {`${selectedOptions.size} de ${maxSelections} selecionadas`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#B89B7A]" />
              <span className="text-xs text-[#8F7A6A]">
                {selectedOptions.size > 0 ? 'Selecionado' : 'Selecione uma opção'}
              </span>
            </div>
          )}

          {/* Next Button ou Auto-advance Status */}
          {!autoAdvance && canProceed && (
            <Button
              onClick={onNext}
              size="sm"
              className="bg-[#B89B7A] hover:bg-[#aa6b5d] text-white"
            >
              Próximo <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {autoAdvance && isAutoAdvancing && (
            <div className="flex items-center gap-2 text-xs text-[#B89B7A]">
              <div className="w-3 h-3 border-2 border-[#B89B7A] border-t-transparent rounded-full animate-spin" />
              Avançando...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionBlock;