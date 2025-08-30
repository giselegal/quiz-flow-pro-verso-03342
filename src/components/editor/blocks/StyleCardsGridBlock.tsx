import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';
import { useQuizResult } from '@/hooks/useQuizResult';

interface StyleCardsGridBlockProps {
  block?: {
    id: string;
    type: string;
    properties?: {
      className?: string;
      backgroundColor?: string;
      // Configurações JSON exportáveis
      styleCardsConfig?: {
        styles: Array<{
          name: string;
          color: string;
          letter: string;
          description?: string;
          icon?: string;
        }>;
        layout: {
          columns: number;
          gap: string;
          cardSize: 'sm' | 'md' | 'lg';
          showLetters: boolean;
          showDescriptions: boolean;
          animationType: 'none' | 'hover' | 'pulse' | 'glow';
        };
        theme: {
          cardBackground: string;
          cardBorder: string;
          textColor: string;
          letterTextColor: string;
          hoverEffect: string;
        };
        interactive: boolean;
        selectable: boolean;
        maxSelections?: number;
      };
    };
    content?: any;
  };
  onPropertyChange?: (key: string, value: any) => void;
  onStyleSelect?: (styleId: string) => void;
}

/**
 * 🎯 STYLE CARDS GRID BLOCK
 * ✅ Cards interativos dos 8 estilos
 * ✅ Configuração JSON exportável
 * ✅ Compatível com editor de blocos
 */
