// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Crown, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import type { BlockComponentProps } from '@/types/blocks';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const QuizResultSecondaryStylesBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    primaryStyle = 'elegante',
    title = 'Seus Estilos Secundários',
    subtitle = 'Estes estilos complementam seu estilo predominante',
    accentColor = '#B89B7A',
    textColor = '#432818',
    maxStyles = 3,
  } = block?.properties || {};

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Configuração dos estilos
  const styleConfig = {
    elegante: {
      name: 'Elegante',
      description: 'Sofisticação e refinamento em cada detalhe.',
      icon: Crown,
    },
    natural: {
      name: 'Natural',
      description: 'Conforto e autenticidade acima de tudo.',
      icon: Star,
    },
    contemporaneo: {
      name: 'Contemporâneo',
      description: 'Sempre em sintonia com as tendências atuais.',
      icon: Award,
    },
    classico: {
      name: 'Clássico',
      description: 'Atemporalidade e elegância tradicional.',
      icon: Crown,
    },
    romantico: {
      name: 'Romântico',
      description: 'Feminilidade e delicadeza em cada look.',
      icon: Star,
    },
    sexy: {
      name: 'Sexy',
      description: 'Sensualidade e confiança marcantes.',
      icon: Award,
    },
  };

  const secondaryStyles = Object.entries(styleConfig)
    .filter(([key]) => key !== primaryStyle)
    .slice(0, maxStyles);

  return (
    <div
      className={`
        w-full py-8 px-4 transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <h3 className="text-2xl font-semibold text-center" style={{ color: textColor }}>
                {title}
              </h3>
              <p style={{ color: '#6B4F43' }}>{subtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {secondaryStyles.map(([key, style]) => {
                  const SecondaryIcon = style.icon;
                  return (
                    <div key={key} style={{ backgroundColor: '#FAF9F7' }}>
                      <SecondaryIcon
                        className="w-8 h-8 mx-auto mb-3"
                        style={{ color: accentColor }}
                      />
                      <h4 className="font-semibold mb-2" style={{ color: textColor }}>
                        {style.name}
                      </h4>
                      <p style={{ color: '#6B4F43' }}>{style.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizResultSecondaryStylesBlock;
