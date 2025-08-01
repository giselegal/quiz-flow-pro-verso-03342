import React, { useState } from 'react';
import { InlineEditableText } from './InlineEditableText';
import { 
  Check, 
  X, 
  Star, 
  Shield, 
  Zap, 
  Heart, 
  Crown, 
  Sparkles,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BenefitItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  isHighlight?: boolean;
  isIncluded?: boolean;
  value?: string;
  category?: string;
}

interface BenefitsListBlockProps extends BlockComponentProps {
  block: {
    id: string;
    type: 'benefits-list';
    properties: {
      title?: string;
      subtitle?: string;
      benefits?: BenefitItem[];
      layout?: 'list' | 'grid' | 'columns' | 'comparison';
      showIcons?: boolean;
      showDescriptions?: boolean;
      showValues?: boolean;
      animateOnScroll?: boolean;
      highlightStyle?: 'premium' | 'success' | 'warning' | 'gradient';
      backgroundColor?: string;
      textColor?: string;
      accentColor?: string;
      cardStyle?: 'minimal' | 'elevated' | 'bordered' | 'glassmorphism';
      spacing?: 'compact' | 'normal' | 'relaxed';
    };
  };
}

const iconMap = {
  check: Check,
  x: X,
  star: Star,
  shield: Shield,
  zap: Zap,
  heart: Heart,
  crown: Crown,
  sparkles: Sparkles,
  plus: Plus,
  minus: Minus,
};

