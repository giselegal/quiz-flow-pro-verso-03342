import React from 'react';

interface Step20FallbackTemplateProps {
  primaryStyle?: any;
  secondaryStyles?: any[];
  className?: string;
}

export const Step20FallbackTemplate: React.FC<Step20FallbackTemplateProps> = ({
  primaryStyle = {},
  secondaryStyles = [],
  className = ""
}) => {
  return (
    <div className={`step20-fallback-template ${className}`}>
      <div className="text-center p-6 bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">
          Seu Estilo Pessoal
        </h2>
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {primaryStyle?.name || 'Estilo Principal'}
          </h3>
          <p className="text-gray-600">
            {primaryStyle?.description || 'Seu estilo único foi calculado com base nas suas preferências!'}
          </p>
        </div>
        {secondaryStyles.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {secondaryStyles.slice(0, 2).map((style, index) => (
              <div key={index} className="bg-white/60 p-3 rounded-lg">
                <h4 className="font-medium text-gray-700">{style?.name}</h4>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step20FallbackTemplate;