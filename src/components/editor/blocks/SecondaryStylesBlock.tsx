import React, { useState, useEffect } from 'react';
import { Crown, Star, Award, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { cn } from '@/lib/utils';

interface SecondaryStylesBlockProps {
  content?: {
    title?: string;
    subtitle?: string;
    primaryStyle?: string;
    secondaryStyles?: Array<{
      name: string;
      percentage: number;
      description?: string;
      icon?: any;
    }>;
    accentColor?: string;
    textColor?: string;
    maxStyles?: number;
  };
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  onSelect?: () => void;
  className?: string;
}

export const SecondaryStylesBlock: React.FC<SecondaryStylesBlockProps> = ({
  content = {},
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  const {
    title = 'Seus Estilos Secundários',
    subtitle = 'Estes estilos complementam seu estilo predominante',
    primaryStyle = 'elegante',
    accentColor = '#B89B7A',
    textColor = '#432818',
    maxStyles = 3
  } = content;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleClick = () => {
    if (onSelect && !isEditing) {
      onSelect();
    }
  };

  // Configuração dos estilos com dados mock
  const styleConfig = {
    elegante: {
      name: 'Elegante',
      description: 'Sofisticação e refinamento em cada detalhe.',
      icon: Crown,
      percentage: 15
    },
    natural: {
      name: 'Natural',
      description: 'Conforto e autenticidade acima de tudo.',
      icon: Star,
      percentage: 12
    },
    contemporaneo: {
      name: 'Contemporâneo',
      description: 'Sempre em sintonia com as tendências atuais.',
      icon: Sparkles,
      percentage: 8
    },
    classico: {
      name: 'Clássico',
      description: 'Elegância atemporal que nunca sai de moda.',
      icon: Award,
      percentage: 10
    }
  };

  // Usar estilos secundários do content ou dados mock
  const secondaryStyles = content.secondaryStyles || 
    Object.entries(styleConfig)
      .filter(([key]) => key !== primaryStyle)
      .slice(0, maxStyles)
      .map(([key, config]) => ({
        name: config.name,
        percentage: config.percentage,
        description: config.description,
        icon: config.icon
      }));

  return (
    <div
      className={cn(
        'w-full',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        isEditing && 'cursor-text',
        !isEditing && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      <AnimatedWrapper animation="fade" show={isLoaded} duration={600} delay={200}>
        <Card className="p-6 md:p-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-[#B89B7A]/20 rounded-xl">
          <CardHeader className="text-center pb-6">
            <h3 className="text-xl md:text-2xl font-playfair mb-2" style={{ color: accentColor }}>
              {title}
            </h3>
            <p className="text-sm md:text-base opacity-80" style={{ color: textColor }}>
              {subtitle}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {secondaryStyles.map((style, index) => {
              const IconComponent = style.icon || Star;
              
              return (
                <AnimatedWrapper 
                  key={index} 
                  animation="fade" 
                  show={isLoaded} 
                  duration={400} 
                  delay={300 + (index * 100)}
                >
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-[#F9F6F3] to-[#FFF7F3] border border-[#B89B7A]/10 hover:shadow-md transition-all duration-200">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <IconComponent 
                        className="w-6 h-6" 
                        style={{ color: accentColor }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium" style={{ color: textColor }}>
                          {style.name}
                        </h4>
                        <span 
                          className="text-sm font-semibold"
                          style={{ color: accentColor }}
                        >
                          {style.percentage}%
                        </span>
                      </div>
                      
                      {style.description && (
                        <p className="text-sm opacity-70" style={{ color: textColor }}>
                          {style.description}
                        </p>
                      )}
                    </div>
                  </div>
                </AnimatedWrapper>
              );
            })}
          </CardContent>
        </Card>
      </AnimatedWrapper>

      {isSelected && isEditing && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-bl">
          Editando Estilos Secundários
        </div>
      )}
    </div>
  );
};

export default SecondaryStylesBlock;
