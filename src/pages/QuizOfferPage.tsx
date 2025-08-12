import DynamicBlockRenderer from "@/components/DynamicBlockRenderer";
import FixedIntroImage from "@/components/ui/FixedIntroImage";
import { usePageConfig } from "@/hooks/usePageConfig";
import { trackButtonClick } from "@/utils/analytics";
import { preloadCriticalImages } from "@/utils/images/preloading";
import {
  ArrowRight,
  Award,
  ChevronRight,
  Clock,
  Lock,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Star,
} from "lucide-react";
import React, { useEffect, useState } from "react";

// CSS simplificado e otimizado
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
  
  :root {
    --primary: #B89B7A;
    --secondary: #432818;
    --accent: #aa6b5d;
    --background: #FFFBF7;
    --white: #ffffff;
    --text-dark: #432818;
    --text-medium: #6B4F43;
    --text-light: #8B7355;
    --success: #22c55e;
    --spacing: 2rem;
  }
  
  .container-main { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
  .section-gap { margin-bottom: 4rem; }
  .card-clean { 
    background: white; 
    border-radius: 16px; 
    padding: 2rem; 
    box-shadow: 0 4px 20px rgba(184, 155, 122, 0.1);
    border: 1px solid rgba(184, 155, 122, 0.1);
  }
  
  .btn-primary-clean {
    background: linear-gradient(135deg, var(--success) 0%, #16a34a 100%);
    color: white;
    font-weight: 700;
    border-radius: 12px;
    padding: 1rem 2rem;
    border: none;
    font-size: 1.125rem;
    transition: all 0.2s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-primary-clean:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
  }
  
  .text-hierarchy-1 { font-size: 3rem; font-weight: 700; line-height: 1.1; }
  .text-hierarchy-2 { font-size: 2rem; font-weight: 600; line-height: 1.2; }
  .text-hierarchy-3 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
  .text-body { font-size: 1.125rem; line-height: 1.6; }
  
  @media (max-width: 768px) {
    .container-main { padding: 0 1rem; }
    .section-gap { margin-bottom: 3rem; }
    .card-clean { padding: 1.5rem; }
    .text-hierarchy-1 { font-size: 2rem; }
    .text-hierarchy-2 { font-size: 1.5rem; }
    .btn-primary-clean { width: 100%; justify-content: center; padding: 1.25rem; }
  }
`;

// Constantes para otimização de imagens - URLs atualizadas
const HERO_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp";
const HERO_COMPLEMENTARY_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp";
const PROBLEM_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp";
const SOLUTION_QUIZ_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1746650306/oie_1_gcozz9.webp";
const GUIDES_BENEFITS_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp";
const GUIDES_BENEFITS_COMPLEMENTARY_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp";
const BONUS_1_KEY_PIECES_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911687/C%C3%B3pia_de_MOCKUPS_12_w8fwrn.webp";
const BONUS_1_KEY_PIECES_COMPLEMENTARY_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1745515075/Espanhol_Portugu%C3%AAs_1_uru4r3.webp";
const BONUS_2_VISAGISM_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp";
const BONUS_2_VISAGISM_COMPLEMENTARY_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp";
const MENTOR_GISELE_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.webp";
const TESTIMONIALS_RESULTS_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744916217/Mockups_p%C3%A1gina_de_venda_Guia_de_Estilo_1_vostj4.webp";
// Imagens de transformação reais da ResultPage
const TRANSFORMATION_REAL_IMAGE_1_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334756/ChatGPT_Image_4_de_mai._de_2025_01_42_42_jlugsc.webp";
const TRANSFORMATION_REAL_IMAGE_2_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp";
const TRANSFORMATION_REAL_IMAGE_3_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334753/ChatGPT_Image_4_de_mai._de_2025_01_30_01_vbiysd.webp";
const GUARANTEE_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744916216/C%C3%B3pia_de_01._P%C3%A1gina_-_Produto_de_Entrada_2_hamaox.webp";
const GUARANTEE_COMPLEMENTARY_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp";
const FAQ_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1745515862/Sem_nome_1000_x_1000_px_1280_x_720_px_vmqk3j.webp";

// Componente de estrelas para avaliações (mantido)
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} mr-0.5`}
        />
      ))}
    </div>
  );
};

