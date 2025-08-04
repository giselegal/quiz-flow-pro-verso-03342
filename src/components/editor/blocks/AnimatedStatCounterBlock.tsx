import React, { useEffect, useState } from 'react';
import type { BlockComponentProps } from '../../../types/blocks';
import { Users, TrendingUp, Heart, Clock, Star, Award, Target, Zap, BarChart3 } from 'lucide-react';

/**
 * AnimatedStatCounterBlock - Contador animado para estatísticas
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const AnimatedStatCounterBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div className="bg-red-100 p-2 text-red-600 text-sm rounded">⚠️ Erro: Propriedades do bloco não encontradas</div>
    );
  }

  const {
    startValue = 0,
    endValue = 1000,
    prefix = '',
    suffix = '+',
    duration = 2000, // ms
    label = 'Clientes satisfeitos',
    icon = 'users',
    colorScheme = 'blue',
    layout = 'horizontal', // horizontal, vertical
    showIcon = true,
    textAlign = 'center',
    animateOnScroll = true,
    size = 'medium', // small, medium, large
  } = block.properties;

  const [count, setCount] = useState(startValue);
  const [hasAnimated, setHasAnimated] = useState(!animateOnScroll);

  // Cores para os diferentes esquemas
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'text-blue-500',
      border: 'border-blue-200',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'text-green-500',
      border: 'border-green-200',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      icon: 'text-red-500',
      border: 'border-red-200',
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      icon: 'text-yellow-500',
      border: 'border-yellow-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: 'text-purple-500',
      border: 'border-purple-200',
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      icon: 'text-gray-500',
      border: 'border-gray-200',
    },
  };

  const colors = colorSchemes[colorScheme as keyof typeof colorSchemes] || colorSchemes.blue;

  // Tamanhos
  const sizes = {
    small: {
      container: 'p-3',
      icon: 'w-5 h-5',
      value: 'text-xl',
      label: 'text-xs',
    },
    medium: {
      container: 'p-4',
      icon: 'w-6 h-6',
      value: 'text-2xl',
      label: 'text-sm',
    },
    large: {
      container: 'p-5',
      icon: 'w-8 h-8',
      value: 'text-3xl',
      label: 'text-base',
    },
  };

  const sizeStyles = sizes[size as keyof typeof sizes] || sizes.medium;

  // Ícones disponíveis
  const icons = {
    users: Users,
    trending: TrendingUp,
    heart: Heart,
    clock: Clock,
    star: Star,
    award: Award,
    target: Target,
    zap: Zap,
    chart: BarChart3,
  };

  const IconComponent = icons[icon as keyof typeof icons] || Users;

  // Animar contador
  useEffect(() => {
    if (!hasAnimated) return;

    const diff = endValue - startValue;
    const steps = Math.max(1, duration / 30); // Atualiza a cada ~30ms
    const increment = diff / steps;
    let currentCount = startValue;

    const timer = setInterval(() => {
      currentCount += increment;

      if ((increment > 0 && currentCount >= endValue) || (increment < 0 && currentCount <= endValue)) {
        clearInterval(timer);
        setCount(endValue);
      } else {
        setCount(Math.round(currentCount));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [startValue, endValue, duration, hasAnimated]);

  // Detectar scroll para iniciar animação
  useEffect(() => {
    if (!animateOnScroll || hasAnimated) return;

    const handleScroll = () => {
      const element = document.querySelector(`[data-block-id="${block.id}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible) {
          setHasAnimated(true);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar visibilidade inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animateOnScroll, hasAnimated, block.id]);

  return (
    <div
      className={`transition-all duration-200 ${colors.bg} border ${colors.border} rounded-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${className}`}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div
        className={`${sizeStyles.container} ${layout === 'horizontal' ? 'flex items-center gap-4' : 'text-center'}`}
        style={{ textAlign: textAlign as any }}
      >
        {showIcon && (
          <div className={`${layout === 'vertical' ? 'mb-3 mx-auto' : ''}`}>
            <IconComponent className={`${sizeStyles.icon} ${colors.icon}`} />
          </div>
        )}

        <div className={`${layout === 'vertical' ? 'space-y-1' : 'flex-1'}`}>
          <div className={`font-bold ${sizeStyles.value} ${colors.text}`}>
            {prefix}
            {count.toLocaleString()}
            {suffix}
          </div>

          <div className={`${sizeStyles.label} text-gray-600`}>{label}</div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStatCounterBlock;
