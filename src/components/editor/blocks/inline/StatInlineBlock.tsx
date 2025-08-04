import React from 'react';
import { InlineBlockProps } from '@/types/inlineBlocks';
import { useInlineBlock } from '@/hooks/useInlineBlock';
import { TrendingUp, Users, DollarSign, Target, Star, Award } from 'lucide-react';

const StatInlineBlock: React.FC<InlineBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className = '',
}) => {
  const { handlePropertyChange, properties } = useInlineBlock(block, isSelected, onClick, onPropertyChange, className);

  const {
    value = '100',
    label = 'Estatística',
    trend = 'up',
    trendValue = '+15%',
    icon = 'trending-up',
    color = 'primary',
    showTrend = true,
  } = properties;

  const getIcon = () => {
    switch (icon) {
      case 'users':
        return <Users className="w-6 h-6" />;
      case 'dollar':
        return <DollarSign className="w-6 h-6" />;
      case 'target':
        return <Target className="w-6 h-6" />;
      case 'star':
        return <Star className="w-6 h-6" />;
      case 'award':
        return <Award className="w-6 h-6" />;
      default:
        return <TrendingUp className="w-6 h-6" />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-stone-600 bg-stone-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'info':
        return 'text-[#B89B7A] bg-[#B89B7A]/10 border-[#B89B7A]/30';
      default:
        return 'text-[#B89B7A] bg-[#FFF7F3] border-[#B89B7A]/20';
    }
  };

  const getTrendColor = () => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div
      className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${getColorClasses()} ${
        isSelected ? 'ring-2 ring-[#B89B7A] ring-opacity-50' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getIcon()}
            <div className="text-3xl font-bold">{value}</div>
          </div>
          <div className="text-sm opacity-75">{label}</div>
          {showTrend && <div className={`text-xs font-medium mt-1 ${getTrendColor()}`}>{trendValue}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatInlineBlock;
