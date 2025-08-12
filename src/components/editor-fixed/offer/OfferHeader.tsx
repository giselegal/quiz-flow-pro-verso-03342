import FixedIntroImage from '@/components/ui/FixedIntroImage';

interface OfferHeaderProps {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  isSticky?: boolean;
  backgroundColor?: string;
  backdropBlur?: boolean;
}

/**
 * 🎯 COMPONENTE: OfferHeader
 *
 * Header fixo para páginas de oferta com logo centralizado
 * Suporte a backdrop blur e posicionamento sticky
 */
export const OfferHeader: React.FC<OfferHeaderProps> = ({
  logoUrl,
  logoAlt,
  logoWidth,
  logoHeight,
  isSticky = true,
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
  backdropBlur = true,
}) => {
  const headerClasses = `
    py-4 px-6 border-b border-gray-100
    ${isSticky ? 'sticky top-0 z-50' : ''}
    ${backdropBlur ? 'backdrop-blur-sm' : ''}
  `.trim();

  const headerStyle = {
    backgroundColor: backgroundColor,
  };

  return (
    <header className={headerClasses} style={headerStyle}>
      <div className="container-main flex justify-center">
        <FixedIntroImage
          src={logoUrl}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          className="h-auto object-contain"
        />
      </div>
    </header>
  );
};

export default OfferHeader;
