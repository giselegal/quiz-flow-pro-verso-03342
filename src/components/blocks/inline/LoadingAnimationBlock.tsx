import React from 'react';

interface LoadingAnimationProps {
  type?: 'spinner' | 'dots' | 'pulse';
  color?: string;
  size?: 'small' | 'medium' | 'large';
  containerWidth?: string;
  spacing?: string;
}

const LoadingAnimationBlock: React.FC<LoadingAnimationProps> = ({
  type = 'spinner',
  color = '#B89B7A',
  size = 'medium',
  containerWidth = 'full',
  spacing = 'small',
}) => {
  const containerClasses = `
    flex justify-center items-center
    ${containerWidth === 'full' ? 'w-full' : 'max-w-md mx-auto'}
    ${spacing === 'small' ? 'p-4' : spacing === 'medium' ? 'p-6' : 'p-8'}
  `;

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const renderSpinner = () => (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-t-transparent`}
      style={{ borderColor: `${color}33`, borderTopColor: color }}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} rounded-full animate-pulse`}
          style={{ 
            backgroundColor: color,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={`${sizeClasses[size]} rounded-full animate-pulse`}
      style={{ backgroundColor: color }}
    />
  );

  const renderAnimation = () => {
    switch (type) {
      case 'dots': return renderDots();
      case 'pulse': return renderPulse();
      default: return renderSpinner();
    }
  };

  return (
    <div className={containerClasses}>
      {renderAnimation()}
    </div>
  );
};

export default LoadingAnimationBlock;