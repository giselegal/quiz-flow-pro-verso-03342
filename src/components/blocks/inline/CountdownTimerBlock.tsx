import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  duration?: number; // em segundos
  onComplete?: () => void;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  containerWidth?: string;
  spacing?: string;
}

const CountdownTimerBlock: React.FC<CountdownTimerProps> = ({
  duration = 30,
  onComplete,
  color = '#B89B7A',
  size = 'medium',
  containerWidth = 'full',
  spacing = 'small',
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, onComplete]);

  const containerClasses = `
    flex justify-center items-center
    ${containerWidth === 'full' ? 'w-full' : 'max-w-md mx-auto'}
    ${spacing === 'small' ? 'p-4' : spacing === 'medium' ? 'p-6' : 'p-8'}
  `;

  const sizeClasses = {
    small: 'text-2xl w-16 h-16',
    medium: 'text-3xl w-20 h-20',
    large: 'text-4xl w-24 h-24',
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((duration - timeLeft) / duration) * 100;

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Circular Progress Background */}
        <svg className={`${sizeClasses[size]} transform -rotate-90`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${progressPercentage * 2.827} 282.7`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${sizeClasses[size].split(' ')[0]}`} style={{ color }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimerBlock;
