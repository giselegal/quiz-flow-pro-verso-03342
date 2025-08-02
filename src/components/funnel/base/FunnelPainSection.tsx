
import React from 'react';
import { Button } from '@/components/ui/button';

interface FunnelPainSectionProps {
  title?: string;
  description?: string;
  painPoints?: string[];
  ctaText?: string;
  onCTAClick?: () => void;
}

const FunnelPainSection: React.FC<FunnelPainSectionProps> = ({
  title = "Você está enfrentando esses desafios?",
  description = "Muitas pessoas passam pelos mesmos problemas:",
  painPoints = [
    "Dificuldade para encontrar seu estilo pessoal",
    "Guarda-roupa cheio mas nada para vestir",
    "Insegurança com as próprias escolhas de moda"
  ],
  ctaText = "Descobrir Meu Estilo",
  onCTAClick
}) => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>

      <div className="space-y-4 mb-8">
        {painPoints.map((point, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-gray-700">{point}</p>
          </div>
        ))}
      </div>

      {onCTAClick && (
        <div className="text-center">
          <Button 
            onClick={onCTAClick}
            size="lg"
            className="bg-[#B89B7A] hover:bg-[#A68B6A] text-white"
          >
            {ctaText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FunnelPainSection;
