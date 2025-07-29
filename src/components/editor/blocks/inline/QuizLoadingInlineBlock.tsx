import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Loader, Brain, Sparkles, Zap, Target, BarChart3 } from 'lucide-react';

interface QuizLoadingInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de carregamento
}

/**
 * Componente inline para carregamento do quiz (Etapa 5)
 * Tela de carregamento com animações e mensagens dinâmicas
 */
export const QuizLoadingInlineBlock: React.FC<QuizLoadingInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const {
    properties,
    handlePropertyChange,
    commonProps
  } = useInlineBlock({
    block,
    isSelected,
    onClick,
    onPropertyChange,
    className
  });

  const title = properties.title || 'Analisando suas respostas...';
  const messages = properties.messages || [
    'Processando suas preferências...',
    'Analisando padrões de comportamento...',
    'Gerando recomendações personalizadas...',
    'Preparando seus resultados...'
  ];
  const loadingDuration = properties.loadingDuration || 4; // segundos
  const showProgress = properties.showProgress || true;
  const animationType = properties.animationType || 'spinner'; // spinner, pulse, bounce, bars
  const theme = properties.theme || 'blue';
  const showIcon = properties.showIcon || true;
  const iconType = properties.iconType || 'brain'; // brain, sparkles, zap, target, chart

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  // Simulação de carregamento
  useEffect(() => {
    if (!isEditMode) {
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / (loadingDuration * 10));
        });
      }, 100);

      const messageInterval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % messages.length);
      }, (loadingDuration * 1000) / messages.length);

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    }
  }, [isEditMode, loadingDuration, messages.length]);

  const getAnimationIcon = () => {
    const icons = {
      brain: Brain,
      sparkles: Sparkles,
      zap: Zap,
      target: Target,
      chart: BarChart3
    };
    const IconComponent = icons[iconType as keyof typeof icons] || Brain;
    return <IconComponent className="w-12 h-12" />;
  };

  const getLoadingAnimation = () => {
    switch (animationType) {
      case 'spinner':
        return <Loader className="w-8 h-8 animate-spin" />;
      case 'pulse':
        return <div className="w-8 h-8 bg-current rounded-full animate-pulse" />;
      case 'bounce':
        return <div className="w-8 h-8 bg-current rounded-full animate-bounce" />;
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-8 bg-current rounded animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      default:
        return <Loader className="w-8 h-8 animate-spin" />;
    }
  };

  const getThemeClasses = () => {
    const themes = {
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        progress: 'bg-blue-500',
        icon: 'text-blue-500'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        progress: 'bg-purple-500',
        icon: 'text-purple-500'
      },
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        progress: 'bg-green-500',
        icon: 'text-green-500'
      },
      orange: {
        bg: 'from-orange-50 to-amber-50',
        border: 'border-orange-200',
        accent: 'text-orange-600',
        progress: 'bg-orange-500',
        icon: 'text-orange-500'
      }
    };
    return themes[theme as keyof typeof themes] || themes.blue;
  };

  const themeClasses = getThemeClasses();

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[400px] p-8',
        `bg-gradient-to-br ${themeClasses.bg}`,
        `border ${themeClasses.border} rounded-lg`,
        'transition-all duration-300',
        'flex flex-col items-center justify-center text-center',
        isSelected && `ring-2 ring-${theme}-500`,
        className
      )}
    >
      {/* Botão de Edição */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              toggleEditMode();
            }}
          >
            {isEditMode ? 'Salvar' : 'Editar'}
          </Button>
        </div>
      )}

      {/* Ícone Principal */}
      {showIcon && (
        <div className={cn(
          'mb-8 p-6 rounded-full bg-white/80 shadow-lg',
          'animate-pulse',
          themeClasses.icon
        )}>
          {getAnimationIcon()}
        </div>
      )}

      {/* Título */}
      <div className="mb-8">
        {isEditMode ? (
          <input
            type="text"
            value={title}
            onChange={(e) => handlePropertyChange('title', e.target.value)}
            placeholder="Título do carregamento"
            className="w-full text-2xl font-bold text-center p-2 border border-gray-300 rounded"
          />
        ) : (
          <h1 className={cn('text-2xl font-bold mb-4', themeClasses.accent)}>
            {title}
          </h1>
        )}
      </div>

      {/* Animação de Carregamento */}
      <div className={cn('mb-8', themeClasses.icon)}>
        {getLoadingAnimation()}
      </div>

      {/* Mensagem Dinâmica */}
      {!isEditMode && (
        <div className="mb-8 h-12 flex items-center">
          <p className="text-gray-600 text-lg font-medium transition-all duration-300">
            {messages[currentMessageIndex]}
          </p>
        </div>
      )}

      {/* Barra de Progresso */}
      {showProgress && !isEditMode && (
        <div className="w-full max-w-sm mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{Math.round(loadingProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300 ease-out',
                themeClasses.progress
              )}
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Informação Adicional */}
      {!isEditMode && (
        <div className="text-sm text-gray-500 max-w-md">
          <p>
            Este processo leva apenas alguns segundos. Estamos criando uma experiência 
            personalizada baseada nas suas respostas.
          </p>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 w-full max-w-lg space-y-4">
          {/* Configurações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração (segundos)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={loadingDuration}
                onChange={(e) => handlePropertyChange('loadingDuration', parseInt(e.target.value) || 4)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Mensagens de Carregamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagens de Carregamento
            </label>
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                      const newMessages = [...messages];
                      newMessages[index] = e.target.value;
                      handlePropertyChange('messages', newMessages);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder={`Mensagem ${index + 1}`}
                  />
                  {messages.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newMessages = messages.filter((_, i) => i !== index);
                        handlePropertyChange('messages', newMessages);
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newMessages = [...messages, 'Nova mensagem...'];
                  handlePropertyChange('messages', newMessages);
                }}
                className="w-full border-dashed"
              >
                + Adicionar Mensagem
              </Button>
            </div>
          </div>

          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showProgress ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showProgress', !showProgress)}
            >
              Mostrar Progresso
            </Badge>
            
            <Badge
              variant={showIcon ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showIcon', !showIcon)}
            >
              Mostrar Ícone
            </Badge>
          </div>

          {/* Seletor de Animação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Animação
            </label>
            <div className="flex gap-2">
              {['spinner', 'pulse', 'bounce', 'bars'].map((animation) => (
                <Badge
                  key={animation}
                  variant={animationType === animation ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('animationType', animation)}
                >
                  {animation}
                </Badge>
              ))}
            </div>
          </div>

          {/* Seletor de Ícone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Ícone
            </label>
            <div className="flex gap-2">
              {['brain', 'sparkles', 'zap', 'target', 'chart'].map((icon) => (
                <Badge
                  key={icon}
                  variant={iconType === icon ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('iconType', icon)}
                >
                  {icon}
                </Badge>
              ))}
            </div>
          </div>

          {/* Seletor de Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema de Cores
            </label>
            <div className="flex gap-2">
              {['blue', 'purple', 'green', 'orange'].map((colorTheme) => (
                <Badge
                  key={colorTheme}
                  variant={theme === colorTheme ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('theme', colorTheme)}
                >
                  {colorTheme}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizLoadingInlineBlock;
