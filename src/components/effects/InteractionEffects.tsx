import React, { useEffect, useRef } from 'react';

interface RippleEffectProps {
  trigger: boolean;
  color?: string;
  duration?: number;
  onComplete?: () => void;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  trigger,
  color = '#B89B7A',
  duration = 600,
  onComplete,
}) => {
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger && rippleRef.current) {
      const ripple = rippleRef.current;

      // Reset animation
      ripple.style.transform = 'scale(0)';
      ripple.style.opacity = '0.6';

      // Force reflow
      ripple.offsetHeight;

      // Start animation
      ripple.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-out`;
      ripple.style.transform = 'scale(3)';
      ripple.style.opacity = '0';

      const timeout = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [trigger, duration, onComplete]);

  return (
    <div
      ref={rippleRef}
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        backgroundColor: color,
        transform: 'scale(0)',
        opacity: 0,
        zIndex: 10,
      }}
    />
  );
};

interface PulseEffectProps {
  active: boolean;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
  active,
  intensity = 'medium',
  color = '#B89B7A',
}) => {
  const pulseScale = {
    low: 'scale(1.02)',
    medium: 'scale(1.05)',
    high: 'scale(1.08)',
  };

  const glowIntensity = {
    low: '0 0 10px',
    medium: '0 0 20px',
    high: '0 0 30px',
  };

  return (
    <div
      className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-1000 ${
        active ? 'opacity-30' : 'opacity-0'
      }`}
      style={{
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        transform: active ? pulseScale[intensity] : 'scale(1)',
        filter: active ? `drop-shadow(${glowIntensity[intensity]} ${color}40)` : 'none',
        animation: active ? 'breathe 2s ease-in-out infinite' : 'none',
      }}
    />
  );
};
