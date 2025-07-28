
import React from 'react';
import { StyleResult } from '@/types/quiz';
import { Card } from '@/components/ui/card';
import SecondaryStylesSection from '@/components/quiz-result/SecondaryStylesSection';
import { useIsMobile } from '@/hooks/use-mobile';

interface StyleResultSectionProps {
  primaryStyle: StyleResult;
  description: string;
  image: string;
  secondaryStyles: StyleResult[];
}

export const StyleResultSection: React.FC<StyleResultSectionProps> = ({
  primaryStyle,
  description,
  image,
  secondaryStyles
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="p-4 bg-white shadow-sm border border-[#B89B7A]/20">
      <div className="w-full max-w-md mx-auto mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[#432818]">Estilo Predominante</span>
          <span className="text-sm font-medium text-[#B89B7A]">{primaryStyle.percentage}%</span>
        </div>
        <div className="w-full bg-[#F3E8E6] rounded-full h-2">
          <div 
            className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${primaryStyle.percentage}%` }} 
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {isMobile ? (
          // Mobile layout - Image left, description right
          <div className="flex gap-4">
            <img 
              src={image} 
              alt={`Estilo ${primaryStyle.category}`}
              className="w-[30%] h-min rounded-lg shadow-sm" 
            />
            <p className="text-base text-[#432818] leading-relaxed flex-1">
              {description}
            </p>
          </div>
        ) : (
          // Desktop layout - Complementary styles overlay on image
          <div className="relative">
            <img 
              src={image} 
              alt={`Estilo ${primaryStyle.category}`}
              className="w-1/2 h-auto rounded-lg shadow-sm mx-auto" 
            />
            <div className="absolute bottom-2 right-2 w-48 bg-white/90 rounded-lg p-2 shadow-md">
              <SecondaryStylesSection secondaryStyles={secondaryStyles} />
            </div>
          </div>
        )}

        {/* Show secondary styles below on mobile */}
        {isMobile && (
          <div className="bg-white rounded-lg p-3 shadow-sm border border-[#B89B7A]/10">
            <SecondaryStylesSection secondaryStyles={secondaryStyles} />
          </div>
        )}
      </div>
    </Card>
  );
};
