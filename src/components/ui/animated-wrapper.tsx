import React, { useEffect, useState } from 'react';

interface AnimatedWrapperProps {
  animation?: 'fade' | 'scale' | 'none';
  show: boolean;
  duration?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  animation = 'fade',
  show,
  duration = 300,
  delay = 0,
  className = '',
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setMounted(true), delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay]);

  if (!show || !mounted) return null;

  const animationClass =
    animation === 'fade' ? 'animate-fade-in' : animation === 'scale' ? 'animate-scale-in' : '';

  return (
    <div
      className={`${animationClass} ${className}`}
      style={{ animationDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  style,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};
