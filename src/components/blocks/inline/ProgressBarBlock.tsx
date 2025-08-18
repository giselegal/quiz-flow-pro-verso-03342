import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  value?: number;
  max?: number;
  animated?: boolean;
  color?: string;
  backgroundColor?: string;
  height?: string;
  containerWidth?: string;
  spacing?: string;
  showLabel?: boolean;
}

const ProgressBarBlock: React.FC<ProgressBarProps> = ({
  value = 0,
  max = 100,
  animated = true,
  color = '#B89B7A',
  backgroundColor = '#E5E7EB',
  height = 'h-4',
  containerWidth = 'full',
  spacing = 'small',
  showLabel = true,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const percentage = Math.min((displayValue / max) * 100, 100);

  const containerClasses = `
    w-full
    ${containerWidth === 'full' ? 'max-w-full' : 'max-w-md mx-auto'}
    ${spacing === 'small' ? 'p-4' : spacing === 'medium' ? 'p-6' : 'p-8'}
  `;

  return (
    <div className={containerClasses}>
      <div className="w-full">
        <div
          className={`w-full ${height} rounded-full overflow-hidden`}
          style={{ backgroundColor }}
        >
          <div
            className={`${height} ${animated ? 'transition-all duration-1000 ease-out' : ''} rounded-full`}
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>

        {showLabel && (
          <div className="flex justify-between mt-2 text-sm text-stone-600">
            <span>{Math.round(percentage)}%</span>
            <span>
              {displayValue}/{max}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBarBlock;
