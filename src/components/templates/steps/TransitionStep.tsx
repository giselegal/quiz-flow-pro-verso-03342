import React from 'react';

interface TransitionStepProps {
  type: 'strategic' | 'result';
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  onContinue?: () => void;
  stepNumber: number;
}

/**
 * 🎯 STEPS 12 & 19: PÁGINAS DE TRANSIÇÃO
 * Componente para páginas de transição entre seções do quiz
 */
export const TransitionStep: React.FC<TransitionStepProps> = ({
  type,
  title,
  subtitle,
  description,
  buttonText,
  onContinue,
  stepNumber
}) => {
  const progressPercentage = (stepNumber / 21) * 100;
  const icon = type === 'strategic' ? '🕐' : '✨';

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      {/* Header with Logo and Back Button */}
      <div className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            ←
          </button>
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Logo Gisele Galvão"
            className="w-20 h-20 object-contain"
          />
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl w-full text-center space-y-8">
          
          {/* Transition Icon */}
          <div className="text-8xl mb-6">
            {icon}
          </div>

          {/* Main Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-[#432818] leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#B89B7A] leading-relaxed">
            {subtitle}
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>

          {/* Additional Context for Strategic Questions */}
          {type === 'strategic' && (
            <div className="bg-white/70 rounded-xl p-6 max-w-xl mx-auto">
              <p className="text-lg text-[#432818] font-medium">
                💬 Responda com sinceridade. Isso é só entre você e a sua nova versão.
              </p>
            </div>
          )}

          {/* Additional Context for Result */}
          {type === 'result' && (
            <div className="bg-white/70 rounded-xl p-6 max-w-xl mx-auto">
              <p className="text-lg text-[#432818] font-medium">
                Ah, e lembra do valor que mencionamos? Prepare-se para uma surpresa: o que você vai receber vale muito mais do que imagina — e vai custar muito menos do que você esperava.
              </p>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="px-10 py-4 bg-[#B89B7A] text-white text-xl font-semibold rounded-lg hover:bg-[#432818] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-3 rounded-lg text-xs text-gray-600 border">
          <div><strong>Transition Step Debug</strong></div>
          <div>Step: {stepNumber}</div>
          <div>Type: {type}</div>
          <div>Progress: {progressPercentage.toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
};