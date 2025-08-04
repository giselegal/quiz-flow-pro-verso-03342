import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface ComparisonTableBlockProps {
  title?: string;
  showBenefits?: boolean;
  className?: string;
}

const ComparisonTableBlock: React.FC<ComparisonTableBlockProps> = ({
  title = 'O Guia de Estilo e Imagem + Bônus Exclusivos',
  showBenefits = true,
  className,
}) => {
  // Dados reais da página de resultado
  const benefits = [
    'Looks com intenção e identidade',
    'Cores, modelagens e tecidos a seu favor',
    'Imagem alinhada aos seus objetivos',
    'Guarda-roupa funcional, sem compras por impulso',
  ];

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] p-6 rounded-lg mb-6 border border-[#B89B7A]/10 glass-panel',
        className,
      )}
    >
      <h3 className="text-xl font-medium text-[#aa6b5d] mb-4">{title}</h3>
      {showBenefits && (
        <ul className="space-y-3 text-left max-w-xl mx-auto text-[#432818]">
          {benefits.map((item, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white mr-2 mt-0.5">
                <Check className="h-3 w-3" />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComparisonTableBlock;
