
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FunnelStepProps } from '@/types/funnel';
import { CountdownTimer } from '@/components/ui/countdown-timer';

interface OfferPageStepProps extends FunnelStepProps {
  data: {
    title: string;
    subtitle: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    bonuses: Array<{
      title: string;
      description: string;
      value: string;
    }>;
    testimonials: Array<{
      name: string;
      text: string;
      image: string;
    }>;
    originalPrice: string;
    salePrice: string;
    guaranteeText: string;
    ctaText: string;
    showCountdown: boolean;
    countdownDuration: number;
  };
}

const OfferPageStep: React.FC<OfferPageStepProps> = ({
  data,
  onNext,
  stepNumber,
  totalSteps,
  onEdit,
  isEditable = false
}) => {
  const [timeExpired, setTimeExpired] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {data.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Countdown Timer */}
        {data.showCountdown && (
          <div className="text-center mb-12">
            <CountdownTimer
              duration={data.countdownDuration}
              onComplete={() => setTimeExpired(true)}
            />
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 md:col-span-2 lg:col-span-3 text-center mb-8">
            O que você vai receber:
          </h2>
          
          {data.features.map((feature: any, index: number) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bonuses */}
        {data.bonuses && data.bonuses.length > 0 && (
          <div className="bg-yellow-50 rounded-2xl p-8 mb-16 border-2 border-yellow-200">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              🎁 Bônus Exclusivos
            </h2>
            <div className="space-y-6">
              {data.bonuses.map((bonus: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {bonus.title}
                      </h3>
                      <p className="text-gray-600">
                        {bonus.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-green-600 font-bold text-lg">
                        {bonus.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {data.testimonials && data.testimonials.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Veja o que dizem nossos clientes
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {data.testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-gray-600 mb-4 italic">
                        "{testimonial.text}"
                      </p>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-200 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Oferta Especial
            </h2>
            
            <div className="mb-6">
              <span className="text-2xl text-gray-500 line-through mr-4">
                De {data.originalPrice}
              </span>
              <span className="text-4xl font-bold text-green-600">
                Por apenas {data.salePrice}
              </span>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-8">
              <p className="text-green-800 font-semibold">
                {data.guaranteeText}
              </p>
            </div>

            <Button
              onClick={onNext}
              disabled={timeExpired}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {data.ctaText}
            </Button>

            {timeExpired && (
              <p className="text-red-600 mt-4 font-semibold">
                Oferta expirada
              </p>
            )}
          </div>
        </div>

        {isEditable && (
          <div className="text-center">
            <Button
              onClick={onEdit}
              variant="outline"
              className="mt-4"
            >
              Editar Seção
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferPageStep;
