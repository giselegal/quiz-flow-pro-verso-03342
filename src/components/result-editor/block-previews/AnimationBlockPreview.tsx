import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimationBlockPreviewProps {
  content: {
    animationType?:
      | 'fade-in'
      | 'slide-up'
      | 'slide-down'
      | 'slide-left'
      | 'slide-right'
      | 'zoom-in'
      | 'zoom-out';
    animationDuration?: string;
    animationDelay?: string;
    animationTrigger?: 'onLoad' | 'onScroll' | 'onHover';
    children?: any;
    style?: any;
  };
}

const AnimationBlockPreview: React.FC<AnimationBlockPreviewProps> = ({ content }) => {
  const {
    animationType = 'fade-in',
    animationDuration = '500',
    animationDelay = '0',
    animationTrigger = 'onLoad',
    children,
    style = {},
  } = content;

  const [isVisible, setIsVisible] = useState(animationTrigger !== 'onScroll');
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationTrigger !== 'onScroll') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [animationTrigger]);

  // Gerar os estilos de animação com base nos parâmetros
  const getAnimationStyle = () => {
    // Só aplicar animação se estiver visível ou com hover quando necessário
    const shouldAnimate = isVisible || (animationTrigger === 'onHover' && isHovered);

    if (!shouldAnimate) {
      return { opacity: 0 };
    }

    const baseStyle = {
      transition: `all ${animationDuration}ms ease-out`,
      transitionDelay: `${animationDelay}ms`,
    };

    // Estilos específicos para cada tipo de animação
    switch (animationType) {
      case 'fade-in':
        return {
          ...baseStyle,
          opacity: shouldAnimate ? 1 : 0,
        };
      case 'slide-up':
        return {
          ...baseStyle,
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'translateY(0)' : 'translateY(20px)',
        };
      case 'slide-down':
        return {
          ...baseStyle,
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'translateY(0)' : 'translateY(-20px)',
        };
      case 'slide-left':
        return {
          ...baseStyle,
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'translateX(0)' : 'translateX(20px)',
        };
      case 'slide-right':
        return {
          ...baseStyle,
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'translateX(0)' : 'translateX(-20px)',
        };
      case 'zoom-in':
        return {
          ...baseStyle,
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'scale(1)' : 'scale(0.95)',
        };
      case 'zoom-out':
        return {
          ...baseStyle,
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'scale(1)' : 'scale(1.05)',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      ref={ref}
      style={{
        ...style,
        ...getAnimationStyle(),
      }}
      className={cn('w-full', animationTrigger === 'onHover' && 'transition-all duration-300')}
      onMouseEnter={animationTrigger === 'onHover' ? () => setIsHovered(true) : undefined}
      onMouseLeave={animationTrigger === 'onHover' ? () => setIsHovered(false) : undefined}
    >
      {children || (
        <div className="p-6 text-center text-gray-400 border border-dashed rounded-md">
          Este é um contêiner de animação. Adicione conteúdo dentro dele.
        </div>
      )}
    </div>
  );
};

export default AnimationBlockPreview;
