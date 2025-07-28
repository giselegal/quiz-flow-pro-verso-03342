import React from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';

interface StyleResultBlockProps {
  content: EditableContent & {
    primaryStyle?: StyleResult;
    description?: string;
    customImage?: string;
    showSecondaryStyles?: boolean;
  };
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  onSelect?: () => void;
  className?: string;
}

export const StyleResultBlock: React.FC<StyleResultBlockProps> = ({
  content,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  // Mock data for preview
  const mockStyle: StyleResult = {
    category: "Natural",
    score: 85,
    percentage: 85
  };

  const primaryStyle = content.primaryStyle || mockStyle;
  const description = content.description || 'Seu estilo natural reflete uma personalidade autêntica e descomplicada. Você valoriza o conforto sem abrir mão da elegância.';

  const handleClick = () => {
    if (onSelect && !isEditing) {
      onSelect();
    }
  };

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
      <AnimatedWrapper animation="fade" show={true} duration={600} delay={300}>
        <Card className="p-6 md:p-8 mb-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-[#B89B7A]/20 rounded-xl">
          <div className="text-center mb-8">
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#8F7A6A]">
                  Seu estilo predominante
                </span>
                <span className="text-[#aa6b5d] font-medium">{primaryStyle.percentage}%</span>
              </div>
              <Progress 
                value={primaryStyle.percentage} 
                className="h-2 bg-[#F3E8E6]" 
                indicatorClassName="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]" 
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-4">
              {primaryStyle.category}
            </h2>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-[#432818] leading-relaxed">
                {description}
              </p>
              
              {content.showSecondaryStyles && (
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-[#B89B7A]/10 transition-all duration-200 hover:shadow-md">
                  <h3 className="text-lg font-medium text-[#432818] mb-2">
                    Estilos que Também Influenciam Você
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#432818]">Romântico</span>
                      <span className="text-sm font-semibold text-[#aa6b5d]">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#432818]">Clássico</span>
                      <span className="text-sm font-semibold text-[#aa6b5d]">12%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {content.customImage && (
              <div className="max-w-[280px] mx-auto relative order-first md:order-last">
                <img 
                  src={content.customImage} 
                  alt={`Estilo ${primaryStyle.category}`} 
                  className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300" 
                  loading="eager" 
                  width="280" 
                  height="auto"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
              </div>
            )}
          </div>
        </Card>
      </AnimatedWrapper>

      {isSelected && isEditing && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-bl">
          Editando Resultado de Estilo
        </div>
      )}
    </div>
  );
};

export default StyleResultBlock;
