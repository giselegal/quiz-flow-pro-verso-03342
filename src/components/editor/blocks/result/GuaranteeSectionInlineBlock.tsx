import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Shield, CheckCircle, RefreshCw, Lock } from 'lucide-react';

/**
 * GuaranteeSectionInlineBlock - Guarantee section with trust elements
 * Shows money-back guarantee and trust badges
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const GuaranteeSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,

  className = '',
}) => {
  // Destructure properties with defaults
  const {
    title = '100% Garantido ou Seu Dinheiro de Volta',
    subtitle = 'Experimente nosso guia por 7 dias. Se não ficar completamente satisfeita, devolvemos seu investimento.',
    guaranteeDays = 7,
    guaranteeText = 'Você tem {days} dias completos para experimentar todo o conteúdo. Se por qualquer motivo não estiver satisfeita, basta enviar um email e devolvemos 100% do seu dinheiro, sem perguntas.',
    features = [
      'Garantia incondicional de 7 dias',
      'Suporte especializado incluso',
      'Acesso imediato após a compra',
      'Conteúdo atualizado regularmente',
      'Compra 100% segura e protegida',
    ],
    showSealImage = true,
    sealImage = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/garantia_seal_7dias.webp',
    showTrustBadges = true,
    trustBadges = [
      { text: 'SSL Seguro', icon: 'lock' },
      { text: 'Pagamento Protegido', icon: 'shield' },
      { text: 'Suporte 24h', icon: 'check' },
    ],
    backgroundColor = '#f8fffe',
    borderColor = '#10b981',
    accentColor = '#10b981',
    textColor = '#032824',
    containerWidth = 'xlarge',
    spacing = 'large',
    marginTop = 0,
    marginBottom = 24,
    textAlign = 'center',
  } = block?.properties ?? {};

  // Container classes
  const containerClasses = cn(
    'w-full',
    {
      'max-w-sm mx-auto': containerWidth === 'small',
      'max-w-md mx-auto': containerWidth === 'medium',
      'max-w-lg mx-auto': containerWidth === 'large',
      'max-w-2xl mx-auto': containerWidth === 'xlarge',
      'max-w-4xl mx-auto': containerWidth === 'xxlarge',
      'max-w-full': containerWidth === 'full',
    },
    {
      'p-4': spacing === 'small',
      'p-6': spacing === 'normal',
      'p-8': spacing === 'large',
    },
    {
      'mt-0': marginTop === 0,
      'mt-4': marginTop <= 16,
      'mt-6': marginTop <= 24,
      'mt-8': marginTop <= 32,
    },
    {
      'mb-0': marginBottom === 0,
      'mb-4': marginBottom <= 16,
      'mb-6': marginBottom <= 24,
      'mb-8': marginBottom <= 32,
    },
    {
      'text-left': textAlign === 'left',
      'text-center': textAlign === 'center',
      'text-right': textAlign === 'right',
    },
    'rounded-lg border-2',
    isSelected && 'ring-2 ring-blue-500 ring-opacity-50',
    className
  );

  const containerStyle = {
    backgroundColor,
    borderColor,
    color: textColor,
  };

  const processedGuaranteeText = guaranteeText.replace('{days}', guaranteeDays.toString());

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'lock':
        return Lock;
      case 'shield':
        return Shield;
      case 'check':
        return CheckCircle;
      default:
        return Shield;
    }
  };

  return (
    <div className={containerClasses} onClick={onClick} style={containerStyle}>
      <div className="space-y-6">
        {/* Header with Shield */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8" style={{ color: accentColor }} />
            <h2
              className="text-2xl md:text-3xl font-bold font-playfair"
              style={{ color: accentColor }}
            >
              {title}
            </h2>
            <Shield className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          {subtitle && (
            <p className="text-base md:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          {/* Guarantee Seal */}
          {showSealImage && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={
                    sealImage ||
                    // Data URI local para evitar DNS externo
                    undefined
                  }
                  alt={`Garantia de ${guaranteeDays} dias`}
                  className="w-48 h-48 object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{guaranteeDays} DIAS</div>
                    <div className="text-sm text-white font-medium">GARANTIA</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guarantee Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
              Como Funciona Nossa Garantia:
            </h3>

            <p className="text-sm leading-relaxed text-left">{processedGuaranteeText}</p>

            {/* Features List */}
            <ul className="space-y-2 text-left">
              {features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: accentColor }}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        {showTrustBadges && trustBadges.length > 0 && (
          <div className="border-t pt-6" style={{ borderColor: borderColor + '30' }}>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {trustBadges.map((badge: any, index: number) => {
                const IconComponent = getIcon(badge.icon);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" style={{ color: accentColor }} />
                    <span className="text-sm font-medium">{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Money Back Guarantee Statement */}
        <div
          className="bg-white bg-opacity-70 p-4 rounded-lg max-w-lg mx-auto border border-opacity-30"
          style={{ borderColor: accentColor }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <RefreshCw className="w-5 h-5" style={{ color: accentColor }} />
            <span className="font-semibold" style={{ color: accentColor }}>
              Sem Riscos, Sem Pegadinhas
            </span>
          </div>
          <p className="text-xs opacity-90">
            Sua satisfação é nossa prioridade. Se não gostar, devolvemos seu dinheiro integralmente
            em até 2 dias úteis.
          </p>
        </div>

        {/* Contact Info for Guarantee */}
        <div className="text-xs opacity-75">
          <p>
            Para solicitar reembolso, envie um email para:{' '}
            <strong>garantia@giselegarvao.com.br</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuaranteeSectionInlineBlock;
