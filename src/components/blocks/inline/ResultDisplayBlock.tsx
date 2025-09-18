import React from 'react';

interface ResultDisplayProps {
  title?: string;
  description?: string;
  score?: number;
  category?: string;
  imageUrl?: string;
  containerWidth?: string;
  spacing?: string;
}

const ResultDisplayBlock: React.FC<ResultDisplayProps> = ({
  title = 'Seu Resultado',
  description = 'Parabéns! Aqui está seu resultado personalizado.',
  score = 85,
  category = 'Elegante',
  imageUrl,
  containerWidth = 'full',
  spacing = 'medium',
}) => {
  const containerClasses = `
    w-full
    ${containerWidth === 'full' ? 'max-w-full' : 'max-w-2xl mx-auto'}
    ${spacing === 'small' ? 'p-4' : spacing === 'medium' ? 'p-6' : 'p-8'}
  `;

  return (
    <div className={containerClasses}>
      <div className="bg-gradient-to-br from-white to-stone-50 rounded-2xl border border-stone-200 shadow-lg p-8">
        {/* Image */}
        {imageUrl && (
          <div className="flex justify-center mb-6">
            <img
              src={imageUrl}
              alt={`Resultado ${category}`}
              className="w-32 h-32 object-cover rounded-full border-4 border-[#B89B7A]/20"
            />
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-[#432818] mb-2">{title}</h2>
          <p className="text-xl text-[#B89B7A] font-medium">{category}</p>
        </div>

        {/* Score Circle */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#B89B7A"
                strokeWidth="8"
                strokeDasharray={`${score * 2.513} 251.3`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#432818]">{score}%</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-center">
          <p className="text-stone-700 text-lg leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplayBlock;
