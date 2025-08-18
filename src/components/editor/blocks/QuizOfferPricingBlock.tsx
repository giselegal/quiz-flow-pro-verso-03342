// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle, Sparkles, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const QuizOfferPricingBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    installmentPrice = 'R$ 8,83',
    fullPrice = 'R$ 39,90',
    originalPrice = 'R$ 175,00',
    savings = '77% OFF - Economia de R$ 135,10',
    ctaText = 'QUERO DESCOBRIR MEU ESTILO AGORA',
    ctaUrl = '#checkout',
    accentColor = '#B89B7A',
    textColor = '#432818',
    showGuarantee = true,
    benefits = [
      'Identifique seu estilo predominante em minutos',
      'Guia completo personalizado para seu perfil',
      'Dicas exclusivas de combinações',
      'Acesso a comunidade VIP',
      'Garantia de 7 dias',
      'Suporte especializado',
    ],
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

  return (
    <div
      className={`
        w-full py-16 px-4 transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader
              className="text-center py-8"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white shadow-sm">
                <Gift className="w-5 h-5" style={{ color: accentColor }} />
                <span className="font-semibold" style={{ color: textColor }}>
                  Oferta por tempo limitado
                </span>
              </div>

              <div className="space-y-2">
                <div style={{ color: '#6B4F43' }}>12x de apenas</div>
                <div className="text-4xl md:text-5xl font-bold" style={{ color: accentColor }}>
                  {installmentPrice}
                </div>
                <div className="text-2xl font-semibold" style={{ color: textColor }}>
                  ou {fullPrice} à vista
                </div>
                <div style={{ color: '#8B7355' }}>De {originalPrice}</div>
                <div className="text-xl font-bold text-green-600">{savings}</div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Benefits */}
                <div>
                  <h3 className="text-2xl font-semibold mb-6" style={{ color: textColor }}>
                    O que você vai receber:
                  </h3>
                  <div className="space-y-4">
                    {benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle
                          className="w-6 h-6 mt-0.5 flex-shrink-0"
                          style={{ color: accentColor }}
                        />
                        <span style={{ color: '#6B4F43' }}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col justify-center">
                  <Button
                    size="lg"
                    className="w-full py-6 text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300 mb-6"
                    style={{
                      backgroundColor: accentColor,
                      color: 'white',
                      border: 'none',
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      if (ctaUrl.startsWith('#')) {
                        document.querySelector(ctaUrl)?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.open(ctaUrl, '_blank');
                      }
                    }}
                  >
                    <Sparkles className="w-6 h-6 mr-2" />
                    {ctaText}
                  </Button>

                  {showGuarantee && (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">Garantia de 7 dias</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizOfferPricingBlock;
