import { Button } from '@/components/ui/button';

interface FunnelPainSectionProps {
  title?: string;
  description?: string;
  painPoints?: string[];
  ctaText?: string;
  onCTAClick?: () => void;
  // Editor-specific props
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const FunnelPainSection: React.FC<FunnelPainSectionProps> = ({
  title = 'Você está enfrentando esses desafios?',
  description = 'Muitas pessoas passam pelos mesmos problemas:',
  painPoints = [
    'Dificuldade para encontrar seu estilo pessoal',
    'Guarda-roupa cheio mas nada para vestir',
    'Insegurança com as próprias escolhas de moda',
  ],
  ctaText = 'Descobrir Meu Estilo',
  onCTAClick,
  isSelected = false,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-lg p-8 shadow-sm border ${
        isSelected ? 'border-[#B89B7A]' : 'border-gray-100'
      } ${className}`}
      onClick={onClick}
    >
      <div className="text-center mb-8">
        <h2 style={{ color: '#432818' }}>{title}</h2>
        <p style={{ color: '#6B4F43' }}>{description}</p>
      </div>

      <div className="space-y-4 mb-8">
        {painPoints.map((point, index) => (
          <div key={index} className="flex items-start gap-3">
            <div style={{ backgroundColor: '#FAF9F7' }} />
            <p style={{ color: '#6B4F43' }}>{point}</p>
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
