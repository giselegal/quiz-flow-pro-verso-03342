import FixedIntroImage from '@/components/ui/FixedIntroImage';
import { trackButtonClick } from '@/utils/analytics';
import { Clock, LucideIcon, ShoppingBag } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

interface OfferSolutionSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  ctaText: string;
  ctaIcon: string;
  ctaUrl: string;
  showCountdown: boolean;
  countdownInitial: CountdownTime;
}

// Mapeamento de ícones
const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  Clock,
};

/**
 * 🎯 COMPONENTE: CountdownTimer
 *
 * Timer de contagem regressiva reutilizável
 */
const CountdownTimer: React.FC<{ initial: CountdownTime }> = ({ initial }) => {
  const [time, setTime] = useState<CountdownTime>(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return initial; // Reinicia
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initial]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <p className="text-[#432818] font-semibold mb-2 flex items-center">
        <Clock size={18} className="mr-1 text-[#B89B7A]" />
        Esta oferta expira em:
      </p>
      <div className="flex items-center justify-center gap-1">
        <div className="bg-[#432818] text-white px-3 py-2 rounded-md text-lg font-mono font-bold shadow-sm">
          {formatNumber(time.hours)}
        </div>
        <span className="text-[#B89B7A] font-bold text-xl">:</span>
        <div className="bg-[#432818] text-white px-3 py-2 rounded-md text-lg font-mono font-bold shadow-sm">
          {formatNumber(time.minutes)}
        </div>
        <span className="text-[#B89B7A] font-bold text-xl">:</span>
        <div className="bg-[#432818] text-white px-3 py-2 rounded-md text-lg font-mono font-bold shadow-sm">
          {formatNumber(time.seconds)}
        </div>
      </div>
    </div>
  );
};

/**
 * 🎯 COMPONENTE: OfferSolutionSection
 *
 * Seção que apresenta a solução com CTA e countdown opcional
 */
export const OfferSolutionSection: React.FC<OfferSolutionSectionProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  ctaText,
  ctaIcon,
  ctaUrl,
  showCountdown,
  countdownInitial,
}) => {
  const CtaIcon = iconMap[ctaIcon] || ShoppingBag;

  const handleCtaClick = () => {
    trackButtonClick('solution_cta', ctaText, 'offer_solution_section');
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
    <section className="section-gap">
      <div className="container-main">
        <div className="card-clean text-center">
          <h2
            className="text-hierarchy-2 text-[var(--text-dark)] mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {title}
          </h2>

          <div className="max-w-md mx-auto mb-8">
            <FixedIntroImage
              src={imageUrl}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              className="w-full h-auto rounded-lg"
            />
          </div>

          <p className="text-body text-[var(--text-medium)] mb-8 max-w-2xl mx-auto">
            {renderText(description)}
          </p>

          <button onClick={handleCtaClick} className="btn-primary-clean mb-6">
            <CtaIcon size={20} />
            {ctaText}
          </button>

          {showCountdown && <CountdownTimer initial={countdownInitial} />}
        </div>
      </div>
    </section>
  );
};

export default OfferSolutionSection;
