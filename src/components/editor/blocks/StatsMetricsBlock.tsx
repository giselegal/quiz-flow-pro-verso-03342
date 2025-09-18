import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { InlineEditableText } from './InlineEditableText';
import { useDynamicData } from '@/hooks/useDynamicData';
import {
  TrendingUp,
  Users,
  Star,
  Target,
  Clock,
  Award,
  Heart,
  ShoppingCart,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Crown,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlockComponentProps, BlockData } from '@/types/blocks';

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change?: number;
  changeLabel?: string;
  isPercentage?: boolean;
  icon?: string;
  color?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  isAnimated?: boolean;
}

interface StatsBlockProps extends BlockComponentProps {
  block: BlockData & {
    type: 'stats-metrics';
    properties: {
      title?: string;
      subtitle?: string;
      stats?: Stat[];
      layout?: 'grid' | 'horizontal' | 'vertical' | 'cards';
      columns?: number;
      showProgress?: boolean;
      showTrends?: boolean;
      showIcons?: boolean;
      animateNumbers?: boolean;
      cardStyle?: 'minimal' | 'elegant' | 'bold' | 'gradient';
      backgroundColor?: string;
      textColor?: string;
      accentColor?: string;
    };
  };
}

const StatsMetricsBlock: React.FC<StatsBlockProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const dynamicData = useDynamicData();

  const {
    title = 'Nossos Resultados Falam por Si',
    subtitle = 'Transformando a vida de milhares de mulheres todos os dias',
    stats: staticStats,
    layout = 'grid',
    columns = 4,
    showProgress = false,
    showTrends = true,
    showIcons = true,
    animateNumbers = true,
    cardStyle = 'elegant',
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#B89B7A',
  } = block?.properties || {};

  // Usar estatísticas dinâmicas se disponíveis, senão usar estáticas/padrão
  const stats = staticStats || [
    {
      id: 'stat-1',
      label: 'Mulheres Transformadas',
      value: dynamicData.stats.totalUsers,
      suffix: '+',
      change: 12.5,
      changeLabel: 'este mês',
      icon: 'Users',
      color: '#B89B7A',
      description: 'Descobriram seu estilo único',
      trend: 'up' as const,
      isAnimated: true,
    },
    {
      id: 'stat-2',
      label: 'Avaliação Média',
      value: 4.9,
      suffix: '/5',
      change: 0.2,
      changeLabel: 'último trimestre',
      icon: 'Star',
      color: '#F59E0B',
      description: 'Satisfação das clientes',
      trend: 'up' as const,
      isAnimated: true,
    },
    {
      id: 'stat-3',
      label: 'Taxa de Satisfação',
      value: dynamicData.stats.satisfactionRate,
      suffix: '%',
      change: 3.1,
      changeLabel: 'este ano',
      icon: 'Target',
      color: '#10B981',
      description: 'Clientes satisfeitas',
      trend: 'up' as const,
      isAnimated: true,
    },
    {
      id: 'stat-4',
      label: 'Transformações',
      value: dynamicData.stats.transformations,
      prefix: '',
      icon: 'Crown',
      color: '#B89B7A',
      description: 'Mudanças de estilo realizadas',
      trend: 'neutral' as const,
      isAnimated: true,
    },
  ];

  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Animate numbers on mount
  useEffect(() => {
    if (animateNumbers) {
      stats.forEach(stat => {
        if (stat.isAnimated) {
          let current = 0;
          const target = stat.value;
          const increment = target / 100;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            setAnimatedValues(prev => ({
              ...prev,
              [stat.id]: current,
            }));
          }, 20);
        } else {
          setAnimatedValues(prev => ({
            ...prev,
            [stat.id]: stat.value,
          }));
        }
      });
    } else {
      const initialValues: Record<string, number> = {};
      stats.forEach(stat => {
        initialValues[stat.id] = stat.value;
      });
      setAnimatedValues(initialValues);
    }
  }, [stats, animateNumbers]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      TrendingUp,
      Users,
      Star,
      Target,
      Clock,
      Award,
      Heart,
      ShoppingCart,
      CheckCircle,
      ArrowUp,
      ArrowDown,
      Sparkles,
      Crown,
      Zap,
    };
    return icons[iconName] || TrendingUp;
  };

  const getCardStyleClasses = () => {
    const baseClasses =
      'relative overflow-hidden transition-all duration-300 hover:shadow-lg group';

    switch (cardStyle) {
      case 'minimal':
        return `${baseClasses} bg-white border border-gray-200 rounded-lg shadow-sm`;
      case 'bold':
        return `${baseClasses} bg-gradient-to-br from-[#B89B7A] to-[#A68A6A] text-white rounded-xl shadow-lg`;
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-white to-[#FAF9F7] border border-[#B89B7A]/20 rounded-xl shadow-md`;
      case 'elegant':
      default:
        return `${baseClasses} bg-white border border-[#B89B7A]/20 rounded-lg shadow-md hover:shadow-xl hover:border-[#B89B7A]/40`;
    }
  };

  const formatNumber = (num: number, isDecimal = false) => {
    if (isDecimal) {
      return num.toFixed(1);
    }

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toLocaleString('pt-BR');
  };

  const renderStat = (stat: Stat, index: number) => {
    const IconComponent = getIcon(stat.icon || 'TrendingUp');
    const currentValue = animatedValues[stat.id] || 0;
    const isDecimal = stat.value % 1 !== 0;

    return (
      <motion.div
        key={stat.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`
          ${layout === 'vertical' ? 'w-full' : 'flex-1 min-w-[200px] max-w-sm'}
        `}
      >
        <Card className={getCardStyleClasses()}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              {showIcons && (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color || accentColor }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              )}
              {showTrends && stat.change && stat.trend !== 'neutral' && (
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {stat.change}%
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color || accentColor }}>
                {stat.prefix}
                {formatNumber(currentValue, isDecimal)}
                {stat.suffix}
              </div>
              <CardTitle style={{ color: '#432818' }}>{stat.label}</CardTitle>
            </div>

            {stat.description && <p style={{ color: '#6B4F43' }}>{stat.description}</p>}

            {showProgress && stat.isPercentage && (
              <div className="space-y-2">
                <Progress
                  value={currentValue}
                  className="h-2"
                  style={
                    {
                      '--progress-background': stat.color || accentColor,
                    } as any
                  }
                />
                <div style={{ color: '#8B7355' }}>
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {showTrends && stat.changeLabel && stat.change && (
              <div style={{ color: '#8B7355' }}>
                <Badge variant="outline" className="text-xs">
                  {stat.changeLabel}
                </Badge>
              </div>
            )}
          </CardContent>

          {/* Decorative background element */}
          <div
            className="absolute top-4 right-4 opacity-10"
            style={{ color: stat.color || accentColor }}
          >
            <IconComponent className="w-8 h-8" />
          </div>
        </Card>
      </motion.div>
    );
  };

  if (!stats || stats.length === 0) {
    return (
      <div
        className={`
          bg-gray-100 p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-all duration-200
          ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
          ${className}
        `}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-center text-lg font-medium mb-2">Nenhuma estatística configurada</p>
        <p className="text-center">Configure as métricas no painel de propriedades.</p>
      </div>
    );
  }

  return (
    <div
      className={`
        py-12 px-4 cursor-pointer transition-all duration-200 w-full
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <InlineEditableText
                value={title}
                onChange={(value: string) => handlePropertyChange('title', value)}
                className="inline-block"
                placeholder="Título das estatísticas"
              />
            </h2>
            {subtitle && (
              <p className="text-lg text-opacity-80 max-w-3xl mx-auto">
                <InlineEditableText
                  value={subtitle}
                  onChange={(value: string) => handlePropertyChange('subtitle', value)}
                  className="inline-block"
                  placeholder="Subtítulo das estatísticas"
                />
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div
          className={`
          ${
            layout === 'horizontal'
              ? 'flex flex-wrap justify-center gap-6'
              : layout === 'vertical'
                ? 'space-y-6 max-w-md mx-auto'
                : 'flex flex-wrap gap-6 justify-center max-w-4xl mx-auto'
          }
        `}
        >
          {stats.map((stat, index) => renderStat(stat, index))}
        </div>

        {/* Trust indicators */}
        <div style={{ color: '#8B7355' }}>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Dados atualizados em tempo real</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span>Empresa certificada</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart style={{ color: '#432818' }} />
            <span>Mais de 10 anos de experiência</span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-8 p-4 bg-[#FAF9F7] border border-[#B89B7A]/20 rounded-md">
          <p className="text-sm text-[#8F7A6A]">
            Modo de edição: {stats.length} estatística(s) • Layout: {layout} • Colunas: {columns} •
            {animateNumbers && 'Animações ativas'} • Estilo: {cardStyle}
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsMetricsBlock;
