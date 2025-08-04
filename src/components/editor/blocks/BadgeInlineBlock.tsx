import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, Check, Star, Award, Edit3 } from 'lucide-react';

type BadgeType = 'security' | 'guarantee' | 'rating' | 'achievement';

interface BadgeInlineBlockProps {
  text?: string;
  type?: BadgeType;
  variant?: 'default' | 'success' | 'warning' | 'info';
  showIcon?: boolean;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

const BadgeInlineBlock: React.FC<BadgeInlineBlockProps> = ({
  text = 'Compra Segura',
  type = 'security',
  variant = 'default',
  showIcon = true,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'guarantee':
        return <Check className="w-4 h-4" />;
      case 'rating':
        return <Star className="w-4 h-4" />;
      case 'achievement':
        return <Award className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-stone-100 text-stone-700 border-yellow-200';
      case 'info':
        return 'bg-[#B89B7A]/20 text-[#432818] border-[#B89B7A]/30';
      default:
        return 'bg-[#fff7f3] text-[#aa6b5d] border-[#B89B7A]/20';
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium',
        'transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer',
        'w-full',
        getVariantStyles(),
        disabled && 'opacity-75 cursor-not-allowed',
        className,
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Icon */}
      {showIcon && <div className="flex-shrink-0">{getIcon()}</div>}

      {/* Text */}
      <span className="truncate">{text}</span>
    </div>
  );
};

export default BadgeInlineBlock;
