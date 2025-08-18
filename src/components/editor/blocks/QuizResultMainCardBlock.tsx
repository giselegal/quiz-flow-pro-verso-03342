// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Crown, Star, Award, CheckCircle } from 'lucide-react';
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

const QuizResultMainCardBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    primaryStyle = 'elegante',
    showStyleImage = true,
    showCharacteristics = true,
    accentColor = '#B89B7A',
    textColor = '#432818',
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
      image:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911574/ELEGANTE_PREDOMINANTE_awmgit.webp',
      description: 'Seu estilo reflete sofisticação e refinamento em cada detalhe.',
      characteristics: [
        'Peças estruturadas e bem cortadas',
        'Cores neutras e sóbrias',
        'Acessórios refinados',
        'Tecidos nobres e de qualidade',
      ],
      icon: Crown,
    },
    natural: {
      name: 'Natural',
      image:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911575/NATURAL_PREDOMINANTE_baqkts.webp',
      description: 'Você valoriza o conforto e a autenticidade acima de tudo.',
      characteristics: [
        'Conforto em primeiro lugar',
        'Tecidos naturais e respiráveis',
        'Cores terrosas e suaves',
        'Silhuetas relaxadas',
      ],
      icon: Star,
    },
    contemporaneo: {
      name: 'Contemporâneo',
      image:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911573/CONTEMPORANEO_PREDOMINANTE_xllhxm.webp',
      description: 'Você está sempre em sintonia com as tendências atuais.',
      characteristics: [
        'Tendências da moda atual',
        'Mix de texturas modernas',
        'Cores em alta',
        'Peças statement',
      ],
      icon: Award,
    },
  };

  const currentStyle =
    styleConfig[primaryStyle as keyof typeof styleConfig] || styleConfig.elegante;
  const Icon = currentStyle.icon;

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
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl border-0" style={{ borderColor: accentColor }}>
            <CardHeader
              className="text-center pb-4"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <div className="flex items-center justify-center mb-4">
                <Icon className="w-12 h-12 mr-3" style={{ color: accentColor }} />
                <h2 className="text-3xl md:text-4xl font-bold" style={{ color: textColor }}>
                  Estilo {currentStyle.name}
                </h2>
              </div>
              <p style={{ color: '#6B4F43' }}>{currentStyle.description}</p>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {showStyleImage && (
                  <div className="order-2 md:order-1">
                    <img
                      src={currentStyle.image}
                      alt={`Estilo ${currentStyle.name}`}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {showCharacteristics && (
                  <div className="order-1 md:order-2">
                    <h3 className="text-2xl font-semibold mb-6" style={{ color: textColor }}>
                      Suas Características
                    </h3>
                    <div className="space-y-4">
                      {currentStyle.characteristics.map((characteristic, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle
                            className="w-6 h-6 mt-0.5 flex-shrink-0"
                            style={{ color: accentColor }}
                          />
                          <span style={{ color: '#6B4F43' }}>{characteristic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizResultMainCardBlock;
