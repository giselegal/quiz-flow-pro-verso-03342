// @ts-nocheck
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Award, Star, CheckCircle, ArrowRight } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * ModernResultPageBlock - Componente de página de resultado moderna (Etapa 20)
 * Visualização: Canvas responsivo
 * Edição: Painel de propriedades (lado direito)
 */

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

const ModernResultPageBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const {
    title = 'Parabéns! Descobrimos seu estilo',
    subtitle = 'Aqui está seu resultado personalizado',
    resultStyle = 'Elegante',
    description = 'Você tem um estilo único que combina elegância com modernidade...',
    imageUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
    guideImageUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
    percentage = 85,
    showSecondaryStyles = true,
    backgroundColor = 'bg-gradient-to-br from-[#fffaf7] to-[#f9f4ef]',
    padding = 'large',
  } = block?.properties || {};

  // Get username from context (placeholder)
  const username = 'Usuário';

  // Classes de padding
  const paddingClasses = {
    none: 'p-0',
    small: 'p-4 sm:p-6',
    medium: 'p-6 sm:p-8 lg:p-12',
    large: 'p-8 sm:p-12 lg:p-16',
  };

  return (
    <div
      className={cn(
        // Layout responsivo base
        'w-full h-full min-h-screen flex flex-col',
        // Background
        backgroundColor || 'bg-gradient-to-br from-[#fffaf7] to-[#f9f4ef]',
        // Padding responsivo
        paddingClasses[padding as keyof typeof paddingClasses] || paddingClasses.large,
        // Estados visuais
        'transition-all duration-200',
        isSelected && 'ring-2 ring-[#B89B7A]',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      {/* Container principal responsivo */}
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#432818] mb-4">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-[#5D4A3A] max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Resultado Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Card do Resultado */}
          <Card className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm border-[#B89B7A]/20 shadow-xl">
            <div className="text-center space-y-6">
              {/* Ícone e Porcentagem */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-[#B89B7A] to-[#A1835D] rounded-full flex items-center justify-center">
                  <Award className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#432818] text-white px-3 py-1 rounded-full text-sm font-bold">
                    {percentage}%
                  </div>
                </div>
              </div>

              {/* Estilo Resultado */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#432818] mb-2">
                  Estilo {resultStyle}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#B89B7A] to-[#A1835D] mx-auto rounded-full"></div>
              </div>

              {/* Barra de Progresso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[#5D4A3A]">
                  <span>Compatibilidade</span>
                  <span>{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-3" />
              </div>

              {/* Estrelas */}
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={cn(
                      'w-6 h-6',
                      star <= Math.floor(percentage / 20)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Imagem do Resultado */}
          <div className="relative">
            <div className="aspect-square sm:aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={imageUrl}
                alt={`Estilo ${resultStyle}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Badge flutuante */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-[#432818]">Seu Estilo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <Card className="p-6 sm:p-8 bg-white/60 backdrop-blur-sm border-[#B89B7A]/20 mb-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-[#432818] mb-4">Sobre Seu Estilo</h3>
            <p className="text-base sm:text-lg text-[#5D4A3A] leading-relaxed max-w-4xl mx-auto">
              {description}
            </p>
          </div>
        </Card>

        {/* Guia de Estilo (se habilitado) */}
        {showSecondaryStyles && guideImageUrl && (
          <Card className="p-6 sm:p-8 bg-white/60 backdrop-blur-sm border-[#B89B7A]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#432818] mb-4">
                  Seu Guia de Estilo Personalizado
                </h3>
                <p className="text-[#5D4A3A] mb-6">
                  Descubra todas as peças que combinam perfeitamente com seu estilo único.
                </p>

                {/* CTA */}
                <button className="inline-flex items-center space-x-2 bg-[#432818] hover:bg-[#5a3520] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  <span>Ver Guia Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <img
                  src={guideImageUrl}
                  alt="Guia de Estilo"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ModernResultPageBlock;
