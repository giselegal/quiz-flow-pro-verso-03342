import React, { useState, useCallback } from 'react';
import FunnelProgressBar from '../components/FunnelProgressBar';
import CountdownTimer from '../components/CountdownTimer';

interface OfferPageStepProps {
  stepNumber?: number;
  totalSteps?: number;
  onNext?: () => void;
  onSkip?: () => void;
  className?: string;
}

const OfferPageStep: React.FC<OfferPageStepProps> = ({
  stepNumber = 1,
  totalSteps = 1,
  onNext,
  onSkip,
  className = ''
}) => {
  // State declarations
  const [isEmailCollected, setIsEmailCollected] = useState(false);
  const [email, setEmail] = useState('');

  const handleEmailSubmit = useCallback(() => {
    setIsEmailCollected(true);
    // Here, you would typically handle the email submission
    // to your backend or email marketing service.
    console.log('Email submitted:', email);
  }, [email]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 ${className}`}>
      <FunnelProgressBar 
        currentStep={stepNumber} 
        totalSteps={totalSteps}
      />
      
      {/* Timer Section */}
      <div className="bg-red-600 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <CountdownTimer 
              duration={900}
              onComplete={() => console.log('Timer finished')}
            />
            <span className="text-sm font-medium">
              ⚡ Oferta por tempo limitado!
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Aproveite esta oferta exclusiva!
        </h1>
        <p className="text-xl text-gray-700 text-center mb-12">
          Descubra como transformar seu guarda-roupa e elevar seu estilo pessoal.
        </p>

        {/* Offer Details */}
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Pacote Premium de Consultoria de Estilo
          </h2>
          <ul className="list-disc list-inside text-gray-600 mb-8">
            <li>Análise completa do seu tipo de corpo e coloração pessoal</li>
            <li>3 horas de consultoria individual com um especialista</li>
            <li>Guia personalizado de compras e looks</li>
            <li>Acesso exclusivo a um grupo VIP de estilo</li>
          </ul>
          <div className="text-center">
            <span className="text-gray-500 line-through mr-4">R$ 997</span>
            <span className="text-4xl font-bold text-red-600">R$ 497</span>
          </div>
        </div>

        {/* Email Collection Form */}
        {!isEmailCollected && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
              Insira seu e-mail para garantir esta oferta:
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-grow p-4 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-colors"
                onClick={handleEmailSubmit}
              >
                Quero a minha oferta!
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between">
          {onSkip && (
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onSkip}
            >
              Pular
            </button>
          )}
          {onNext && (
            <button
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={onNext}
            >
              Próximo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferPageStep;
