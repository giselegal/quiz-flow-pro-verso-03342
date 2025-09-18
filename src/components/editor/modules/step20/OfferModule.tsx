import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Share2 } from 'lucide-react';
import { useQuizData } from './QuizDataProvider';
import type { BaseModuleProps } from '../types';

export interface OfferModuleProps extends BaseModuleProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  showShareButton?: boolean;
  backgroundType?: 'solid' | 'gradient';
  gradientFrom?: string;
  gradientTo?: string;
}

const OfferModule: React.FC<OfferModuleProps> = ({
  title = 'Pronto para Transformar Sua Imagem?',
  description = 'Descubra como aplicar seu estilo no dia a dia.',
  ctaText = 'Ver Consultoria Personalizada',
  ctaUrl = '#',
  showShareButton = true,
  backgroundType = 'gradient',
  gradientFrom = '#B89B7A',
  gradientTo = '#aa6b5d',
  // ctaColor = '#B89B7A', // Unused for now
  className = '',
  isSelected = false
}) => {
  const { primaryStyle, isLoading } = useQuizData();

  if (isLoading) {
    return (
      <div className={cn('animate-pulse p-6 rounded-lg bg-gray-100', className)}>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  const getBackgroundStyle = () => {
    return backgroundType === 'gradient' 
      ? { background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
      : { backgroundColor: gradientFrom };
  };

  const handleShare = () => {
    if (navigator.share && primaryStyle) {
      navigator.share({
        title: 'Meu Estilo Pessoal',
        text: `Descobri que meu estilo é ${primaryStyle.style}!`,
        url: window.location.href
      });
    }
  };

  return (
    <div
      className={cn(
        'w-full p-6 rounded-lg text-center text-white space-y-4',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      style={getBackgroundStyle()}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-white/90">{description}</p>
      
      <div className="space-y-3">
        <button
          onClick={() => ctaUrl !== '#' && window.open(ctaUrl, '_blank')}
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          {ctaText}
        </button>
        
        {showShareButton && (
          <button
            onClick={handleShare}
            className="block mx-auto px-4 py-2 border border-white/30 text-white rounded hover:bg-white/10 transition-colors inline-flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar Resultado
          </button>
        )}
      </div>
    </div>
  );
};

export default OfferModule;