import React, { useEffect, useState } from "react";
import { preloadCriticalImages } from "@/utils/images/preloading";
import FixedIntroImage from "@/components/ui/FixedIntroImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MentorSection from "@/components/result/MentorSection";
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
} from "lucide-react";
import { trackButtonClick } from "@/utils/analytics";
import { storeUserForHotmart } from "@/utils/hotmartWebhook";

// CSS aprimorado para versão B - mais persuasivo e dinâmico
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');
  
  :root {
    --primary: #B89B7A;
    --secondary: #432818;
    --accent: #aa6b5d;
    --background: #FFFBF7;
    --white: #ffffff;
    --text-dark: #432818;
    --text-medium: #6B4F43;
    --text-light: #8B7355;
    --brand-light: #D4C4B0;
    --brand-gradient: linear-gradient(135deg, #B89B7A 0%, #aa6b5d 100%);
    --urgency-gradient: linear-gradient(135deg, #B89B7A 0%, #8B6F4D 100%);
    --success-final: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    --shadow-sm: 0 2px 8px rgba(184, 155, 122, 0.08);
    --shadow-md: 0 4px 20px rgba(184, 155, 122, 0.12);
    --shadow-lg: 0 8px 32px rgba(184, 155, 122, 0.16);
    --shadow-brand: 0 8px 24px rgba(184, 155, 122, 0.4);
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
    background: var(--brand-gradient);
  }
  
  /* Botões mais impactantes - Paleta da marca */
  .btn-impact {
    background: var(--brand-gradient);
    color: white;
    padding: 1.5rem 3rem;
    border-radius: 16px;
    border: none;
    font-weight: 700;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-brand);
  }
  
  /* Botão CTA Final - Verde estratégico */
  .btn-final {
    background: var(--success-final);
    color: white;
    padding: 1.75rem 3.5rem;
    border-radius: 20px;
    border: none;
    font-weight: 800;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
    animation: pulse-success 2s infinite;
  }
  
  @keyframes pulse-success {
    0%, 100% { 
      box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 12px 40px rgba(34, 197, 94, 0.6);
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
  
  /* Elementos de Urgência - Paleta da marca */
  .urgency-banner {
    background: var(--urgency-gradient);
    color: white;
    padding: 1rem;
    border-radius: 16px;
    text-align: center;
    font-weight: 700;
    margin-bottom: 2rem;
    animation: urgent-pulse 1.5s infinite;
    box-shadow: var(--shadow-brand);
  }
  
  @keyframes urgent-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  /* Prova Social com cores da marca */
  .social-proof {
    background: var(--brand-gradient);
    color: white;
    padding: 1.5rem;
    border-radius: 20px;
    text-align: center;
    margin: 2rem 0;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-brand);
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
  
  /* Countdown mais dramático - cores da marca */
  .countdown-dramatic {
    background: linear-gradient(135deg, #432818 0%, #6B4F43 100%);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    margin: 2rem 0;
    border: 3px solid #B89B7A;
    box-shadow: 0 0 30px rgba(184, 155, 122, 0.5);
  }
  
  .countdown-numbers {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .countdown-item {
    background: #B89B7A;
    color: white;
    padding: 1rem;
    border-radius: 12px;
    min-width: 80px;
    font-weight: 800;
    font-size: 1.5rem;
    box-shadow: 0 4px 16px rgba(184, 155, 122, 0.4);
  }
  
  /* Preço com cores da marca */
  .price-impact {
    background: var(--brand-gradient);
    color: white;
    padding: 2.5rem;
    border-radius: 24px;
    text-align: center;
    margin: 2rem 0;
    box-shadow: var(--shadow-brand);
    border: 3px solid rgba(255, 255, 255, 0.2);
    position: relative;
  }
  
  .price-badge {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    background: #B89B7A;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 25px;
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 4px 16px rgba(184, 155, 122, 0.4);
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
    background: var(--brand-gradient);
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    items-center: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.25rem;
    box-shadow: var(--shadow-brand);
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
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp";
const HERO_COMPLEMENTARY_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.jpg";
const PROBLEM_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_9_mgkdnb.webp";
const SOLUTION_QUIZ_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744921098/Espanhol_Portugu%C3%AAs_5_cptzyb.webp";
const GUIDES_BENEFITS_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp";
const BONUS_1_KEY_PIECES_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744921227/Espanhol_Portugu%C3%AAs_6_y4kqao.webp";
const BONUS_2_VISAGISM_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744921365/Espanhol_Portugu%C3%AAs_7_eqgdqz.webp";
const GUARANTEE_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744921750/Garantia_7_dias_j8mxth.webp";

// Dados para as seções da página
const painPoints = [
  {
    icon: Heart,
    title: "Problemas de autoestima",
    description: "Você se sente insegura com sua imagem e não sabe como melhorar",
  },
  {
    icon: ShoppingBag,
    title: "Compras sem direção",
    description: "Gasta dinheiro em roupas que não combinam com você",
  },
  {
    icon: Clock,
    title: "Perda de tempo",
    description: "Demora horas para se arrumar e ainda não fica satisfeita",
  },
];

const benefits = [
  {
    icon: Crown,
    title: "Descobrir seu estilo único",
    description: "Identifique qual estilo combina perfeitamente com sua personalidade",
  },
  {
    icon: Target,
    title: "Compras estratégicas",
    description: "Saiba exatamente o que comprar para valorizar sua beleza",
  },
  {
    icon: Sparkles,
    title: "Confiança renovada",
    description: "Sinta-se linda e confiante todos os dias",
  },
];

const realTestimonials = [
  {
    name: "Mariangela",
    author: "Mariangela, Engenheira",
    text: "Antes, a roupa me vestia. Hoje, eu me visto de propósito. A consultoria me fez dar vida à mulher que sempre existiu em mim.",
    rating: 5,
    location: "Engenheira",
  },
  {
    name: "Patrícia Paranhos",
    author: "Patrícia Paranhos, Advogada",
    text: "Aprendi a me valorizar e a dar valor para a imagem que transmito. As pessoas começaram a me olhar diferente — porque eu estava diferente.",
    rating: 5,
    location: "Advogada",
  },
  {
    name: "Sônia Spier",
    author: "Sônia Spier, Terapeuta",
    text: "A Gisele me ensinou a entender o que comunico com as roupas. Hoje compro com consciência, estilo e propósito.",
    rating: 5,
    location: "Terapeuta",
  },
];

// Função para lidar com cliques em CTAs
const handleCTAClick = (buttonId: string, action: string = "Comprar Agora") => {
  return (event: React.MouseEvent) => {
    event.preventDefault();
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    trackButtonClick(buttonId, action, "quiz_offer_page");

    if (emailInput?.value) {
      storeUserForHotmart(emailInput.value, {
        funnel_step: "quiz_offer_checkout",
        page_url: window.location.href,
      });
    }

    // Redirecionar para checkout
    const checkoutUrl =
      "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912&utm_source=quiz&utm_medium=abtest&utm_campaign=testeB";

    if (window.innerWidth >= 768) {
      window.open(checkoutUrl, "_blank");
    } else {
      window.location.href = checkoutUrl;
    }
  };
};

// Componente de Popup de Prova Social Dinâmica
const SocialProofPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  const users = [
    "Ana Carolina acabou de comprar",
    "Maria Silva descobriu seu estilo",
    "Juliana Santos transformou seu guarda-roupa",
    "Fernanda Costa está encantada",
    "Camila Oliveira recomenda",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUser(users[Math.floor(Math.random() * users.length)]);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 4000);
    }, 8000);

    return () => clearInterval(interval);
  }, [users]);

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
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
          className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
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

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

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
      question: "É realmente possível descobrir meu estilo em 5 minutos?",
      answer:
        "Sim! Nosso quiz foi desenvolvido com base em anos de experiência e metodologia científica. Em poucos minutos, você terá uma análise precisa do seu estilo predominante entre os 7 estilos universais.",
    },
    {
      question: "O que acontece se eu não gostar do resultado?",
      answer:
        "Oferecemos 7 dias de garantia total. Se não ficar satisfeita, devolvemos 100% do seu dinheiro sem perguntas. Sua satisfação é nossa prioridade.",
    },
    {
      question: "Quanto tempo terei acesso aos materiais?",
      answer:
        "O acesso é vitalício! Você poderá baixar todos os materiais e consultá-los sempre que precisar, sem prazo de expiração.",
    },
    {
      question: "Funciona para todas as idades e tipos de corpo?",
      answer:
        "Absolutamente! Nosso método é universal e funciona para mulheres de todas as idades, tipos de corpo e estilos de vida. O importante é descobrir e expressar sua essência única.",
    },
    {
      question: "Como recebo os materiais após a compra?",
      answer:
        "Logo após a confirmação do pagamento, você recebe um email com o link de acesso à área exclusiva onde poderá fazer o quiz e baixar todos os materiais imediatamente.",
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
                  openItem === index ? "transform rotate-90" : ""
                }`}
              />
            </button>

            {openItem === index && <div style={{ color: "#6B4F43" }}>{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const DescubraSeuEstilo: React.FC = () => {
  useEffect(() => {
    const styleElement = document.createElement("style");
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

    if (typeof window !== "undefined" && "performance" in window) {
      window.performance.mark("offer-page-v2-mounted");
    }

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Hero Section */}
      <section className="py-8 md:py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Mobile: Text first, Desktop: Text left */}
            <div className="order-1 md:order-1 space-y-6">
              <div className="text-center md:text-left mb-6">
                <img
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                  alt="Gisele Galvão - Logo da Marca"
                  className="h-12 md:h-16 mx-auto md:mx-0 mb-4"
                />
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-[#432818] text-center md:text-left leading-tight">
                <span style={{ color: "#B89B7A", fontWeight: 700 }}>Chega</span> de um guarda-roupa
                lotado e da sensação de que{" "}
                <span style={{ color: "#B89B7A", fontWeight: 700 }}>nada combina com você.</span>
              </h1>

              <p className="text-lg md:text-xl text-[#8F7A6A] text-center md:text-left">
                Em poucos minutos, descubra seu{" "}
                <strong style={{ color: "#B89B7A" }}>Estilo Predominante</strong> — e aprenda a
                montar looks que realmente refletem sua essência, com praticidade e confiança.
              </p>

              <div className="flex justify-center md:justify-start">
                <Button
                  onClick={() => (window.location.href = "/editor-fixed")}
                  size="lg"
                  className="bg-[#B89B7A] hover:bg-[#A68A6A] text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="hidden md:inline">Quero Descobrir meu Estilo Agora!</span>
                  <span className="md:hidden">Iniciar Quiz</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile: Image second, Desktop: Image right */}
            <div className="order-2 md:order-2 relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.jpg"
                  alt="Mulher descobrindo seu estilo autêntico"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema/Dor Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-6">
              Você Reconhece Esses Problemas?
            </h2>
            <p className="text-lg text-[#8F7A6A] max-w-4xl mx-auto">
              Armário cheio, mas nada para vestir? Você não está sozinha.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {painPoints.map((point, index) => (
              <Card
                key={index}
                className="border-[#B89B7A]/20 hover:shadow-lg transition-shadow duration-300 rounded-lg"
              >
                <CardContent className="p-6 text-center flex flex-col items-center">
                  <point.icon className="w-8 h-8 text-[#B89B7A] mb-4" />
                  <h3 className="text-base md:text-lg font-semibold text-[#432818] mb-2 mt-4">
                    {point.title}
                  </h3>
                  <p className="text-[#8F7A6A] text-sm">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-lg text-[#8F7A6A] italic max-w-4xl mx-auto">
              A solução está em descobrir seu estilo autêntico. Com essa clareza, você criará um
              guarda-roupa harmonioso que expressa verdadeiramente quem você é.
            </p>
          </div>
        </div>
      </section>

      {/* Mentora Section */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <MentorSection />
        </div>
      </section>

      {/* Solução Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-6">
              Seu Guia Completo Para um Estilo Autêntico
            </h2>
            <p className="text-lg text-[#8F7A6A] max-w-4xl mx-auto mb-8"></p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1746650306/oie_1_gcozz9.webp"
                alt="Qual é o Seu Estilo - Quiz Completo"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
                alt="Mockup completo com bônus"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#B89B7A]/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#432818] mb-4">
                  Quiz de Estilo Personalizado
                </h3>
                <p className="text-[#8F7A6A]">
                  Um método preciso que analisa suas preferências reais e identifica seu estilo
                  predominante entre os 8 estilos universais.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#B89B7A]/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#432818] mb-4">
                  Guia de Imagem e Estilo
                </h3>
                <p className="text-[#8F7A6A]">
                  Específico para o seu resultado no Quiz, com orientações práticas para valorizar e
                  expressar sua personalidade.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#B89B7A]/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#432818] mb-4">Bônus Exclusivos</h3>
                <p className="text-[#8F7A6A]">
                  Guia das Peças-Chave do Guarda-Roupa de Sucesso e Guia de Visagismo Facial para
                  complementar sua transformação.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-[#F9F7F4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-6">
              Transformações que Você Experimentará
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp"
                alt="Mockup tablet com guia de imagem e estilo"
                className="w-full rounded-lg shadow-lg object-cover h-auto"
              />
            </div>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#B89B7A] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[#432818] text-base md:text-lg font-semibold">
                      {benefit.title}
                    </h4>
                    <p className="text-[#8F7A6A] text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-[#8F7A6A] max-w-4xl mx-auto italic">
            Com o nosso método, você não apenas descobrirá seu estilo, mas também aprenderá a usá-lo
            como uma ferramenta poderosa para expressar sua autenticidade e aumentar sua confiança.
          </p>
        </div>
      </section>

      {/* Bônus Sections */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-6">
              Bônus Especiais Inclusos
            </h2>
          </div>

          {/* Bônus 1 */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h3 className="text-xl font-semibold text-[#432818] mb-4">
                Bônus 1: Peças-Chave do Guarda-Roupa de Sucesso
              </h3>
              <p className="text-[#8F7A6A] mb-4">
                Um manual completo para construir um armário funcional, versátil e alinhado com sua
                identidade.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#B89B7A]" />
                  <span className="text-sm text-[#432818]">
                    Peças essenciais que toda mulher deveria ter
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#B89B7A]" />
                  <span className="text-sm text-[#432818]">
                    Como adaptar ao seu estilo predominante
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#B89B7A]" />
                  <span className="text-sm text-[#432818]">
                    Estratégias para maximizar combinações
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911687/C%C3%B3pia_de_MOCKUPS_12_w8fwrn.webp"
                alt="Guia das Peças-Chave"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Bônus 2 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp"
                alt="Guia de Visagismo Facial"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-xl font-semibold text-[#432818] mb-4">
                Bônus 2: Guia de Visagismo Facial
              </h3>
              <p className="text-[#8F7A6A] mb-4">
                Uma ferramenta poderosa para valorizar seus traços naturais e potencializar sua
                beleza única.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#B89B7A]" />
                  <span className="text-sm text-[#432818]">
                    Como identificar o formato do seu rosto
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#B89B7A]" />
                  <span className="text-sm text-[#432818]">
                    Acessórios e Cortes de cabelo que valorizam seus traços
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#B89B7A]" />
                  <span className="text-sm text-[#432818]">
                    Maquiagem que harmoniza com seu estilo
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos Reais */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-[#F9F7F4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-6">
              Depoimentos de mulheres que já viveram essa transformação:
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {realTestimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-[#B89B7A]/20 hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <p className="font-medium text-[#432818]">{testimonial.author}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-[#B89B7A] text-[#B89B7A]" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#8F7A6A] italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Garantia e CTA Final */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#F9F7F4] rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Shield className="h-12 w-12 text-[#B89B7A]" />
              <div>
                <h3 className="text-xl font-semibold text-[#432818]">Garantia de 7 Dias</h3>
                <p className="text-[#8F7A6A]">100% do seu dinheiro de volta</p>
              </div>
            </div>
            <p className="text-[#8F7A6A]">
              Estou tão confiante de que estes materiais vão transformar sua relação com a sua
              imagem pessoal que ofereço uma garantia incondicional de 7 dias.
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#B89B7A] to-[#A68A6A] rounded-2xl p-8 text-white mb-8">
            <h3 className="text-2xl font-playfair mb-4">Investimento Único</h3>
            <div className="text-center mb-6">
              <span className="text-4xl font-bold">R$ 39,00</span>
              <p className="text-white/80">à vista ou 5x de R$ 8,83</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-left mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Quiz de Estilo Personalizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Guia de Imagem e Estilo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Guia das Peças-Chave</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Guia de Visagismo Facial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Compra segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Garantia de 7 dias</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCTAClick("final-cta", "Quero Transformar Minha Imagem")}
            size="lg"
            className="bg-[#B89B7A] hover:bg-[#A68A6A] text-white px-8 py-4 text-xl font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 w-full md:w-auto"
          >
            <span className="hidden md:inline">Quero Descobrir Meu Estilo!</span>
            <span className="md:hidden">Descobrir Meu Estilo!</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-sm text-[#8F7A6A] mt-4">
            Pense bem: quanto você já gastou com roupas que nunca usou? Este investimento em
            autoconhecimento vai muito além de roupas - é um investimento em você mesma.
          </p>
        </div>
      </section>
    </div>
  );
};

export default DescubraSeuEstilo;
