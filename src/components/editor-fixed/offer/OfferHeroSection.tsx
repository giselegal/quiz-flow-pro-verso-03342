import FixedIntroImage from '@/components/ui/FixedIntroImage';
import { trackButtonClick } from '@/utils/analytics';
import { ArrowRight, Award, Lock, LucideIcon, Shield } from 'lucide-react';

interface TrustElement {
  icon: string;
  text: string;
}

interface OfferHeroSectionProps {
  badgeText: string;
  badgeIcon: string;
  title: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroImageWidth: number;
  heroImageHeight: number;
  ctaText: string;
  ctaIcon: string;
  ctaUrl: string;
  trustElements: TrustElement[];
}

// Mapeamento de ícones
const iconMap: Record<string, LucideIcon> = {
  Award,
  ArrowRight,
  Lock,
  Shield,
};

/**
 * 🎯 COMPONENTE: OfferHeroSection
 *
 * Seção hero principal da página de oferta
 * Inclui badge, título, subtítulo, imagem, CTA e elementos de confiança
 */
export const OfferHeroSection: React.FC<OfferHeroSectionProps> = ({
  badgeText,
  badgeIcon,
  title,
  titleHighlight,
  titleSuffix,
  subtitle,
  heroImageUrl,
  heroImageAlt,
  heroImageWidth,
  heroImageHeight,
  ctaText,
  ctaIcon,
  ctaUrl,
  trustElements,
}) => {
  const BadgeIcon = iconMap[badgeIcon] || Award;
  const CtaIcon = iconMap[ctaIcon] || ArrowRight;

  const handleCtaClick = () => {
    trackButtonClick('hero_cta', ctaText, 'offer_hero_section');
    window.open(ctaUrl, '_blank');
  };

  // Renderizar texto com markdown básico (negrito)
  const renderText = (text: string) => {
    return text.split('**').map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <section className="section-gap pt-8">
      <div className="container-main">
        <div className="card-clean text-center">
          {/* Badge de credibilidade */}
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 mb-6">
            <BadgeIcon size={18} className="text-green-600" />
            <span style={{ color: '#6B4F43' }}>{badgeText}</span>
          </div>

          {/* Título principal */}
          <h1
            className="text-hierarchy-1 text-[var(--text-dark)] mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {title} <span className="text-[var(--primary)]">{titleHighlight}</span>
            <br />
            {titleSuffix}
          </h1>

          {/* Subtítulo */}
          <p className="text-body text-[var(--text-medium)] mb-8 max-w-2xl mx-auto">
            {renderText(subtitle)}
          </p>

          {/* Imagem hero */}
          <div className="mb-8 max-w-lg mx-auto">
            <FixedIntroImage
              src={heroImageUrl}
              alt={heroImageAlt}
              width={heroImageWidth}
              height={heroImageHeight}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>

          {/* CTA principal */}
          <button onClick={handleCtaClick} className="btn-primary-clean mb-6">
            <CtaIcon size={20} />
            {ctaText}
          </button>

          {/* Elementos de confiança */}
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--text-light)]">
            {trustElements.map((element, index) => {
              const ElementIcon = iconMap[element.icon] || Lock;
              return (
                <div key={index} className="flex items-center gap-1">
                  <ElementIcon size={16} className="text-green-600" />
                  <span>{element.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferHeroSection;
