import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';
import { ShoppingBag, Clock } from 'lucide-react';

/**
 * OfferSolutionSectionInlineBlock - Seção de solução com countdown
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

const OfferSolutionSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('OfferSolutionSectionInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    title = 'A Solução: Quiz de Estilo',
    description = 'Método preciso para identificar seu estilo entre os **7 estilos universais** + guia personalizado completo.',
    imageUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746650306/oie_1_gcozz9.webp',
    imageAlt = 'Quiz de Estilo',
    imageWidth = 400,
    imageHeight = 300,
    ctaText = 'Fazer o Quiz Agora',
    ctaUrl = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
    showCountdown = true,
    countdownInitial = {
      hours: 1,
      minutes: 59,
      seconds: 59,
    },
    spacing = 'large',
  } = properties;

  // Estado do countdown
  const [time, setTime] = useState(countdownInitial);

  useEffect(() => {
    if (!showCountdown) return;

    const interval = setInterval(() => {
      setTime((prevTime: any) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 1, minutes: 59, seconds: 59 }; // Reinicia
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showCountdown]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const spacingClasses = {
    small: 'py-8',
    medium: 'py-12',
    large: 'py-16',
  };

  const handleCtaClick = () => {
    if (ctaUrl) {
      window.open(ctaUrl, '_blank');
    }
  };

  return (
    <section
      className={cn(
        'w-full bg-[#FFFBF7]',
        spacingClasses[spacing as keyof typeof spacingClasses] || spacingClasses.large,
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5DDD5]/30 text-center">
          {/* Título */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#432818] mb-6 font-playfair">
            {title}
          </h2>

          {/* Imagem */}
          {imageUrl && (
            <div className="max-w-md mx-auto mb-8">
              <img
                src={imageUrl}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="w-full h-auto rounded-lg shadow-md"
                loading="lazy"
              />
            </div>
          )}

          {/* Descrição */}
          <p className="text-lg text-[#6B4F43] mb-8 max-w-2xl mx-auto">
            {description
              .split('**')
              .map((part: string, index: number) =>
                index % 2 === 1 ? <strong key={index}>{part}</strong> : part
              )}
          </p>

          {/* CTA */}
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg mb-8"
          >
            <ShoppingBag size={20} />
            {ctaText}
          </button>

          {/* Countdown Timer */}
          {showCountdown && (
            <div className="flex flex-col items-center">
              <p className="text-[#432818] font-semibold mb-4 flex items-center">
                <Clock size={18} className="mr-2 text-[#B89B7A]" />
                Esta oferta expira em:
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-[#432818] text-white px-4 py-3 rounded-md text-xl font-mono font-bold shadow-sm">
                  {formatNumber(time.hours)}
                </div>
                <span className="text-[#B89B7A] font-bold text-2xl">:</span>
                <div className="bg-[#432818] text-white px-4 py-3 rounded-md text-xl font-mono font-bold shadow-sm">
                  {formatNumber(time.minutes)}
                </div>
                <span className="text-[#B89B7A] font-bold text-2xl">:</span>
                <div className="bg-[#432818] text-white px-4 py-3 rounded-md text-xl font-mono font-bold shadow-sm">
                  {formatNumber(time.seconds)}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-sm text-[#8B7355]">
                <span>Horas</span>
                <span>Minutos</span>
                <span>Segundos</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OfferSolutionSectionInlineBlock;
