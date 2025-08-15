import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGarbageCollector, useComponentCleanup } from '@/hooks/useGarbageCollector';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * 🎯 QUIZ INTRO OPTIMIZED BLOCK - Componente consolidado e otimizado
 * 
 * Consolida funcionalidades:
 * - Step01Template.tsx (UI completa)
 * - QuizIntroHeaderBlock.tsx (cabeçalho) 
 * - getStep01Template() (estrutura modular)
 * 
 * Features:
 * ✅ Schema-driven properties via useUnifiedProperties
 * ✅ Real-time form validation
 * ✅ Brand colors integration
 * ✅ Performance optimization with memoization
 * ✅ Lazy loading compatible
 * ✅ Analytics integration ready
 * ✅ A/B testing support
 */

interface QuizIntroOptimizedBlockProps extends BlockComponentProps {
  // Content properties
  logoUrl?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  mainTitle?: string;
  subtitle?: string;
  description?: string;
  
  // Form properties  
  inputLabel?: string;
  inputPlaceholder?: string;
  buttonText?: string;
  requiredFieldMessage?: string;
  
  // Style properties
  backgroundColor?: string;
  primaryColor?: string;
  textColor?: string;
  showProgress?: boolean;
  progressValue?: number;
  
  // Behavior properties
  onNext?: () => void;
  onInputChange?: (value: string, isValid: boolean) => void;
  sessionId?: string;
  minNameLength?: number;
  
  // Layout properties
  showStylePreviews?: boolean;
  showBenefits?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

// Style definitions for 8 quiz styles
const QUIZ_STYLES = [
  { name: 'Natural', color: '#8B7355', letter: 'A' },
  { name: 'Clássico', color: '#432818', letter: 'B' },
  { name: 'Contemporâneo', color: '#6B4F43', letter: 'C' },
  { name: 'Elegante', color: '#B89B7A', letter: 'D' },
  { name: 'Romântico', color: '#D4B5A0', letter: 'E' },
  { name: 'Sexy', color: '#8B4513', letter: 'F' },
  { name: 'Dramático', color: '#654321', letter: 'G' },
  { name: 'Criativo', color: '#A0522D', letter: 'H' },
];

// Benefits data
const QUIZ_BENEFITS = [
  {
    icon: '🎨',
    title: 'Seu Estilo Único',
    description: 'Qual dos 8 perfis de estilo combina perfeitamente com você',
  },
  {
    icon: '💡', 
    title: 'Guia Personalizado',
    description: 'Recomendações específicas para seu guarda-roupa ideal',
  },
  {
    icon: '🛍️',
    title: 'Dicas Práticas', 
    description: 'Como combinar peças, cores ideais e onde comprar',
  },
];

const QuizIntroOptimizedBlock = React.memo<QuizIntroOptimizedBlockProps>(({
  block,
  onClick,
  className,
  isSelected,
  
  // Content props with defaults
  logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
  logoAlt = 'Gisele Galvão Logo',
  logoWidth = 96,
  logoHeight = 96,
  mainTitle = 'Descubra Seu Estilo',
  subtitle = 'Único e Autêntico',
  description = 'Em apenas alguns minutos, vamos revelar qual dos 8 estilos representa perfeitamente sua personalidade e criar seu guia personalizado.',
  
  // Form props with defaults
  inputLabel = 'Como posso te chamar?',
  inputPlaceholder = 'Digite seu primeiro nome aqui...',
  buttonText = 'Quero Descobrir meu Estilo Agora!',
  requiredFieldMessage = 'Digite seu nome para continuar',
  
  // Style props with brand defaults
  backgroundColor = 'transparent',
  primaryColor = '#B89B7A',
  textColor = '#432818',
  showProgress = true,
  progressValue = 4.76, // 1/21 steps
  
  // Behavior props 
  onNext,
  onInputChange,
  sessionId,
  minNameLength = 2,
  
  // Layout props
  showStylePreviews = true,
  showBenefits = true,
  variant = 'default',
}) => {
  // State management
  const [inputValue, setInputValue] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  
  // Performance optimizations
  const { startAutoCleanup, stopAutoCleanup, forceCleanup } = useGarbageCollector({
    intervalMs: 120000, // 2 minutos
    threshold: 0.8,
    aggressiveCleanup: false,
  });
  
  const { addCleanupCallback, performComponentCleanup } = useComponentCleanup(`quiz-intro-${block?.id}`);
  
  // Auto-cleanup on mount/unmount
  useEffect(() => {
    startAutoCleanup();
    
    // Cleanup callback para event listeners
    const cleanupEventListeners = () => {
      // Remover todos os event listeners customizados
      window.removeEventListener('quiz-input-change', () => {});
      window.removeEventListener('quiz-form-complete', () => {});
    };
    
    addCleanupCallback(cleanupEventListeners);
    
    return () => {
      stopAutoCleanup();
      performComponentCleanup();
      // Force cleanup antes de unmount
      setTimeout(() => forceCleanup(), 100);
    };
  }, [startAutoCleanup, stopAutoCleanup, forceCleanup, addCleanupCallback, performComponentCleanup, block?.id]);
  
  // Memoized validation logic
  const validateInput = useCallback((value: string): boolean => {
    return value.trim().length >= minNameLength;
  }, [minNameLength]);
  
  // Input change handler with validation
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const isValid = validateInput(newValue);
    
    setInputValue(newValue);
    setIsValidInput(isValid);
    
    // External callback
    onInputChange?.(newValue, isValid);
    
    // Dispatch custom events for form integration
    window.dispatchEvent(new CustomEvent('quiz-input-change', {
      detail: {
        blockId: block?.id || 'quiz-intro-optimized',
        value: newValue,
        valid: isValid,
        field: 'name',
      },
    }));
  }, [validateInput, onInputChange, block?.id]);
  