const StyleCardsGridBlock: React.FC<StyleCardsGridBlockProps> = ({
  block,
  onPropertyChange,
  onStyleSelect,
}) => {
  const properties = block?.properties || {};
  const {
    className = '',
    backgroundColor = 'transparent',
    styleCardsConfig,
    // Propriedades NO-CODE planas vindas do core registry
    columns,
    gap,
    showLetters,
    showDescriptions,
    interactive,
    selectable,
    maxSelections,
    animationType,
    cardSize,
  themePreset,
  } = properties as any;
  const { primaryStyle, secondaryStyles } = useQuizResult();

  // Configuração padrão com os 8 estilos
  const config = styleCardsConfig || {
    styles: [
      { name: 'Natural', color: '#8B7355', letter: 'A', description: 'Conforto e praticidade' },
      { name: 'Clássico', color: '#432818', letter: 'B', description: 'Elegância atemporal' },
      { name: 'Contemporâneo', color: '#6B4F43', letter: 'C', description: 'Moderno e atual' },
      { name: 'Elegante', color: '#B89B7A', letter: 'D', description: 'Sofisticação refinada' },
      { name: 'Romântico', color: '#D4B5A0', letter: 'E', description: 'Delicadeza feminina' },
      { name: 'Sexy', color: '#8B4513', letter: 'F', description: 'Sensualidade marcante' },
      { name: 'Dramático', color: '#654321', letter: 'G', description: 'Impacto visual forte' },
      { name: 'Criativo', color: '#A0522D', letter: 'H', description: 'Originalidade única' },
    ],
    layout: {
      columns: typeof columns === 'number' ? columns : 2,
      gap: typeof gap === 'string' ? gap : 'gap-6',
      cardSize: (cardSize as 'sm' | 'md' | 'lg') || ('md' as const),
      showLetters: typeof showLetters === 'boolean' ? showLetters : true,
      showDescriptions: typeof showDescriptions === 'boolean' ? showDescriptions : false,
      animationType: (animationType as 'none' | 'hover' | 'pulse' | 'glow') || ('hover' as const),
    },
    theme: (() => {
      const preset = (themePreset as 'glass' | 'light' | 'solid') || 'glass';
      if (preset === 'light') {
        return {
          cardBackground: '#ffffff',
          cardBorder: 'rgba(0,0,0,0.06)',
          textColor: '#432818',
          letterTextColor: '#ffffff',
          hoverEffect: 'hover:shadow-md hover:-translate-y-0.5 transition',
        } as const;
      }
      if (preset === 'solid') {
        return {
          cardBackground: '#FAF9F7',
          cardBorder: 'rgba(0,0,0,0.08)',
          textColor: '#432818',
          letterTextColor: '#ffffff',
          hoverEffect: 'hover:shadow-lg hover:-translate-y-1 transition',
        } as const;
      }
      // glass (default)
      return {
        cardBackground: 'rgba(255, 255, 255, 0.6)',
        cardBorder: 'rgba(255, 255, 255, 0.2)',
        textColor: '#432818',
        letterTextColor: '#ffffff',
        hoverEffect: 'hover:shadow-lg hover:scale-105',
      } as const;
    })(),
    interactive: typeof interactive === 'boolean' ? interactive : true,
    selectable: typeof selectable === 'boolean' ? selectable : false,
  };

  const [selectedStyles, setSelectedStyles] = React.useState<string[]>([]);

  // Mapear porcentagens do resultado para destacar cards
  const resultPercentages: Record<string, number> = React.useMemo(() => {
    const map: Record<string, number> = {};
    if (primaryStyle?.style) {
      map[(primaryStyle.style || primaryStyle.category || '').toLowerCase()] =
        (primaryStyle as any).percentage ?? 0;
    }
    secondaryStyles.forEach(s => {
      if (s.style || (s as any).category) {
        map[(s.style || (s as any).category || '').toLowerCase()] = (s as any).percentage ?? 0;
      }
    });
    return map;
  }, [primaryStyle, secondaryStyles]);

  const handleStyleClick = (style: (typeof config.styles)[0]) => {
    if (!config.interactive) return;

    const styleId = style.name.toLowerCase();

    if (config.selectable) {
      let newSelection = [...selectedStyles];

      if (selectedStyles.includes(styleId)) {
        newSelection = newSelection.filter(id => id !== styleId);
      } else {
        if ((maxSelections ?? config.maxSelections) && newSelection.length >= (maxSelections ?? config.maxSelections)) {
          newSelection = [styleId]; // Substituir se atingir o máximo
        } else {
          newSelection.push(styleId);
        }
      }

      setSelectedStyles(newSelection);

      if (onPropertyChange) {
        onPropertyChange('selectedStyles', newSelection);
      }
    }

    if (onStyleSelect) {
      onStyleSelect(styleId);
    }

    console.log('🎨 Estilo selecionado:', style.name);
  };

  const getCardSizeClass = () => {
    switch (config.layout.cardSize) {
      case 'sm':
        return 'h-20 w-20';
      case 'lg':
        return 'h-32 w-32';
      default:
        return 'h-24 w-24';
    }
  };

  const getColumnsClass = () => {
    const cols = Math.max(1, Math.min(config.layout.columns ?? 2, 2));
    return cols === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-2';
  };

  const getAnimationClass = () => {
    switch (config.layout.animationType) {
      case 'pulse':
        return 'hover:animate-pulse';
      case 'glow':
        return 'hover:shadow-2xl hover:shadow-current/20';
      case 'hover':
        return 'transition-all duration-300 hover:scale-105';
      default:
        return '';
    }
  };

  return (
    <div className={cn('style-cards-grid-block', className)} style={{ backgroundColor }}>
      <div className={cn('grid', getColumnsClass(), config.layout.gap)}>
        {config.styles.map((style: { name: string; color: string; letter: string; description?: string }, index: number) => {
          const key = style.name.toLowerCase();
          const isSelected = selectedStyles.includes(key);
          const resultPct = resultPercentages[key];

          return (
            <Card
              key={index}
              className={cn(
                'cursor-pointer transition-all duration-300',
                config.theme.hoverEffect,
                getAnimationClass(),
                (isSelected || typeof resultPct === 'number') && 'ring-2 ring-offset-2',
                config.interactive ? 'hover:shadow-lg' : 'cursor-default'
              )}
              style={
                {
                  backgroundColor: config.theme.cardBackground,
                  borderColor: config.theme.cardBorder,
                  '--ring-color': style.color,
                } as React.CSSProperties
              }
              onClick={() => handleStyleClick(style)}
            >
              <CardContent className="p-4 text-center flex flex-col items-center justify-center">
                {config.layout.showLetters && (
                  <div
                    className={cn(
                      'rounded-full flex items-center justify-center text-white font-bold text-sm mb-3',
                      getCardSizeClass()
                    )}
                    style={{ backgroundColor: style.color }}
                  >
                    {style.letter}
                  </div>
                )}

                <h3
                  className="font-semibold text-sm mb-1"
                  style={{ color: config.theme.textColor }}
                >
                  {style.name}
                </h3>

                {config.layout.showDescriptions && style.description && (
                  <p className="text-xs text-gray-600 text-center">{style.description}</p>
                )}

                {(isSelected || typeof resultPct === 'number') && (
                  <Badge
                    variant="secondary"
                    className="mt-2 text-xs"
                    style={{ backgroundColor: style.color, color: 'white' }}
                  >
                    {typeof resultPct === 'number' ? `${Math.round(resultPct)}%` : 'Selecionado'}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500">
          <details>
            <summary>Style Cards Config (Debug)</summary>
            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded max-h-40 overflow-auto">
              {JSON.stringify(config, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default StyleCardsGridBlock;

// ✅ CONFIGURAÇÃO JSON EXPORTÁVEL
export const getStyleCardsGridConfig = (customConfig?: Partial<any>) => ({
  id: `style-cards-grid-${Date.now()}`,
  type: 'style-cards-grid',
  properties: {
    styleCardsConfig: {
      styles: [
        { name: 'Natural', color: '#8B7355', letter: 'A', description: 'Conforto e praticidade' },
        { name: 'Clássico', color: '#432818', letter: 'B', description: 'Elegância atemporal' },
        { name: 'Contemporâneo', color: '#6B4F43', letter: 'C', description: 'Moderno e atual' },
        { name: 'Elegante', color: '#B89B7A', letter: 'D', description: 'Sofisticação refinada' },
        { name: 'Romântico', color: '#D4B5A0', letter: 'E', description: 'Delicadeza feminina' },
        { name: 'Sexy', color: '#8B4513', letter: 'F', description: 'Sensualidade marcante' },
        { name: 'Dramático', color: '#654321', letter: 'G', description: 'Impacto visual forte' },
        { name: 'Criativo', color: '#A0522D', letter: 'H', description: 'Originalidade única' },
      ],
      layout: {
        columns: 4,
        gap: 'gap-6',
        cardSize: 'md' as const,
        showLetters: true,
        showDescriptions: false,
        animationType: 'hover' as const,
      },
      theme: {
        cardBackground: 'rgba(255, 255, 255, 0.6)',
        cardBorder: 'rgba(255, 255, 255, 0.2)',
        textColor: '#432818',
        letterTextColor: '#ffffff',
        hoverEffect: 'hover:shadow-lg hover:scale-105',
      },
      interactive: true,
      selectable: false,
      ...customConfig,
    },
    className: 'w-full',
    backgroundColor: 'transparent',
  },
});
