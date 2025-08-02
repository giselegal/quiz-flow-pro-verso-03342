
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FunnelStepProps } from '@/types/funnel';
import { CountdownTimer } from '../shared/CountdownTimer';

interface OfferPageStepProps extends FunnelStepProps {
  data?: {
    title?: string;
    subtitle?: string;
    price?: {
      original: number;
      discounted: number;
      currency: string;
    };
    features?: Array<{
      title: string;
      description: string;
      included: boolean;
    }>;
    bonuses?: Array<{
      title: string;
      value: string;
      description: string;
    }>;
    testimonials?: Array<{
      name: string;
      role: string;
      content: string;
      avatar?: string;
    }>;
    guarantee?: {
      days: number;
      description: string;
    };
    urgency?: {
      enabled: boolean;
      message: string;
      countdown?: number;
    };
    ctaText?: string;
  };
}

const OfferPageStep: React.FC<OfferPageStepProps> = ({ data, onNext }) => {
  const [selectedVariant, setSelectedVariant] = useState<string>('basic');

  const {
    title = "Transforme Seu Estilo Agora!",
    subtitle = "Uma oportunidade única para descobrir e elevar seu estilo pessoal",
    price = {
      original: 497,
      discounted: 197,
      currency: "R$"
    },
    features = [
      { title: "Análise Completa de Estilo", description: "Descubra exatamente qual é o seu estilo único", included: true },
      { title: "Guia de Cores Personalizado", description: "As cores que mais favorecem você", included: true },
      { title: "Dicas de Montagem de Look", description: "Como criar combinações perfeitas", included: true }
    ],
    bonuses = [
      { title: "E-book Exclusivo", value: "R$ 97", description: "Guia completo de estilo pessoal" },
      { title: "Consultoria Online", value: "R$ 200", description: "1 hora de consultoria personalizada" }
    ],
    testimonials = [
      { name: "Ana Silva", role: "Executiva", content: "Transformou completamente meu guarda-roupa!", avatar: "" },
      { name: "Carla Santos", role: "Empreendedora", content: "Agora me sinto confiante em qualquer ocasião", avatar: "" }
    ],
    guarantee = {
      days: 30,
      description: "Se não ficar satisfeita, devolvemos 100% do seu dinheiro"
    },
    urgency = {
      enabled: true,
      message: "Oferta por tempo limitado!",
      countdown: 3600
    },
    ctaText = "QUERO TRANSFORMAR MEU ESTILO AGORA!"
  } = data || {};

  const savings = price.original - price.discounted;
  const savingsPercent = Math.round((savings / price.original) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F7] to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#432818] mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-[#8F7A6A] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Urgency */}
        {urgency.enabled && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center">
            <p className="text-red-600 font-semibold mb-4">{urgency.message}</p>
            {urgency.countdown && (
              <CountdownTimer 
                initialTime={urgency.countdown}
                onComplete={() => console.log('Countdown completed')}
              />
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Features & Benefits */}
          <div>
            {/* Features */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#432818] mb-6">O que você vai receber:</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#B89B7A]/20">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#432818] mb-1">{feature.title}</h4>
                      <p className="text-[#8F7A6A] text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonuses */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#432818] mb-6">Bônus Exclusivos:</h3>
              <div className="space-y-4">
                {bonuses.map((bonus, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      {bonus.value}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#432818] mb-1">{bonus.title}</h4>
                      <p className="text-[#8F7A6A] text-sm">{bonus.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & CTA */}
          <div>
            {/* Pricing Card */}
            <div className="bg-white rounded-lg border-2 border-[#B89B7A] p-8 mb-8 sticky top-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-3xl text-gray-400 line-through">
                    {price.currency} {price.original}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    -{savingsPercent}%
                  </span>
                </div>
                <div className="text-5xl font-bold text-[#432818] mb-2">
                  {price.currency} {price.discounted}
                </div>
                <p className="text-green-600 font-semibold">
                  Você economiza {price.currency} {savings}!
                </p>
              </div>

              <Button 
                onClick={onNext}
                size="lg"
                className="w-full bg-[#B89B7A] hover:bg-[#A68B6A] text-white font-bold py-4 text-lg mb-4"
              >
                {ctaText}
              </Button>

              <div className="text-center text-sm text-[#8F7A6A]">
                <p>✅ Pagamento 100% Seguro</p>
                <p>✅ Acesso Imediato</p>
                <p>✅ Garantia de {guarantee.days} dias</p>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-bold text-green-800 mb-2">Garantia de {guarantee.days} Dias</h4>
              <p className="text-green-700 text-sm">{guarantee.description}</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-[#432818] text-center mb-12">
            O que nossas clientes dizem:
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-[#B89B7A]/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#B89B7A] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-[#432818]">{testimonial.name}</h4>
                    <p className="text-[#8F7A6A] text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#8F7A6A] italic">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <Button 
            onClick={onNext}
            size="lg"
            className="bg-[#B89B7A] hover:bg-[#A68B6A] text-white font-bold py-4 px-12 text-xl"
          >
            {ctaText}
          </Button>
          <p className="text-[#8F7A6A] mt-4 text-sm">
            Clique agora e transforme seu estilo hoje mesmo!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferPageStep;