// Componente de contagem regressiva melhorado (mantido)
const CountdownTimer = () => {
  const [time, setTime] = useState({
    hours: 1,
    minutes: 59,
    seconds: 59,
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
          return { hours: 1, minutes: 59, seconds: 59 }; // Reinicia
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <p className="text-[#432818] font-semibold mb-2 flex items-center">
        <Clock size={18} className="mr-1 text-[#B89B7A]" />
        Esta oferta expira em:
      </p>
      <div className="flex items-center justify-center gap-1">
        <div className="bg-[#432818] text-white px-3 py-2 rounded-md text-lg font-mono font-bold shadow-sm">
          {formatNumber(time.hours)}
        </div>
        <span className="text-[#B89B7A] font-bold text-xl">:</span>
        <div className="bg-[#432818] text-white px-3 py-2 rounded-md text-lg font-mono font-bold shadow-sm">
          {formatNumber(time.minutes)}
        </div>
        <span className="text-[#B89B7A] font-bold text-xl">:</span>
        <div className="bg-[#432818] text-white px-3 py-2 rounded-md text-lg font-mono font-bold shadow-sm">
          {formatNumber(time.seconds)}
        </div>
      </div>
    </div>
  );
};

// Componente FAQ (mantido)
const FaqSectionNew = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Quanto tempo leva para fazer o quiz?",
      answer:
        "O quiz leva apenas alguns minutos para ser completado. São perguntas simples e objetivas sobre suas preferências e estilo de vida.",
    },
    {
      question: "Como recebo os materiais após a compra?",
      answer:
        "Imediatamente após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso a todos os materiais.",
    },
    {
      question: "Os guias servem para qualquer tipo físico?",
      answer:
        "Sim! Os guias foram desenvolvidos considerando a diversidade de tipos físicos. O mais importante é o seu estilo predominante, e as orientações são adaptáveis para valorizar seu corpo único.",
    },
    {
      question: "Preciso ter conhecimento prévio sobre moda?",
      answer:
        "Não! Os guias foram criados justamente para quem quer aprender do zero ou aprimorar seus conhecimentos sobre estilo pessoal. Tudo é explicado de forma clara e didática.",
    },
    {
      question: "Posso acessar os materiais pelo celular?",
      answer:
        "Sim! Todos os materiais são digitais e podem ser acessados por qualquer dispositivo: computador, tablet ou smartphone.",
    },
    {
      question: "E se eu não gostar do conteúdo?",
      answer:
        "Você tem 7 dias de garantia incondicional. Se não ficar satisfeita, basta solicitar o reembolso e devolveremos 100% do seu investimento.",
    },
    {
      question: "Quanto tempo terei acesso aos materiais?",
      answer:
        "O acesso é vitalício! Você poderá consultar os guias sempre que precisar, sem prazo de expiração.",
    },
    {
      question: "Os guias funcionam para qualquer idade?",
      answer:
        "Absolutamente! Os princípios de estilo pessoal são atemporais e adaptáveis para mulheres de todas as idades. O importante é expressar sua essência, independente da sua fase de vida.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-[#432818] mb-8 text-center font-playfair">
        Perguntas Frequentes
      </h3>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-[#B89B7A]"
          >
            <button onClick={() => toggleItem(index)} style={{ backgroundColor: "#FAF9F7" }}>
              <span className="font-medium text-[#432818] text-lg">{item.question}</span>
              <ChevronRight
                size={24}
                className={`text-[#B89B7A] transition-transform duration-300 ${openItem === index ? "transform rotate-90" : ""}`}
              />
            </button>

            {openItem === index && <div style={{ color: "#6B4F43" }}>{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de título padronizado - SIMPLIFICADO
const SectionTitle: React.FC<{
  children: React.ReactNode;
  subtitle?: string;
  size?: "lg" | "xl";
  className?: string;
  variant?: "primary" | "secondary" | "simple";
}> = ({ children, subtitle, size = "xl", className = "", variant = "simple" }) => (
  <div className={`text-center mb-16 animate-fade-in-up ${className}`}>
    {/* Decoração superior - APENAS para títulos principais */}
    {variant === "primary" && (
      <div className="flex justify-center mb-4">
        <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
      </div>
    )}

    {/* Título principal - estilos diferenciados */}
    <h2
      className={`font-bold font-playfair leading-tight mb-6 ${
        variant === "primary"
          ? "text-4xl md:text-5xl lg:text-6xl text-brand-dark"
          : variant === "secondary"
            ? "text-3xl md:text-4xl lg:text-5xl text-brand-dark"
            : "text-3xl md:text-4xl font-bold text-brand-dark"
      }`}
    >
      {children}
    </h2>

    {/* Subtítulo opcional */}
    {subtitle && (
      <p className="text-xl text-brand-medium font-inter max-w-3xl mx-auto">{subtitle}</p>
    )}
  </div>
);

const QuizOfferPage: React.FC = () => {
  // Integração com o editor visual
  const { config: pageConfig, loading: configLoading } = usePageConfig("quiz-offer-page");

  const testimonials = [
    {
      rating: 5 as number,
      text: "Transformou completamente meu guarda-roupa!",
      author: "Maria Silva",
    },
    {
      rating: 5 as number,
      text: "Finalmente entendi meu estilo pessoal.",
      author: "Ana Costa",
    },
  ];

  const renderStars = (num: number) => {
    return Array.from({ length: 5 }, (_, index: number) => (
      <span key={index} className={index < num ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  const benefits = [
    "Análise personalizada do seu biotipo",
    "Guia completo de peças que valorizam seu corpo",
    "Consultoria de 1 hora com nossa especialista",
    "Acesso a materiais exclusivos",
  ].map((benefit, index: number) => (
    <li key={index} className="flex items-start space-x-3">
      <span className="text-[#B89B7A] text-xl">✓</span>
      <span>{benefit}</span>
    </li>
  ));

  useEffect(() => {
    // Inject custom styles
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
        MENTOR_GISELE_IMAGE_URL,
        TESTIMONIALS_RESULTS_IMAGE_URL,
        GUARANTEE_IMAGE_URL,
        FAQ_IMAGE_URL,
      ],
      { quality: 95 }
    );

    if (typeof window !== "undefined" && "performance" in window) {
      window.performance.mark("offer-page-mounted");
    }

    return () => {
      // Cleanup
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleCtaClick = (buttonId: string, action: string = "Comprar Agora") => {
    trackButtonClick(buttonId, action, "quiz_offer_page");
  };

  /**
   * Renderiza um componente com configurações do editor se disponível,
   * caso contrário renderiza o componente original
   */
  const renderConfigurableComponent = (blockId: string, originalComponent: React.ReactNode) => {
    if (pageConfig && !configLoading) {
      return (
        <DynamicBlockRenderer
          pageId="quiz-offer-page"
          blockId={blockId}
          fallback={originalComponent}
        />
      );
    }
    return originalComponent;
  };

  // Editor integration placeholder
  useEffect(() => {
    if (pageConfig && !configLoading) {
      // Apply editor styles if available
      console.log("Page config loaded:", pageConfig);
    }
  }, [pageConfig, configLoading]);

  return (
    <div
      className="min-h-screen bg-[var(--background)]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Header limpo */}
      <header className="py-4 px-6 sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="container-main flex justify-center">
          <FixedIntroImage
            src={HERO_IMAGE_URL}
            alt="Logo Gisele Galvão"
            width={180}
            height={80}
            className="h-auto object-contain"
          />
        </div>
      </header>

      <main>
        {/* 1. Hero Section - LIMPO E FOCADO */}
        <section className="section-gap pt-8">
          <div className="container-main">
            <div className="card-clean text-center">
              {/* Badge credibilidade */}
              <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 mb-6">
                <Award size={18} className="text-green-600" />
                <span style={{ color: "#6B4F43" }}>3000+ mulheres transformadas</span>
              </div>

              {/* Headline simplificada - DADOS REAIS ETAPA 21 */}
              <h1
                className="text-hierarchy-1 text-[var(--text-dark)] mb-6"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Etapa 21: <span className="text-[var(--primary)]">Oferta Exclusiva</span>
                <br />
                Para Seu Estilo!
              </h1>

              {/* Subheadline focada - BASEADA NO RESULTADO DO QUIZ */}
              <p className="text-body text-[var(--text-medium)] mb-8 max-w-2xl mx-auto">
                Leve sua transformação de estilo para o próximo nível com nosso{" "}
                <strong>Guia Completo personalizado</strong> para seu resultado
              </p>

              {/* Hero image otimizada */}
              <div className="mb-8 max-w-lg mx-auto">
                <FixedIntroImage
                  src={HERO_COMPLEMENTARY_IMAGE_URL}
                  alt="Transformação de guarda-roupa"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>

              {/* CTA principal único - TEXTO REAL DA ETAPA 21 */}
              <button
                onClick={() => {
                  handleCtaClick("hero_cta", "Sim! Quero Garantir Meu Acesso");
                  window.open(
                    "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
                    "_blank"
                  );
                }}
                className="btn-primary-clean mb-6"
              >
                <ArrowRight size={20} />
                Sim! Quero Garantir Meu Acesso
              </button>

              {/* Trust elements simples */}
              <div className="flex items-center justify-center gap-6 text-sm text-[var(--text-light)]">
                <div className="flex items-center gap-1">
                  <Lock size={16} className="text-green-600" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={16} className="text-green-600" />
                  <span>7 Dias Garantia</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Problema - SIMPLIFICADO */}
        <section className="section-gap">
          <div className="container-main">
            <div className="card-clean">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2
                    className="text-hierarchy-2 text-[var(--text-dark)] mb-6"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Você se identifica com isso?
                  </h2>
                  <div className="space-y-4 text-body text-[var(--text-medium)]">
                    <p>
                      <strong>Guarda-roupa cheio</strong> mas nunca tem o que vestir?
                    </p>
                    <p>
                      <strong>Compra peças</strong> que nunca combinam com nada?
                    </p>
                    <p>
                      <strong>Sente que "nada fica bom"</strong> em você?
                    </p>
                  </div>
                  <div className="bg-[#B89B7A]/10 p-4 rounded-lg border-l-4 border-orange-400 mt-6">
                    <p className="text-[var(--text-dark)] font-semibold">
                      Isso acontece porque você ainda não descobriu seu{" "}
                      <strong>estilo predominante</strong>.
                    </p>
                  </div>
                </div>
                <div>
                  <FixedIntroImage
                    src={PROBLEM_IMAGE_URL}
                    alt="Frustração com guarda-roupa"
                    width={500}
                    height={350}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Solução - DIRETO AO PONTO */}
        <section className="section-gap">
          <div className="container-main">
            <div className="card-clean text-center">
              <h2
                className="text-hierarchy-2 text-[var(--text-dark)] mb-6"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                A Solução: Quiz de Estilo
              </h2>

              <div className="max-w-md mx-auto mb-8">
                <FixedIntroImage
                  src={SOLUTION_QUIZ_IMAGE_URL}
                  alt="Quiz de Estilo"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>

              <p className="text-body text-[var(--text-medium)] mb-8 max-w-2xl mx-auto">
                Método preciso para identificar seu estilo entre os{" "}
                <strong>7 estilos universais</strong> + guia personalizado completo.
              </p>

              <button
                onClick={() => {
                  handleCtaClick("solution_cta", "Fazer Quiz");
                  window.open(
                    "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
                    "_blank"
                  );
                }}
                className="btn-primary-clean mb-6"
              >
                <ShoppingBag size={20} />
                Fazer o Quiz Agora
              </button>

              <CountdownTimer />
            </div>
          </div>
        </section>

        {/* 4. Valor - PREÇO DESTACADO */}
        <section className="section-gap">
          <div className="container-main">
            <div className="card-clean">
              <div className="text-center mb-8">
                <h2
                  className="text-hierarchy-2 text-[var(--text-dark)] mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Transformação Completa
                </h2>
                <p className="text-body text-[var(--text-medium)]">
                  Tudo que você precisa para descobrir e aplicar seu estilo
                </p>
              </div>

              {/* Preview produtos */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="aspect-[4/5] bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                    <FixedIntroImage
                      src={GUIDES_BENEFITS_IMAGE_URL}
                      alt="Guia Personalizado"
                      width={250}
                      height={312}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-hierarchy-3 text-[var(--text-dark)] mb-2">
                    Guia Personalizado
                  </h3>
                  <p className="text-sm text-[var(--text-medium)]">Para seu estilo específico</p>
                </div>
                <div className="text-center">
                  <div className="aspect-[4/5] bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                    <FixedIntroImage
                      src={BONUS_1_KEY_PIECES_IMAGE_URL}
                      alt="Bônus Peças-Chave"
                      width={250}
                      height={312}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-hierarchy-3 text-[var(--text-dark)] mb-2">
                    Bônus: Peças-Chave
                  </h3>
                  <p className="text-sm text-[var(--text-medium)]">Guarda-roupa funcional</p>
                </div>
                <div className="text-center">
                  <div className="aspect-[4/5] bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                    <FixedIntroImage
                      src={BONUS_2_VISAGISM_IMAGE_URL}
                      alt="Bônus Visagismo"
                      width={250}
                      height={312}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-hierarchy-3 text-[var(--text-dark)] mb-2">
                    Bônus: Visagismo
                  </h3>
                  <p className="text-sm text-[var(--text-medium)]">Valorize seus traços</p>
                </div>
              </div>

              {/* Preço FOCADO */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center mb-8">
                <p className="text-sm opacity-90 mb-2">Oferta por tempo limitado</p>
                <div className="mb-4">
                  <span className="text-sm">5x de</span>
                  <span className="text-4xl font-bold mx-2">R$ 8,83</span>
                </div>
                <p className="text-lg">
                  ou à vista <strong>R$ 39,90</strong>
                </p>
                <p className="text-sm mt-2 opacity-75">77% OFF - Economia de R$ 135,10</p>
              </div>

              {/* CTA Final */}
              <div className="text-center">
                <button
                  onClick={() => {
                    handleCtaClick("final_cta", "Garantir Transformação");
                    window.open(
                      "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
                      "_blank"
                    );
                  }}
                  className="btn-primary-clean"
                >
                  <ShoppingCart size={20} />
                  Garantir Minha Transformação
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Garantia - SIMPLES */}
        <section className="section-gap">
          <div className="container-main">
            <div className="card-clean text-center">
              <FixedIntroImage
                src={GUARANTEE_IMAGE_URL}
                alt="Garantia 7 dias"
                width={200}
                height={200}
                className="mx-auto mb-6"
              />
              <h2
                className="text-hierarchy-2 text-[var(--text-dark)] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                7 Dias de Garantia
              </h2>
              <p className="text-body text-[var(--text-medium)] max-w-2xl mx-auto">
                Se não ficar satisfeita, devolvemos <strong>100% do seu dinheiro</strong>. Sem
                perguntas.
              </p>
            </div>
          </div>
        </section>

        {/* 6. FAQ - COMPACTO */}
        <section className="section-gap">
          <div className="container-main">
            <div className="card-clean">
              <h2
                className="text-hierarchy-2 text-[var(--text-dark)] text-center mb-8"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Perguntas Frequentes
              </h2>
              <FaqSectionNew />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default QuizOfferPage;
