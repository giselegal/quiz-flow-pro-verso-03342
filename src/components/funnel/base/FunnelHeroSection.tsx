import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export interface FunnelHeroSectionProps {
  // Content props
  logoUrl?: string;
  logoAlt?: string;
  title: string;
  description: string;
  ctaText: string;
  ctaSubtext?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;

  // Visual props
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;

  // Layout props
  layout?: 'side-by-side' | 'stacked' | 'hero-centered';
  imagePosition?: 'left' | 'right' | 'background';

  // Behavior props
  onCTAClick?: () => void;

  // Editor props
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * FunnelHeroSection - Componente reutilizável para seções hero de funis
 *
 * Este componente é usado tanto no editor quanto no funil real,
 * garantindo fidelidade visual e funcional.
 *
 * Features:
 * - Totalmente responsivo
 * - Visualização apenas (edição via painel de propriedades)
 * - Múltiplos layouts flexíveis
 * - Paleta de cores da marca por padrão
 * - Selecionável no canvas do editor
 */
const FunnelHeroSection: React.FC<FunnelHeroSectionProps> = ({
  logoUrl,
  logoAlt = 'Logo da Marca',
  title,
  description,
  ctaText,
  ctaSubtext,
  heroImageUrl,
  heroImageAlt = 'Imagem Hero',
  backgroundColor = '#FAF9F7',
  textColor = '#432818',
  primaryColor = '#B89B7A',
  layout = 'side-by-side',
  imagePosition = 'right',
  onCTAClick,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const handleCTAClick = () => {
    if (onCTAClick) {
      onCTAClick();
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'stacked':
        return 'flex flex-col space-y-8';
      case 'hero-centered':
        return 'flex flex-col items-center text-center space-y-8';
      case 'side-by-side':
      default:
        return 'grid md:grid-cols-2 gap-8 items-center';
    }
  };

  const getTextOrder = () => {
    if (layout !== 'side-by-side') return '';
    return imagePosition === 'right' ? 'order-1 md:order-1' : 'order-1 md:order-2';
  };

  const getImageOrder = () => {
    if (layout !== 'side-by-side') return '';
    return imagePosition === 'right' ? 'order-2 md:order-2' : 'order-2 md:order-1';
  };

  return (
    <section
      className={cn(
        'py-8 md:py-16 px-4 md:px-8 transition-all duration-200',
        isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2',
        className
      )}
      style={{
        backgroundColor,
        color: textColor,
        ...(imagePosition === 'background' &&
          heroImageUrl && {
            backgroundImage: `url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }),
      }}
      onClick={onClick}
    >
      <div className="max-w-7xl mx-auto">
        <div className={getLayoutClasses()}>
          {/* Text Content */}
          <div
            className={cn(
              'space-y-6',
              getTextOrder(),
              layout === 'hero-centered' ? 'text-center' : 'text-center md:text-left'
            )}
          >
            {/* Logo */}
            {logoUrl && (
              <div
                className={cn(
                  'mb-6',
                  layout === 'hero-centered' ? 'text-center' : 'text-center md:text-left'
                )}
              >
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className={cn(
                    'h-12 md:h-16 mb-4',
                    layout === 'hero-centered' ? 'mx-auto' : 'mx-auto md:mx-0'
                  )}
                />
              </div>
            )}

            {/* Title */}
            <h1
              className={cn(
                'text-3xl md:text-4xl lg:text-5xl font-playfair leading-tight',
                layout === 'hero-centered' ? 'text-center' : 'text-center md:text-left'
              )}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              className={cn(
                'text-lg md:text-xl opacity-80',
                layout === 'hero-centered' ? 'text-center' : 'text-center md:text-left'
              )}
            >
              {description}
            </p>

            {/* CTA Button */}
            <div
              className={cn(
                'flex',
                layout === 'hero-centered' ? 'justify-center' : 'justify-center md:justify-start'
              )}
            >
              <Button
                onClick={handleCTAClick}
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                }}
              >
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* CTA Subtext */}
            {ctaSubtext && (
              <p
                className={cn(
                  'text-sm opacity-70',
                  layout === 'hero-centered' ? 'text-center' : 'text-center md:text-left'
                )}
              >
                {ctaSubtext}
              </p>
            )}
          </div>

          {/* Hero Image */}
          {heroImageUrl && imagePosition !== 'background' && (
            <div className={cn('relative', getImageOrder())}>
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img src={heroImageUrl} alt={heroImageAlt} className="w-full h-auto object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FunnelHeroSection;