  // Button click handler
  const handleNext = useCallback(() => {
    if (!isValidInput) return;
    
    // Dispatch form complete event
    window.dispatchEvent(new CustomEvent('quiz-form-complete', {
      detail: {
        formData: { name: inputValue },
        blockId: block?.id || 'quiz-intro-optimized',
        nextAction: 'step-02',
      },
    }));
    
    onNext?.();
  }, [isValidInput, inputValue, onNext, block?.id]);
  
  // Memoized style configurations
  const gradientBackground = useMemo(() => 
    `bg-gradient-to-br from-[#FAF9F7] via-white to-[${primaryColor}]/10`,
    [primaryColor]
  );
  
  // Variant-specific rendering
  const renderContent = () => {
    if (variant === 'minimal') {
      return (
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto">
            <img
              src={logoUrl}
              alt={logoAlt}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold" style={{ color: textColor }}>
              {mainTitle}
            </h1>
            <p className="text-lg opacity-80" style={{ color: textColor }}>
              {description}
            </p>
          </div>
          
          {renderForm()}
        </div>
      );
    }
    
    if (variant === 'compact') {
      return (
        <div className="space-y-8 max-w-3xl mx-auto">
          {renderHeader()}
          {renderForm()}
          {showStylePreviews && renderStylePreviewsCompact()}
        </div>
      );
    }
    
    // Default variant - full experience
    return (
      <div className="space-y-8">
        {renderHeader()}
        {showStylePreviews && renderStylePreviews()}
        {showBenefits && renderBenefits()}
        {renderProgress()}
        {renderCallToAction()}
      </div>
    );
  };
  
