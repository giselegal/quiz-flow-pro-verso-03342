// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Award,
  TrendingUp,
  Users,
  MessageCircle,
} from 'lucide-react';
import { optimizedSetInterval } from '@/utils/performanceOptimizations';

// COMPONENT: Advanced Testimonial Slider
const TestimonialSlider: React.FC<{
  testimonials?: Array<{
    id: string;
    name: string;
    avatar: string;
    rating: number;
    text: string;
    role?: string;
  }>;
  autoPlay?: boolean;
  interval?: number;
}> = ({
  testimonials = [
    {
      id: '1',
      name: 'Maria Silva',
      avatar: '',
      rating: 5,
      text: 'Transformou completamente meu guarda-roupa!',
      role: 'Empresária',
    },
    {
      id: '2',
      name: 'Ana Costa',
      avatar: '',
      rating: 5,
      text: 'Finalmente descobri meu estilo verdadeiro.',
      role: 'Designer',
    },
    {
      id: '3',
      name: 'Julia Santos',
      avatar: '',
      rating: 5,
      text: 'Recomendo para todas as minhas amigas!',
      role: 'Advogada',
    },
  ],
  autoPlay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = optimizedSetInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, testimonials.length]);

  return (
    <div className="bg-gradient-to-br from-[#432818] to-[#6B5B73] rounded-xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-[#B89B7A] transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / testimonials.length) * 100}%`,
          }}
        />
      </div>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          O que nossas clientes dizem
        </h3>
        <div className="flex items-center justify-center gap-2 text-sm text-white/70">
          <Users className="w-4 h-4" />
          <span>Mais de 3000 mulheres transformadas</span>
        </div>
      </div>

      <div className="relative h-48 flex items-center">
        <div className="w-full text-center">
          <div className="flex justify-center mb-4">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>

          <blockquote className="text-xl italic mb-4 min-h-[3rem] flex items-center justify-center">
            "{testimonials[currentIndex].text}"
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold">
                {testimonials[currentIndex].name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </span>
            </div>
            <div>
              <div className="font-semibold">{testimonials[currentIndex].name}</div>
              <div className="text-sm text-white/70">{testimonials[currentIndex].role}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-[#B89B7A] w-6' : 'bg-white/30'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// COMPONENT: Dynamic Countdown Timer
const CountdownTimer: React.FC<{
  targetDate?: Date;
  onExpire?: () => void;
  title?: string;
  urgencyText?: string;
}> = ({
  targetDate = new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  onExpire,
  title = 'Oferta por tempo limitado!',
  urgencyText = 'Não perca esta oportunidade única',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = optimizedSetInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        onExpire?.();
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white text-center shadow-xl">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="w-6 h-6 animate-pulse" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold font-mono">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wide">Horas</div>
        </div>
        <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold font-mono">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wide">Min</div>
        </div>
        <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold font-mono">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wide">Seg</div>
        </div>
      </div>

      <p className="text-sm text-white/90">{urgencyText}</p>
    </div>
  );
};

// COMPONENT: Advanced Pricing Card
const PricingCard: React.FC<{
  title?: string;
  originalPrice?: number;
  discountPrice?: number;
  discount?: number;
  features?: string[];
  ctaText?: string;
  isPopular?: boolean;
  paymentOptions?: {
    installments?: number;
    installmentValue?: number;
  };
}> = ({
  title = 'Descoberta do Seu Estilo',
  originalPrice = 175,
  discountPrice = 39.9,
  discount = 77,
  features = [
    'Quiz personalizado completo',
    'Análise detalhada do seu estilo',
    'Guia de cores personalizado',
    'Dicas de combinações',
    'Suporte por 30 dias',
  ],
  ctaText = 'QUERO DESCOBRIR MEU ESTILO',
  isPopular = true,
  paymentOptions = {
    installments: 5,
    installmentValue: 8.83,
  },
}) => {
  return (
    <div
      className={`relative bg-white rounded-xl shadow-2xl overflow-hidden ${isPopular ? 'border-2 border-[#B89B7A]' : 'border border-gray-200'}`}
    >
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#B89B7A] to-[#432818] text-white text-center py-2 text-sm font-semibold">
          🔥 MAIS POPULAR
        </div>
      )}

      <div className={`p-8 ${isPopular ? 'pt-16' : ''}`}>
        <div className="text-center mb-6">
          <h3
            className="text-2xl font-bold text-[#432818] mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {title}
          </h3>

          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span style={{ color: '#8B7355' }}>R$ {originalPrice.toFixed(2)}</span>
              <span style={{ backgroundColor: '#FAF9F7' }}>-{discount}% OFF</span>
            </div>
            <div className="text-4xl font-bold text-[#432818]">R$ {discountPrice.toFixed(2)}</div>
            {paymentOptions && paymentOptions.installmentValue && (
              <div style={{ color: '#6B4F43' }}>
                ou {paymentOptions.installments}x de R$ {paymentOptions.installmentValue.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span style={{ color: '#6B4F43' }}>{feature}</span>
            </div>
          ))}
        </div>

        <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          {ctaText}
        </button>

        <div style={{ color: '#8B7355' }}>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>Garantia 7 dias</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>98% satisfação</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// COMPONENT: Interactive Progress Bar
const InteractiveProgressBar: React.FC<{
  currentStep?: number;
  totalSteps?: number;
  stepTitles?: string[];
  showPercentage?: boolean;
  showStepLabels?: boolean;
}> = ({
  currentStep = 1,
  totalSteps = 21,
  stepTitles = [],
  showPercentage = true,
  showStepLabels = false,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-[#432818]">Progresso do Quiz</h4>
        {showPercentage && (
          <span className="text-sm font-medium text-[#B89B7A]">{percentage}% concluído</span>
        )}
      </div>

      <div className="relative">
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <div
            className="bg-gradient-to-r from-[#B89B7A] to-[#432818] h-3 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#432818] rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </div>

        {showStepLabels && (
          <div style={{ color: '#8B7355' }}>
            <span>Início</span>
            <span>
              Etapa {currentStep} de {totalSteps}
            </span>
            <span>Resultado</span>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p style={{ color: '#6B4F43' }}>
          {currentStep === totalSteps
            ? '🎉 Parabéns! Quiz concluído!'
            : `Questão ${currentStep} de ${totalSteps}`}
        </p>
      </div>
    </div>
  );
};

// COMPONENT: Social Proof Banner
const SocialProofBanner: React.FC<{
  totalUsers?: number;
  recentActivity?: Array<{
    name: string;
    action: string;
    timeAgo: string;
  }>;
  showLiveCounter?: boolean;
}> = ({
  totalUsers = 3247,
  recentActivity = [
    { name: 'Maria S.', action: 'completou o quiz', timeAgo: '2 min atrás' },
    { name: 'Ana L.', action: 'descobriu seu estilo', timeAgo: '5 min atrás' },
    { name: 'Julia C.', action: 'iniciou o quiz', timeAgo: '1 min atrás' },
  ],
  showLiveCounter = true,
}) => {
  const [liveCount, setLiveCount] = useState(totalUsers);

  useEffect(() => {
    if (!showLiveCounter) return;

    const interval = optimizedSetInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance to increment
        setLiveCount(prev => prev + 1);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [showLiveCounter]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-[#B89B7A]/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span style={{ color: '#432818' }}>Atividade ao vivo</span>
        </div>
        <div className="text-sm font-medium text-[#B89B7A]">
          {liveCount.toLocaleString('pt-BR')} participantes
        </div>
      </div>

      <div className="space-y-2 max-h-24 overflow-hidden">
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span style={{ color: '#6B4F43' }}>
              <strong>{activity.name}</strong> {activity.action}
            </span>
            <span style={{ color: '#8B7355' }}>{activity.timeAgo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export {
  TestimonialSlider,
  CountdownTimer,
  PricingCard,
  InteractiveProgressBar,
  SocialProofBanner,
};
