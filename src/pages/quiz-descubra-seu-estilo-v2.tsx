import React, { useEffect, useState } from 'react';
import { preloadCriticalImages } from '@/utils/images/preloading';
import FixedIntroImage from '@/components/ui/FixedIntroImage';
import {
  ChevronRight,
  Check,
  Clock,
  Star,
  ShoppingBag,
  Heart,
  Users,
  Award,
  Shield,
  ArrowRight,
  TrendingUp,
  BadgeCheck,
  Lock,
  Gift,
  ShoppingCart,
  CheckCircle,
  ArrowDown,
  Hourglass,
  Zap,
  Target,
  Sparkles,
  Crown,
  Flame,
  Eye,
} from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';

// CSS aprimorado para versão B - mais persuasivo e dinâmico
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');
  
  :root {
    --primary: #B89B7A;
    --secondary: #432818;
    --accent: #aa6b5d;
    --success: #22c55e;
    --warning: #f59e0b;
    --danger: #ef4444;
    --background: #FFFBF7;
    --white: #ffffff;
    --text-dark: #432818;
    --text-medium: #6B4F43;
    --text-light: #8B7355;
    --gradient-warm: linear-gradient(135deg, #ff6b6b 0%, #ffa726 50%, #ff8a65 100%);
    --gradient-success: linear-gradient(135deg, #00c851 0%, #007E33 100%);
    --shadow-sm: 0 2px 8px rgba(184, 155, 122, 0.08);
    --shadow-md: 0 4px 20px rgba(184, 155, 122, 0.12);
    --shadow-lg: 0 8px 32px rgba(184, 155, 122, 0.16);
    --shadow-glow: 0 0 20px rgba(255, 107, 107, 0.3);
  }
  
  .container-main { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 0 1rem; 
  }
  
  .section-gap { 
    margin-bottom: 4rem; 
  }
  
  /* Cards com mais impacto */
  .card-impact { 
    background: white; 
    border-radius: 24px; 
    padding: 2.5rem; 
    box-shadow: var(--shadow-lg);
    border: 2px solid rgba(255, 107, 107, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  .card-impact::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-warm);
  }
  
  .card-impact:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-glow);
    transition: all 0.3s ease;
  }
  
  /* CTA Pulsante e Animado */
  .btn-impact {
    background: var(--gradient-warm);
    color: white;
    font-weight: 800;
    border-radius: 20px;
    padding: 1.5rem 3rem;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 8px 32px rgba(255, 107, 107, 0.4);
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    animation: pulse-glow 2s infinite;
    transition: all 0.3s ease;
  }
  
  @keyframes pulse-glow {
    0%, 100% { 
      box-shadow: 0 8px 32px rgba(255, 107, 107, 0.4);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 12px 40px rgba(255, 107, 107, 0.6);
      transform: scale(1.02);
    }
  }
  
  .btn-impact::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s ease;
  }
  
  .btn-impact:hover::before {
    left: 100%;
  }
  
  .btn-impact:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 16px 48px rgba(255, 107, 107, 0.6);
  }
  
  /* Tipografia hierárquica mais impactante */
  .text-hierarchy-1 { 
    font-size: clamp(2.5rem, 6vw, 5rem); 
    font-weight: 800; 
    line-height: 1.1; 
    margin-bottom: 1.5rem;
    background: var(--gradient-warm);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .text-hierarchy-2 { 
    font-size: clamp(1.75rem, 4.5vw, 3rem); 
    font-weight: 700; 
    line-height: 1.2; 
    margin-bottom: 1.25rem;
    color: var(--text-dark);
  }
  
  .text-hierarchy-3 { 
    font-size: clamp(1.375rem, 3.5vw, 2rem); 
    font-weight: 600; 
    line-height: 1.3; 
    margin-bottom: 1rem;
    color: var(--text-dark);
  }
  
  .text-body { 
    font-size: clamp(1.125rem, 2.8vw, 1.375rem); 
    line-height: 1.6; 
    margin-bottom: 1rem;
    color: var(--text-medium);
  }
  
  /* Elementos de Urgência */
  .urgency-banner {
    background: var(--gradient-warm);
    color: white;
    padding: 1rem;
    border-radius: 16px;
    text-align: center;
    font-weight: 700;
    margin-bottom: 2rem;
    animation: urgent-pulse 1.5s infinite;
    box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
  }
  
  @keyframes urgent-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  /* Prova Social Dinâmica */
  .social-proof {
    background: linear-gradient(135deg, #00c851 0%, #00ff7f 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 20px;
    text-align: center;
    margin: 2rem 0;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 200, 81, 0.3);
  }
  
  .social-proof::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Countdown mais dramático */
  .countdown-dramatic {
    background: linear-gradient(135deg, #000000 0%, #434343 100%);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    margin: 2rem 0;
    border: 3px solid #ff6b6b;
    box-shadow: 0 0 30px rgba(255, 107, 107, 0.5);
  }
  
  .countdown-numbers {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .countdown-item {
    background: #ff6b6b;
    color: white;
    padding: 1rem;
    border-radius: 12px;
    min-width: 80px;
    font-weight: 800;
    font-size: 1.5rem;
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
  }
  
  /* Preço com mais impacto */
  .price-impact {
    background: var(--gradient-success);
    color: white;
    padding: 2.5rem;
    border-radius: 24px;
    text-align: center;
    margin: 2rem 0;
    box-shadow: 0 12px 40px rgba(0, 200, 81, 0.4);
    border: 3px solid rgba(255, 255, 255, 0.2);
    position: relative;
  }
  
  .price-badge {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    background: #ff6b6b;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 25px;
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
  }
  
  .price-original {
    text-decoration: line-through;
    opacity: 0.7;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .price-current {
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 900;
    line-height: 1;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }
  
  /* Grid responsivo melhorado */
  .grid-impact {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
  }
  
  /* Animations melhoradas */
  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(50px);
  }
  
  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-delay-1 { animation-delay: 0.1s; }
  .animate-delay-2 { animation-delay: 0.2s; }
  .animate-delay-3 { animation-delay: 0.3s; }
  .animate-delay-4 { animation-delay: 0.4s; }
  
  /* Elementos Before/After */
  .before-after {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
    margin: 3rem 0;
  }
  
  .before-section {
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    padding: 2rem;
    border-radius: 16px;
    border-left: 4px solid #f44336;
  }
  
  .after-section {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    padding: 2rem;
    border-radius: 16px;
    border-left: 4px solid #4caf50;
  }
  
  .vs-element {
    background: var(--gradient-warm);
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    items-center: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.25rem;
    box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
  }
  
  /* Responsivo aprimorado */
  @media (min-width: 640px) {
    .container-main { padding: 0 1.5rem; }
    .grid-impact { grid-template-columns: repeat(2, 1fr); }
    .card-impact { padding: 3rem; }
  }
  
  @media (min-width: 768px) {
    .container-main { padding: 0 2rem; }
    .section-gap { margin-bottom: 5rem; }
    .grid-impact { grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
  }
  
  @media (min-width: 1024px) {
    .grid-impact { gap: 3rem; }
  }
  
  @media (max-width: 639px) {
    .btn-impact { 
      width: 100%; 
      justify-content: center; 
      padding: 1.75rem; 
      font-size: 1.125rem;
    }
    .card-impact { padding: 1.5rem; }
    .section-gap { margin-bottom: 3rem; }
    .countdown-numbers { 
      flex-wrap: wrap; 
      gap: 0.5rem; 
    }
    .countdown-item { 
      min-width: 60px; 
      padding: 0.75rem; 
      font-size: 1.25rem; 
    }
    .before-after {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .vs-element {
      width: 40px;
      height: 40px;
      font-size: 1rem;
      margin: 0 auto;
    }
  }
`;

// URLs das imagens (mantidas da versão original)
const HERO_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp';
const HERO_COMPLEMENTARY_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.jpg';
const PROBLEM_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_9_mgkdnb.webp';
const SOLUTION_QUIZ_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921098/Espanhol_Portugu%C3%AAs_5_cptzyb.webp';
const GUIDES_BENEFITS_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp';
const BONUS_1_KEY_PIECES_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921227/Espanhol_Portugu%C3%AAs_6_y4kqao.webp';
const BONUS_2_VISAGISM_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921365/Espanhol_Portugu%C3%AAs_7_eqgdqz.webp';
const GUARANTEE_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921750/Garantia_7_dias_j8mxth.webp';

// Componente de Popup de Prova Social Dinâmica
const SocialProofPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  const users = [
    'Ana Carolina acabou de comprar',
    'Maria Silva descobriu seu estilo',
    'Juliana Santos transformou seu guarda-roupa',
    'Fernanda Costa está encantada',
    'Camila Oliveira recomenda',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUser(users[Math.floor(Math.random() * users.length)]);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 4000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-green-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
        <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
          <Check size={16} />
        </div>
        <div>
          <p className="font-semibold text-sm">{currentUser}</p>
          <p className="text-xs opacity-90">há poucos minutos</p>
        </div>
      </div>
    </div>
  );
};

// Componente de Avaliações com Estrelas
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={20}
          className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

// Componente de Contagem Regressiva Dramática
const DramaticCountdown = () => {
  const [time, setTime] = useState({
    hours: 2,
    minutes: 47,
    seconds: 33,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="countdown-dramatic">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Flame className="text-orange-400" size={24} />
        <h3 className="text-xl font-bold">OFERTA EXPIRA EM:</h3>
        <Flame className="text-orange-400" size={24} />
      </div>
      <div className="countdown-numbers">
        <div className="countdown-item">
          <div className="text-xs opacity-75">HORAS</div>
          <div>{formatNumber(time.hours)}</div>
        </div>
        <div className="countdown-item">
          <div className="text-xs opacity-75">MIN</div>
          <div>{formatNumber(time.minutes)}</div>
        </div>
        <div className="countdown-item">
          <div className="text-xs opacity-75">SEG</div>
          <div>{formatNumber(time.seconds)}</div>
        </div>
      </div>
      <p className="mt-3 text-sm opacity-90">Não perca esta oportunidade única!</p>
    </div>
  );
};

// Componente FAQ Aprimorado
const FaqSectionAdvanced = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems = [
    {
      question: 'É realmente possível descobrir meu estilo em 5 minutos?',
      answer:
        'Sim! Nosso quiz foi desenvolvido com base em anos de experiência e metodologia científica. Em poucos minutos, você terá uma análise precisa do seu estilo predominante entre os 7 estilos universais.',
    },
    {
      question: 'O que acontece se eu não gostar do resultado?',
      answer:
        'Oferecemos 7 dias de garantia total. Se não ficar satisfeita, devolvemos 100% do seu dinheiro sem perguntas. Sua satisfação é nossa prioridade.',
    },
    {
      question: 'Quanto tempo terei acesso aos materiais?',
      answer:
        'O acesso é vitalício! Você poderá baixar todos os materiais e consultá-los sempre que precisar, sem prazo de expiração.',
    },
    {
      question: 'Funciona para todas as idades e tipos de corpo?',
      answer:
        'Absolutamente! Nosso método é universal e funciona para mulheres de todas as idades, tipos de corpo e estilos de vida. O importante é descobrir e expressar sua essência única.',
    },
    {
      question: 'Como recebo os materiais após a compra?',
      answer:
        'Logo após a confirmação do pagamento, você recebe um email com o link de acesso à área exclusiva onde poderá fazer o quiz e baixar todos os materiais imediatamente.',
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-gray-100 hover:border-orange-200 transition-all duration-300"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-[#B89B7A]/10 transition-colors"
            >
              <span className="font-semibold text-[#432818] text-lg pr-4">{item.question}</span>
              <ChevronRight
                size={24}
                className={`text-orange-500 transition-transform duration-300 flex-shrink-0 ${
                  openItem === index ? 'transform rotate-90' : ''
                }`}
              />
            </button>

            {openItem === index && <div style={{ color: '#6B4F43' }}>{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const QuizOfferPageV2: React.FC = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

    preloadCriticalImages(
      [
        HERO_IMAGE_URL,
        HERO_COMPLEMENTARY_IMAGE_URL,
        PROBLEM_IMAGE_URL,
        SOLUTION_QUIZ_IMAGE_URL,
        GUIDES_BENEFITS_IMAGE_URL,
        BONUS_1_KEY_PIECES_IMAGE_URL,
        BONUS_2_VISAGISM_IMAGE_URL,
        GUARANTEE_IMAGE_URL,
      ],
      { quality: 95 }
    );

    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark('offer-page-v2-mounted');
    }

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleCtaClick = (buttonId: string, action: string = 'Comprar Agora') => {
    trackButtonClick(buttonId, action, 'quiz_offer_page_v2');
  };

  return (
    <div
      className="min-h-screen bg-[var(--background)]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Banner de Urgência no Topo */}
      <div className="urgency-banner">
        <div className="flex items-center justify-center gap-2">
          <Zap size={20} />
          <span>🔥 ÚLTIMAS HORAS: 77% OFF - Apenas R$ 39,90!</span>
          <Zap size={20} />
        </div>
      </div>

      {/* Header Aprimorado */}
      <header className="py-4 px-4 sm:px-6 sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container-main flex justify-between items-center">
          <FixedIntroImage
            src={HERO_IMAGE_URL}
            alt="Logo Gisele Galvão"
            width={180}
            height={80}
            className="h-auto object-contain max-w-[150px] sm:max-w-[180px]"
          />
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">5x R$ 8,83</div>
            <div style={{ color: '#6B4F43' }}>ou R$ 39,90 à vista</div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section Revolucionário */}
        <section className="section-gap pt-6 sm:pt-8">
          <div className="container-main">
            <div className="card-impact text-center animate-slide-up">
              {/* Badge de Prova Social Melhorado */}
              <div className="social-proof">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Crown className="text-yellow-300" size={28} />
                  <span className="text-xl font-bold">+5.247 MULHERES TRANSFORMADAS</span>
                  <Crown className="text-yellow-300" size={28} />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <StarRating rating={5} />
                  <span className="font-semibold">4.9/5 estrelas</span>
                </div>
              </div>

              {/* Headline Mais Impactante */}
              <h1
                className="text-hierarchy-1 mb-6"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                DESCUBRA SEU ESTILO
                <br />
                <span style={{ color: '#ff6b6b' }}>EM 5 MINUTOS</span>
              </h1>

              {/* Subheadline Mais Persuasiva */}
              <p className="text-body mb-8 max-w-4xl mx-auto">
                <strong>Pare de desperdiçar dinheiro em roupas que não combinam!</strong>
                <br />
                Descubra seu estilo predominante e tenha um guarda-roupa que{' '}
                <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>funciona 100%</span>
              </p>

              {/* Hero Video/Image com Destaque */}
              <div className="mb-8 max-w-2xl mx-auto relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl blur opacity-30"></div>
                <div className="relative">
                  <FixedIntroImage
                    src={HERO_COMPLEMENTARY_IMAGE_URL}
                    alt="Transformação de guarda-roupa"
                    width={800}
                    height={533}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                </div>
              </div>

              {/* CTA Principal Mais Impactante */}
              <button
                onClick={() => {
                  handleCtaClick('hero_cta_v2', 'Descobrir Meu Estilo Agora');
                  const checkoutUrl =
                    'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';

                  // Comportamento responsivo: nova aba desktop, mesma aba mobile
                  if (window.innerWidth >= 768) {
                    window.open(checkoutUrl, '_blank');
                  } else {
                    window.location.href = checkoutUrl;
                  }
                }}
                className="btn-impact mb-6 animate-delay-1"
              >
                <Sparkles size={24} />
                QUERO DESCOBRIR MEU ESTILO AGORA
                <ArrowRight size={24} />
              </button>

              {/* Trust Elements Melhorados */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg font-semibold">
                <div className="flex items-center gap-2 text-green-600">
                  <Shield size={20} />
                  <span>7 Dias de Garantia Total</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Lock size={20} />
                  <span>Pagamento 100% Seguro</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Antes vs Depois */}
        <section className="section-gap">
          <div className="container-main">
            <div className="card-impact animate-slide-up animate-delay-2">
              <h2
                className="text-hierarchy-2 text-center mb-8"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                <span style={{ color: '#ff6b6b' }}>ANTES</span> vs{' '}
                <span style={{ color: '#00c851' }}>DEPOIS</span>
              </h2>

              <div className="before-after">
                <div className="before-section">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Eye style={{ color: '#432818' }} size={24} />
                    SEM O QUIZ
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span style={{ color: '#432818' }}>✗</span>
                      <span>
                        <strong>Guarda-roupa cheio</strong> mas "nada para vestir"
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: '#432818' }}>✗</span>
                      <span>
                        <strong>Compras por impulso</strong> que nunca usa
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: '#432818' }}>✗</span>
                      <span>
                        <strong>Dinheiro desperdiçado</strong> em peças que não combinam
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span style={{ color: '#432818' }}>✗</span>
                      <span>
                        <strong>Baixa autoestima</strong> com a própria imagem
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="vs-element">VS</div>

                <div className="after-section">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Crown className="text-green-500" size={24} />
                    COM O QUIZ
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1 text-xl">✓</span>
                      <span>
                        <strong>Guarda-roupa funcional</strong> onde tudo combina
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1 text-xl">✓</span>
                      <span>
                        <strong>Compras inteligentes</strong> e certeiras
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1 text-xl">✓</span>
                      <span>
                        <strong>Economia de tempo e dinheiro</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1 text-xl">✓</span>
                      <span>
                        <strong>Confiança e autoestima</strong> em alta
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Dramático */}
        <section className="section-gap">
          <div className="container-main">
            <DramaticCountdown />
          </div>
        </section>

        {/* Valor com Preço Impactante */}
        <section className="section-gap">
          <div className="container-main">
            <div className="price-impact animate-slide-up animate-delay-3">
              <div className="price-badge">🔥 OFERTA RELÂMPAGO - 77% OFF</div>

              <h2 className="text-2xl font-bold mb-4">TRANSFORMAÇÃO COMPLETA</h2>

              <div className="grid-impact mb-6">
                <div className="text-center">
                  <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-2">📊 Quiz Personalizado</h3>
                    <p className="text-sm opacity-90">Descubra seu estilo único</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-2">📖 Guia Completo</h3>
                    <p className="text-sm opacity-90">Para seu estilo específico</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-2">🎁 Bônus Exclusivos</h3>
                    <p className="text-sm opacity-90">Peças-chave + Visagismo</p>
                  </div>
                </div>
              </div>

              <div className="price-original">De R$ 175,00</div>
              <div className="price-current">R$ 39,90</div>
              <p className="text-xl mb-6">
                ou <strong>5x de R$ 8,83</strong> sem juros
              </p>
              <p className="text-lg opacity-90">💰 Você economiza R$ 135,10</p>
            </div>
          </div>
        </section>

        {/* CTA Final Gigante */}
        <section className="section-gap">
          <div className="container-main text-center">
            <button
              onClick={() => {
                handleCtaClick('final_cta_v2', 'Garantir Transformação');
                const checkoutUrl =
                  'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';

                // Comportamento responsivo: nova aba desktop, mesma aba mobile
                if (window.innerWidth >= 768) {
                  window.open(checkoutUrl, '_blank');
                } else {
                  window.location.href = checkoutUrl;
                }
              }}
              className="btn-impact text-2xl py-6 px-8 animate-slide-up animate-delay-4"
            >
              <Target size={32} />
              GARANTIR MINHA TRANSFORMAÇÃO AGORA
              <Flame size={32} />
            </button>

            <div style={{ color: '#6B4F43' }}>
              ⚡ Acesso imediato • 🔒 Pagamento seguro • 🛡️ 7 dias de garantia
            </div>
          </div>
        </section>

        {/* FAQ Aprimorado */}
        <section className="section-gap">
          <div className="container-main">
            <div className="card-impact animate-slide-up animate-delay-4">
              <h2
                className="text-hierarchy-2 text-center mb-8"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Perguntas <span style={{ color: '#ff6b6b' }}>Frequentes</span>
              </h2>
              <FaqSectionAdvanced />
            </div>
          </div>
        </section>
      </main>

      {/* Popup de Prova Social */}
      <SocialProofPopup />
    </div>
  );
};

export default QuizOfferPageV2;