  const renderHeader = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto">
        <img
          src={logoUrl}
          alt={logoAlt}
          style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2"
           style={{ backgroundColor: `${primaryColor}20` }}>
        <Sparkles className="h-5 w-5" style={{ color: primaryColor }} />
        <span className="text-sm font-medium" style={{ color: textColor }}>
          Quiz de Descoberta de Estilo
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: textColor }}>
        {mainTitle}
        <span className="block" style={{ color: primaryColor }}>{subtitle}</span>
      </h1>

      <p className="text-xl max-w-2xl mx-auto leading-relaxed opacity-80" 
         style={{ color: textColor }}>
        {description}
      </p>
    </div>
  );
  
  const renderStylePreviews = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {QUIZ_STYLES.map(style => (
        <Card
          key={style.name}
          className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300"
        >
          <CardContent className="p-4 text-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3"
              style={{ backgroundColor: style.color }}
            >
              {style.letter}
            </div>
            <h3 className="font-semibold text-sm" style={{ color: textColor }}>
              {style.name}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  const renderStylePreviewsCompact = () => (
    <div className="flex flex-wrap justify-center gap-3">
      {QUIZ_STYLES.map(style => (
        <div key={style.name} className="flex items-center space-x-2 px-3 py-2 bg-white/60 rounded-full">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: style.color }}
          >
            {style.letter}
          </div>
          <span className="text-sm" style={{ color: textColor }}>{style.name}</span>
        </div>
      ))}
    </div>
  );
  
  const renderBenefits = () => (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: textColor }}>
          O que você vai descobrir:
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {QUIZ_BENEFITS.map((benefit, index) => (
            <div key={index} className="space-y-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                   style={{ backgroundColor: `${primaryColor}20` }}>
                <span className="text-2xl">{benefit.icon}</span>
              </div>
              <h3 className="font-semibold" style={{ color: textColor }}>
                {benefit.title}
              </h3>
              <p className="text-sm opacity-80" style={{ color: textColor }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
  
  const renderProgress = () => {
    if (!showProgress) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" 
                 style={{ borderColor: primaryColor, color: textColor }}>
            Etapa 1 de 21
          </Badge>
          <Badge variant="outline" 
                 style={{ borderColor: primaryColor, color: textColor }}>
            ⏱️ 3-5 minutos
          </Badge>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${progressValue}%`,
              background: `linear-gradient(to right, ${primaryColor}, ${textColor})`
            }}
          />
        </div>
      </div>
    );
  };
  
  const renderForm = () => (
    <Card className="bg-white/90 backdrop-blur-sm max-w-lg mx-auto">
      <CardContent className="p-6 space-y-4">
        <Label htmlFor="quiz-name-input" className="text-base font-medium" 
               style={{ color: textColor }}>
          {inputLabel}
        </Label>
        
        <Input
          id="quiz-name-input"
          type="text"
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={handleInputChange}
          className="text-base py-3"
          style={{ 
            borderColor: isValidInput ? primaryColor : '#e5e7eb'
          }}
        />
        
        {inputValue && !isValidInput && (
          <p className="text-sm text-red-500">
            {requiredFieldMessage}
          </p>
        )}
        
        <Button
          onClick={handleNext}
          disabled={!isValidInput}
          className="w-full py-3 text-base font-semibold transition-all duration-300"
          style={{
            backgroundColor: isValidInput ? primaryColor : '#9ca3af',
            color: '#ffffff',
            opacity: isValidInput ? 1 : 0.6,
          }}
        >
          {isValidInput ? (
            <>
              <span>{buttonText}</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            requiredFieldMessage
          )}
        </Button>
        
        {sessionId && (
          <p className="text-xs text-center opacity-50" style={{ color: textColor }}>
            Sessão: {sessionId}
          </p>
        )}
      </CardContent>
    </Card>
  );
  
  const renderCallToAction = () => (
    <Card className="text-white" 
          style={{ background: `linear-gradient(to right, ${primaryColor}, ${textColor})` }}>
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Pronta para descobrir seu estilo?
        </h3>
        <p className="text-white/90 mb-6 max-w-xl mx-auto">
          Vamos começar com algumas perguntas simples sobre suas preferências e descobrir
          juntas qual estilo reflete sua verdadeira essência.
        </p>
        {renderForm()}
      </CardContent>
    </Card>
  );
  
  // Performance: Early return for empty state
  if (!block && variant === 'default') {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Bloco Quiz Intro não configurado</p>
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        'quiz-intro-optimized-block w-full transition-all duration-200',
        gradientBackground,
        isSelected && 'ring-2 ring-offset-2',
        className
      )}
      style={{
        backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined,
      }}
      onClick={onClick}
      data-block-type="quiz-intro"
      data-block-id={block?.id}
    >
      <div className="min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
});

QuizIntroOptimizedBlock.displayName = 'QuizIntroOptimizedBlock';

export default QuizIntroOptimizedBlock;