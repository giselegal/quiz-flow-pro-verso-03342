import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { InlineEditText } from "@/types/blocks"
import { LucideIcon } from 'lucide-react';
import { getLucideIcon } from '@/utils/iconMap';

export interface PainPoint {
  icon: LucideIcon | string; // Suporte para ícone como componente ou string
  title: string;
  description: string;
}

export interface FunnelPainSectionProps {
  // Content props
  title: string;
  subtitle?: string;
  description?: string;
  painPoints: PainPoint[];
  conclusion?: string;
  
  // Visual props
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  cardBorderColor?: string;
  
  // Layout props
  columns?: 1 | 2 | 3 | 4;
  
  // Behavior props
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
  
  // Editor props
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * FunnelPainSection - Componente reutilizável para seções de problemas/dores
 * 
 * Este componente é usado tanto no editor quanto no funil real
 * para mostrar pain points e criar conexão emocional.
 * 
 * Features:
 * - Grid responsivo configurável
 * - Suporte a edição inline
 * - Cards com ícones personalizáveis
 * - Paleta de cores da marca
 * - Conclusão persuasiva
 */
const FunnelPainSection: React.FC<FunnelPainSectionProps> = ({
  title,
  subtitle,
  description,
  painPoints,
  conclusion,
  backgroundColor = '#ffffff',
  textColor = '#432818',
  primaryColor = '#B89B7A',
  cardBorderColor = 'rgba(184, 155, 122, 0.2)',
  columns = 4,
  isEditable = false,
  onPropertyChange,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const handlePainPointChange = (index: number, field: string, value: string) => {
    if (!onPropertyChange) return;
    
    const updatedPainPoints = [...painPoints];
    updatedPainPoints[index] = {
      ...updatedPainPoints[index],
      [field]: value
    };
    onPropertyChange('painPoints', updatedPainPoints);
  };

  const renderEditableText = (value: string, key: string, className: string, placeholder: string, as?: any) => {
    if (isEditable) {
      return (
        <InlineEditText
          value={value}
          onSave={(newValue: string) => handlePropertyChange(key, newValue)}
          className={className}
          placeholder={placeholder}
          as={as}
        />
      );
    }
    
    if (as === 'h2') {
      return <h2 className={className}>{value}</h2>;
    }
    if (as === 'p') {
      return <p className={className}>{value}</p>;
    }
    return <div className={className}>{value}</div>;
  };

  const getGridClasses = () => {
    const baseClasses = 'grid gap-6';
    switch (columns) {
      case 1:
        return `${baseClasses} grid-cols-1`;
      case 2:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`;
      case 3:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3`;
      case 4:
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-4`;
    }
  };

  return (
    <section 
      className={cn(
        'py-12 md:py-16 px-4 md:px-8 transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
      style={{ 
        backgroundColor,
        color: textColor
      }}
      onClick={onClick}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {renderEditableText(
            title,
            'title',
            'text-2xl md:text-3xl font-playfair mb-6',
            'Título da seção...',
            'h2'
          )}
          
          {subtitle && renderEditableText(
            subtitle,
            'subtitle',
            'text-lg max-w-4xl mx-auto opacity-80',
            'Subtítulo explicativo...',
            'p'
          )}

          {description && renderEditableText(
            description,
            'description',
            'text-base max-w-4xl mx-auto mt-4 opacity-70',
            'Descrição adicional...',
            'p'
          )}
        </div>

        {/* Pain Points Grid */}
        <div className={getGridClasses()}>
          {painPoints.map((point, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300 rounded-lg"
              style={{ borderColor: cardBorderColor }}
            >
              <CardContent className="p-6 text-center flex flex-col items-center">
                {typeof point.icon === 'string' ? (
                  // Renderiza o ícone usando o sistema de iconMap
                  React.createElement(getLucideIcon(point.icon), {
                    className: 'w-8 h-8 mb-4',
                    style: { color: primaryColor }
                  })
                ) : (
                  // Suporte para ícone como componente
                  <point.icon 
                    className="w-8 h-8 mb-4" 
                    style={{ color: primaryColor }}
                  />
                )}
                
                {isEditable ? (
                  <div className="space-y-2 w-full">
                    <InlineEditText
                      value={point.title}
                      onSave={(value: string) => handlePainPointChange(index, 'title', value)}
                      className="text-base md:text-lg font-semibold mb-2 mt-4"
                      placeholder="Título do problema"
                      as="h3"
                    />
                    <InlineEditText
                      value={point.description}
                      onSave={(value: string) => handlePainPointChange(index, 'description', value)}
                      className="text-sm opacity-80"
                      placeholder="Descrição do problema"
                      multiline
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-base md:text-lg font-semibold mb-2 mt-4">
                      {point.title}
                    </h3>
                    <p className="text-sm opacity-80">
                      {point.description}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conclusion */}
        {conclusion && (
          <div className="text-center mt-12">
            {renderEditableText(
              conclusion,
              'conclusion',
              'text-lg italic max-w-4xl mx-auto opacity-90',
              'Conclusão persuasiva...',
              'p'
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FunnelPainSection;
