import {
  Check,
  CheckCircle,
  CircleCheck,
  BadgeCheck,
  Star,
  Award,
  Shield,
  Sparkles,
} from 'lucide-react';

interface BenefitsBlockPreviewProps {
  content: {
    title?: string;
    items?: string[];
    useIcons?: boolean;
    icon?: string;
    iconColor?: string;
    style?: any;
  };
}

const BenefitsBlockPreview: React.FC<BenefitsBlockPreviewProps> = ({ content }) => {
  const renderIcon = (iconName: string) => {
    const iconColor = content.iconColor || '#aa6b5d';
    const iconProps = { size: 18, color: iconColor };

    switch (iconName) {
      case 'check-circle':
        return <CheckCircle {...iconProps} />;
      case 'circle-check':
        return <CircleCheck {...iconProps} />;
      case 'badge-check':
        return <BadgeCheck {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'award':
        return <Award {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'check':
      default:
        return <Check {...iconProps} />;
    }
  };

  return (
    <div style={content.style}>
      <h3 className="text-xl font-bold mb-4 text-[#aa6b5d]">{content.title || 'Benefícios'}</h3>
      <ul className="space-y-3">
        {(
          content.items || [
            'Aplicar seus estilos com autenticidade',
            'Montar looks práticos para o dia a dia, trabalho e eventos',
            'Usar cores e modelagens que valorizam quem você é',
            'Parar de errar nas compras e economizar tempo',
          ]
        ).map((item, index) => (
          <li key={index} className="flex items-start">
            {content.useIcons !== false ? (
              <span className="text-[#aa6b5d] mr-2 flex-shrink-0 mt-0.5">
                {renderIcon(content.icon || 'check')}
              </span>
            ) : (
              <span className="text-[#aa6b5d] mr-2">✓</span>
            )}
            <span className="text-[#1A1818]/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BenefitsBlockPreview;
