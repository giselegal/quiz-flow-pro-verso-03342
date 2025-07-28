
import React from 'react';
import { cn } from '@/lib/utils';

export interface StyleResult {
  category: string;
  score: number;
  percentage: number;
  description?: string;
  characteristics?: string[];
  recommendations?: string[];
  color?: string;
}

interface StyleResultProps {
  result: StyleResult;
  className?: string;
  compact?: boolean;
}

const StyleResult: React.FC<StyleResultProps> = ({
  result,
  className,
  compact = false
}) => {
  const {
    category,
    score,
    percentage,
    description,
    characteristics = [],
    recommendations = [],
    color = '#B89B7A'
  } = result;

  return (
    <div className={cn(
      'style-result bg-white rounded-lg p-6 shadow-sm border border-gray-200',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color }}>
            {percentage}%
          </div>
          <div className="text-sm text-gray-500">
            Score: {score}
          </div>
        </div>
      </div>

      {!compact && (
        <>
          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}

          {characteristics.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Características:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {characteristics.map((char, index) => (
                  <li key={index}>{char}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recomendações:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StyleResult;
export { StyleResult };
