/* @ts-nocheck */
// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlockComponentProps, Feature, Alignment } from './types';

/**
 * GuaranteeSection - Componente de seção de garantia configurável
 *
 * Renderiza uma seção atrativa de garantia com selo, descrição, recursos
 * inclusos e elementos visuais para aumentar a confiança do cliente.
 *
 * @example
 * <GuaranteeSection
 *   title="Garantia de Satisfação Total"
 *   period="30 dias"
 *   description="Se você não ficar 100% satisfeita..."
 *   features={[
 *     { title: 'Reembolso integral', isIncluded: true },
 *     { title: 'Sem perguntas', isIncluded: true }
 *   ]}
 *   sealStyle="badge"
 * />
 */

export interface GuaranteeSectionProps extends BlockComponentProps {
  // Conteúdo principal
  title: string;
  period: string; // ex: "30 dias", "7 dias", "satisfação garantida"
  description: string;

  // Recursos da garantia
  features?: Feature[];
  showFeatures?: boolean;

  // Configurações visuais
  sealStyle?: 'badge' | 'stamp' | 'shield' | 'certificate';
  sealColor?: string;
  alignment?: Alignment;

  // Layout
  layout?: 'horizontal' | 'vertical' | 'centered';
  showIcon?: boolean;
  iconStyle?: 'shield' | 'checkmark' | 'star' | 'heart';

  // Estilo do card
  cardStyle?: 'elevated' | 'bordered' | 'background' | 'minimal';
  backgroundColor?: string;

  // Texto adicional
  additionalText?: string;
  legalText?: string;
}

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = props => {
  const {
    // Conteúdo
    title,
    period,
    description,

    // Recursos
    features = [],
    showFeatures = true,

    // Configurações visuais
    sealStyle = 'badge',
    sealColor = '#16a34a', // verde
    alignment = 'center',

    // Layout
    layout = 'centered',
    showIcon = true,
    iconStyle = 'shield',

    // Estilo
    cardStyle = 'elevated',
    backgroundColor = '#f0fdf4', // verde muito claro

    // Textos
    additionalText,
    legalText = 'Garantia válida conforme termos de uso',

    // Props base
    deviceView = 'desktop',
    className = '',
    style = {},
    testId = 'guarantee-section',
  } = props;

  // Classes de alinhamento
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  // Classes de layout
  const layoutClasses = {
    horizontal: 'flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8',
    vertical: 'flex flex-col items-center space-y-2',
    centered: 'flex flex-col items-center text-center space-y-2',
  };

  // Classes de estilo do card
  const cardStyleClasses = {
    elevated: 'shadow-2xl border-none',
    bordered: 'border-2 shadow-lg',
    background: 'shadow-lg border border-gray-200',
    minimal: 'border border-gray-100 shadow-sm',
  };

  // Renderizar ícone
  const renderIcon = () => {
    const iconClasses = 'w-12 h-12 md:w-16 md:h-16 mx-auto mb-4';

    switch (iconStyle) {
      case 'shield':
        return (
          <svg
            className={iconClasses}
            style={{ color: sealColor }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 1L3 4v3.5c0 4.97 2.98 9.14 7 9.99 4.02-.85 7-5.02 7-9.99V4l-7-3zM8.5 11L6 8.5l1.5-1.5L8.5 8 13 3.5 14.5 5 8.5 11z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'checkmark':
        return (
          <div
            className={`${iconClasses} bg-green-500 rounded-full flex items-center justify-center`}
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'star':
        return (
          <svg
            className={iconClasses}
            style={{ color: sealColor }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'heart':
        return (
          <svg
            className={iconClasses}
            style={{ color: sealColor }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Renderizar selo
  const renderSeal = () => {
    switch (sealStyle) {
      case 'badge':
        return (
          <Badge
            className="px-6 py-3 text-lg font-bold text-white mb-4"
            style={{ backgroundColor: sealColor }}
          >
            Garantia {period}
          </Badge>
        );
      case 'stamp':
        return (
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center mb-4 mx-auto transform rotate-12"
            style={{ borderColor: sealColor, color: sealColor }}
          >
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold">GARANTIA</div>
              <div className="text-sm md:text-base font-semibold">{period}</div>
            </div>
          </div>
        );
      case 'shield':
        return (
          <div className="relative mb-4">
            <svg
              className="w-20 h-20 md:w-24 md:h-24 mx-auto"
              style={{ color: sealColor }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 1L3 4v3.5c0 4.97 2.98 9.14 7 9.99 4.02-.85 7-5.02 7-9.99V4l-7-3z"
                clipRule="evenodd"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs md:text-sm">
              {period}
            </div>
          </div>
        );
      case 'certificate':
        return (
          <div
            className="px-8 py-4 border-4 border-dashed rounded-lg mb-4"
            style={{ borderColor: sealColor, color: sealColor }}
          >
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">🏆</div>
              <div className="text-lg font-bold">GARANTIA</div>
              <div className="text-base font-semibold">{period}</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const containerClasses = getOptimizedContainerClasses(
    deviceView || 'desktop',
    'tight',
    'full',
    className
  );

  return (
    <div className={containerClasses} style={style} data-testid={testId}>
      <div className="max-w-full mx-auto">
        <Card
          className={`${cardStyleClasses[cardStyle]} overflow-hidden`}
          style={{
            backgroundColor: cardStyle === 'background' ? backgroundColor : undefined,
          }}
        >
          <CardContent className="p-8 md:p-12">
            <div className={layoutClasses[layout]}>
              {/* Lado Esquerdo: Selo e Ícone */}
              <div className="flex-shrink-0">
                {showIcon && renderIcon()}
                {renderSeal()}
              </div>

              {/* Lado Direito: Conteúdo */}
              <div className="flex-1">
                {/* Título */}
                <h2 className="text-2xl md:text-4xl font-bold text-[#432818] mb-4">{title}</h2>

                {/* Descrição */}
                <p style={{ color: '#6B4F43' }}>{description}</p>

                {/* Recursos da Garantia */}
                {showFeatures && features.length > 0 && (
                  <div className="mb-6">
                    <div className="space-y-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {feature.isIncluded ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div style={{ backgroundColor: '#FAF9F7' }}>
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span style={{ color: '#432818' }}>{feature.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Texto Adicional */}
                {additionalText && <p style={{ color: '#6B4F43' }}>{additionalText}</p>}

                {/* Texto Legal */}
                {legalText && <p style={{ color: '#8B7355' }}>{legalText}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuaranteeSection;
