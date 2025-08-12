import FunnelProgressBar from '../shared/FunnelProgressBar';
import { CountdownTimer } from '@/components/ui/countdown-timer';

interface OfferPageStepProps {
  stepNumber?: number;
  totalSteps?: number;
  offerData?: {
    title?: string;
    subtitle?: string;
    features?: string[];
    price?: {
      original?: number;
      discounted?: number;
      currency?: string;
    };
    countdown?: {
      duration?: number;
    };
  };
  onNext?: () => void;
  onBack?: () => void;
}

const OfferPageStep: React.FC<OfferPageStepProps> = ({
  stepNumber = 1,
  totalSteps = 1,
  offerData = {},
  onNext,
  onBack,
}) => {
  const {
    title = 'Oferta Especial',
    subtitle = 'Aproveite esta oportunidade única',
    features = [],
    price = {},
    countdown = {},
  } = offerData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <FunnelProgressBar currentStep={stepNumber} totalSteps={totalSteps} className="mb-8" />

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 style={{ color: '#432818' }}>{title}</h1>
            <p style={{ color: '#6B4F43' }}>{subtitle}</p>
          </div>

          {/* Countdown Timer */}
          {countdown.duration && (
            <div className="mb-8">
              <CountdownTimer
                duration={countdown.duration}
                onComplete={() => console.log('Countdown completed')}
              />
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">O que você vai receber:</h2>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing */}
          <div className="text-center mb-8">
            {price.original && price.discounted && (
              <div className="mb-4">
                <span style={{ color: '#8B7355' }}>
                  {price.currency || 'R$'} {price.original}
                </span>
                <span className="text-4xl font-bold text-green-600">
                  {price.currency || 'R$'} {price.discounted}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            {onBack && (
              <button onClick={onBack} style={{ borderColor: '#E5DDD5' }}>
                Voltar
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="px-8 py-3 bg-[#B89B7A] text-white rounded-lg hover:bg-[#A38A69] ml-auto"
              >
                Aceitar Oferta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferPageStep;