const BenefitsListBlock: React.FC<BenefitsListBlockProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // 🛡️ PROTEÇÃO: Garantir que block.properties existe
  const properties = block?.properties || {};
  
  // 🐛 DEBUG: Log das propriedades recebidas
  console.log('🧱 BenefitsListBlock - Props recebidas:', {
    blockId: block?.id,
    blockType: block?.type,
    hasProperties: !!properties,
    propertiesKeys: Object.keys(properties),
    properties: properties
  });
  
  const {
    title = 'Por que escolher nosso produto?',
    subtitle = 'Descubra todos os benefícios inclusos',
    benefits = [
      {
        id: 'benefit-1',
        title: 'Análise Completa de Estilo',
        description: 'Identificação detalhada do seu perfil e características únicas',
        icon: 'star',
        isHighlight: true,
        isIncluded: true,
        value: 'R$ 150',
        category: 'premium'
      },
      {
        id: 'benefit-2',
        title: 'Guia Personalizado',
        description: 'Material exclusivo criado especialmente para você',
        icon: 'crown',
        isHighlight: false,
        isIncluded: true,
        value: 'R$ 80',
        category: 'standard'
      },
      {
        id: 'benefit-3',
        title: 'Suporte 30 dias',
        description: 'Acompanhamento completo durante sua transformação',
        icon: 'shield',
        isHighlight: false,
        isIncluded: true,
        value: 'R$ 120',
        category: 'support'
      }
    ],
    layout = 'list',
    showIcons = true,
    showDescriptions = true,
    showValues = false,
    animateOnScroll = true,
    highlightStyle = 'premium',
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#B89B7A',
    cardStyle = 'elevated',
    spacing = 'normal'
  } = properties;

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const toggleExpanded = (itemId: string) => {
    if (isEditing) return;
    
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getSpacingClasses = () => {
    const spacingMap = {
      compact: 'gap-2',
      normal: 'gap-4',
      relaxed: 'gap-6'
    };
    return spacingMap[spacing] || spacingMap.normal;
  };

  const getCardStyleClasses = () => {
    const baseClasses = 'relative overflow-hidden transition-all duration-300';
    
    switch (cardStyle) {
      case 'minimal':
        return `${baseClasses} bg-transparent border-none`;
      case 'bordered':
        return `${baseClasses} bg-white border-2 border-gray-200 rounded-lg hover:border-[#B89B7A]/40`;
      case 'glassmorphism':
        return `${baseClasses} bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg`;
      case 'elevated':
      default:
        return `${baseClasses} bg-white rounded-lg shadow-md hover:shadow-lg`;
    }
  };

  const getHighlightClasses = (isHighlight: boolean) => {
    if (!isHighlight) return '';
    
    switch (highlightStyle) {
      case 'success':
        return 'bg-green-50 border-green-200 shadow-green-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 shadow-yellow-100';
      case 'gradient':
        return 'bg-gradient-to-r from-[#B89B7A]/10 to-[#A68A6A]/10 border-[#B89B7A]/30';
      case 'premium':
      default:
        return 'bg-[#FAF9F7] border-[#B89B7A]/40 shadow-[#B89B7A]/10';
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'flex flex-wrap gap-6 justify-center';
      case 'columns':
        return 'flex flex-wrap gap-6 justify-center';
      case 'comparison':
        return 'flex flex-wrap gap-6 justify-center';
      case 'list':
      default:
        return 'space-y-4';
    }
  };

  const renderIcon = (iconName: string, isIncluded: boolean = true) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Check;
    
    return (
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isIncluded 
          ? `bg-[${accentColor}] text-white` 
          : 'bg-red-100 text-red-600'
      )}>
        <IconComponent className="w-4 h-4" />
      </div>
    );
  };

  const renderBenefit = (benefit: BenefitItem, index: number) => {
    // 🛡️ PROTEÇÃO: Verificar se benefit tem as propriedades necessárias
    if (!benefit || !benefit.id || !benefit.title) {
      console.warn('BenefitsListBlock: benefit inválido encontrado:', benefit);
      return null;
    }
    
    const isExpanded = expandedItems.has(benefit.id);
    const hasDescription = showDescriptions && benefit.description;
    const hasValue = showValues && benefit.value;
    
    return (
      <motion.div
        key={benefit.id}
        initial={animateOnScroll ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          'group cursor-pointer',
          layout === 'list' ? 'w-full' : 'flex-1 min-w-[280px] max-w-md'
        )}
        onClick={() => hasDescription && toggleExpanded(benefit.id)}
      >
        <Card className={cn(
          getCardStyleClasses(),
          benefit.isHighlight && getHighlightClasses(true)
        )}>
          <CardContent className={cn(
            'p-4',
            spacing === 'compact' ? 'p-3' : spacing === 'relaxed' ? 'p-6' : 'p-4'
          )}>
            <div className="flex items-start gap-3">
              {/* Icon */}
              {showIcons && renderIcon(benefit.icon || 'check', benefit.isIncluded)}
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={cn(
                    'font-semibold text-sm md:text-base',
                    benefit.isIncluded ? 'text-gray-800' : 'text-gray-400 line-through'
                  )}>
                    {benefit.title}
                  </h3>
                  
                  {/* Value Badge */}
                  {hasValue && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 text-xs bg-[#B89B7A]/10 text-[#B89B7A]"
                    >
                      {benefit.value}
                    </Badge>
                  )}
                  
                  {/* Expand Arrow */}
                  {hasDescription && (
                    <ChevronRight 
                      className={cn(
                        'w-4 h-4 text-gray-400 transition-transform duration-200 ml-2',
                        isExpanded && 'rotate-90'
                      )}
                    />
                  )}
                </div>

                {/* Description */}
                <AnimatePresence>
                  {hasDescription && (isExpanded || layout !== 'list') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className={cn(
                        'text-sm text-gray-600 mt-2 leading-relaxed',
                        !benefit.isIncluded && 'line-through opacity-60'
                      )}>
                        {benefit.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Highlight Badge */}
                {benefit.isHighlight && (
                  <Badge 
                    className="mt-2 bg-[#B89B7A] text-white text-xs"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (!benefits || benefits.length === 0) {
    return (
      <div
        className={cn(
          'bg-gray-100 p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center min-h-[200px] cursor-pointer transition-all duration-200',
          isSelected && 'ring-1 ring-gray-400/40 bg-gray-50/30',
          !isSelected && 'hover:shadow-sm',
          className
        )}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <Check className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-center">Configure os benefícios no painel de propriedades.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'py-8 px-4 cursor-pointer transition-all duration-200 w-full',
        isSelected && 'ring-1 ring-gray-400/40 bg-gray-50/30',
        !isSelected && 'hover:shadow-sm',
        className
      )}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
      style={{ backgroundColor, color: textColor }}
    >
      {/* Header */}
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <InlineEditableText
              value={title}
              onChange={(value: string) => handlePropertyChange('title', value)}
              className="inline-block"
              placeholder="Título dos benefícios"
            />
          </h2>
          {subtitle && (
            <p className="text-lg text-opacity-80 max-w-2xl mx-auto">
              <InlineEditableText
                value={subtitle}
                onChange={(value: string) => handlePropertyChange('subtitle', value)}
                className="inline-block"
                placeholder="Subtítulo dos benefícios"
              />
            </p>
          )}
        </div>
      )}

      {/* Benefits */}
      <div className="max-w-6xl mx-auto">
        <div className={cn(getLayoutClasses(), getSpacingClasses())}>
          {benefits.map((benefit, index) => renderBenefit(benefit, index))}
        </div>
      </div>

      {/* Summary */}
      {showValues && (
        <div className="mt-8 text-center">
          <Card className="inline-block bg-[#FAF9F7] border-[#B89B7A]/20">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Valor total dos benefícios</p>
              <p className="text-2xl font-bold text-[#B89B7A]">
                R$ {benefits
                  .filter(b => b.isIncluded && b.value)
                  .reduce((total, b) => total + parseInt(b.value?.replace(/\D/g, '') || '0'), 0)
                  .toLocaleString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Editor Info */}
      {isEditing && (
        <div className="mt-6 p-3 bg-[#FAF9F7] border border-[#B89B7A]/20 rounded-md">
          <p className="text-sm text-[#8F7A6A]">
            Modo de edição: {benefits.length} benefício(s) • 
            Layout: {layout} • 
            {expandedItems.size} expandido(s)
          </p>
        </div>
      )}
    </div>
  );
};

export default BenefitsListBlock;
