import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock,
  Gift,
  Heart,
  Lock,
  Shield,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

// Configuração de URLs das imagens
const HERO_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_240/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp';
const HERO_COMPLEMENTARY_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_700/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp';
const PROBLEM_IMAGE_ALT_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_500/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp';
const SOLUTION_QUIZ_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_600/v1746650306/oie_1_gcozz9.webp';
const GUIDES_BENEFITS_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_500/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp';
const GUIDES_BENEFITS_COMPLEMENTARY_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_600/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp';
const BONUS_1_KEY_PIECES_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_500/v1744911687/C%C3%B3pia_de_MOCKUPS_12_w8fwrn.webp';
const BONUS_1_KEY_PIECES_COMPLEMENTARY_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_600/v1745515075/Espanhol_Portugu%C3%AAs_1_uru4r3.webp';
const BONUS_2_VISAGISM_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_500/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp';
const BONUS_2_VISAGISM_COMPLEMENTARY_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_600/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp';
const MENTOR_GISELE_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_250,h_250,c_fill,g_face/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.webp';
const TESTIMONIALS_RESULTS_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_800/v1744916217/Mockups_p%C3%A1gina_de_venda_Guia_de_Estilo_1_vostj4.webp';
const TESTIMONIALS_RESULTS_COMPLEMENTARY_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_700/v1745521117/Captura_de_tela_2025-03-31_034324_qxvdho.webp';
const BEFORE_AFTER_IMAGE_1_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_300,h_300,c_fill/v1746334756/ChatGPT_Image_4_de_mai._de_2025_01_42_42_jlugsc.webp';
const BEFORE_AFTER_IMAGE_2_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_300,h_300,c_fill/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp';
const BEFORE_AFTER_IMAGE_3_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_300,h_300,c_fill/v1746334753/ChatGPT_Image_4_de_mai._de_2025_01_30_01_vbiysd.webp';
const GUARANTEE_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_250/v1744916216/C%C3%B3pia_de_01._P%C3%A1gina_-_Produto_de_Entrada_2_hamaox.webp';
const GUARANTEE_COMPLEMENTARY_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_600/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp';
const FAQ_IMAGE_URL =
  'https://res.cloudinary.com/dqljyf76t/image/upload/q_auto,f_auto,w_500/v1745515862/Sem_nome_1000_x_1000_px_1280_x_720_px_vmqk3j.webp';

// Componente de imagem melhorado
interface FixedIntroImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  isCritical?: boolean;
  wrapperClassName?: string;
}

const FixedIntroImage: React.FC<FixedIntroImageProps> = ({
  src,
  alt = 'Imagem descritiva',
  width,
  height,
  className = '',
  imgClassName = '',
  isCritical = false,
  wrapperClassName = '',
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const placeholderW = width || 200;
    const placeholderH = height || 200;
    target.src = `https://placehold.co/${placeholderW}x${placeholderH}/F4E9DD/432818?text=Imagem+Indispon%C3%ADvel&font=playfairdisplay`;
  };

  return (
    <div className={`relative ${wrapperClassName}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-auto object-cover ${imgClassName} ${className}`}
        loading={isCritical ? 'eager' : 'lazy'}
        decoding="async"
        onError={handleError}
      />
    </div>
  );
};

// Indicador de usuários ativos
const ActiveUsersIndicator: React.FC = () => {
  const [activeCustomers, setActiveCustomers] = useState(312);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCustomers(prev =>
        Math.max(300, Math.min(350, prev + (Math.floor(Math.random() * 5) - 2)))
      );
    }, 13000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm text-purple-800 shadow-lg">
      <Heart size={16} style={{ color: '#B89B7A' }} />
      <span className="font-semibold">+{activeCustomers} Clientes Felizes</span>
      <span className="ml-1 hidden sm:inline">Transformaram Seus Estilos!</span>
    </div>
  );
};

// Timer de contagem regressiva
const CountdownTimer: React.FC = () => {
  const [time, setTime] = useState({ h: 1, m: 59, s: 59 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 1, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center my-5">
      <p className="text-brand-dark font-semibold mb-2.5 flex items-center text-sm sm:text-base">
        <Clock size={18} className="mr-1.5 text-brand-accent" />
        Esta oferta expira em:
      </p>
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
        {(['h', 'm', 's'] as const).map((unit, i) => (
          <React.Fragment key={unit}>
            <div className="bg-brand-dark text-white px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg text-base sm:text-lg font-mono font-bold shadow-md">
              {format(time[unit])}
            </div>
            {i < 2 && <span className="text-brand-accent font-bold text-lg sm:text-xl">:</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Notificação de vagas limitadas
const LimitedSpotsNotification: React.FC = () => {
  const [spotsFilled, setSpotsFilled] = useState(86);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsFilled(prev => Math.min(98, Math.max(70, prev + Math.floor(Math.random() * 3) - 1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-light border border-orange-400 rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between w-full max-w-md text-xs sm:text-sm shadow-md">
      <div className="flex items-center mb-2 sm:mb-0">
        <TrendingUp size={20} className="text-[#B89B7A] mr-2" />
        <div>
          <p className="font-semibold text-orange-800">Vagas limitadas para hoje!</p>
          <p className="text-[#A38A69]">Apenas {100 - spotsFilled} vagas restantes</p>
        </div>
      </div>
      <div className="h-2.5 w-full sm:w-32 bg-gray-300 rounded-full overflow-hidden mt-1.5 sm:mt-0">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${spotsFilled}%` }}
        />
      </div>
    </div>
  );
};

// Seção de FAQ
const FaqSectionNew: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems = [
    {
      q: 'Quanto tempo leva para fazer o quiz?',
      a: 'O quiz leva apenas alguns minutos para ser completado. São perguntas simples e objetivas sobre suas preferências e estilo de vida.',
    },
    {
      q: 'Como recebo os materiais após a compra?',
      a: 'Imediatamente após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso a todos os materiais.',
    },
    {
      q: 'Os guias servem para qualquer tipo físico?',
      a: 'Sim! Os guias foram desenvolvidos considerando a diversidade de tipos físicos. O mais importante é o seu estilo predominante, e as orientações são adaptáveis para valorizar seu corpo único.',
    },
    {
      q: 'Preciso ter conhecimento prévio sobre moda?',
      a: 'Não! Os guias foram criados justamente para quem quer aprender do zero ou aprimorar seus conhecimentos sobre estilo pessoal. Tudo é explicado de forma clara e didática.',
    },
    {
      q: 'Posso acessar os materiais pelo celular?',
      a: 'Sim! Todos os materiais são digitais e podem ser acessados por qualquer dispositivo: computador, tablet ou smartphone.',
    },
    {
      q: 'E se eu não gostar do conteúdo?',
      a: 'Você tem 7 dias de garantia incondicional. Se não ficar satisfeita, basta solicitar o reembolso e devolveremos 100% do seu investimento.',
    },
    {
      q: 'Quanto tempo terei acesso aos materiais?',
      a: 'O acesso é vitalício! Você poderá consultar os guias sempre que precisar, sem prazo de expiração.',
    },
    {
      q: 'Os guias funcionam para qualquer idade?',
      a: 'Absolutamente! Os princípios de estilo pessoal são atemporais e adaptáveis para mulheres de todas as idades. O importante é expressar sua essência, independente da sua fase de vida.',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="font-playfair text-brand-dark mb-10 text-center">Perguntas Frequentes</h3>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-brand-accent card-hover-effect"
          >
            <button
              onClick={() => setOpenItem(openItem === index ? null : index)}
              style={{ backgroundColor: '#FAF9F7' }}
            >
              <span className="font-semibold text-brand-dark text-base sm:text-lg">{item.q}</span>
              <ChevronRight
                size={22}
                className={`text-brand-accent transition-transform duration-300 ${openItem === index ? 'transform rotate-90' : ''}`}
              />
            </button>
            {openItem === index && <div style={{ borderColor: '#E5DDD5' }}>{item.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Wrapper de seção
interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  bgClassName?: string;
  id?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className = '',
  bgClassName = 'bg-brand-lighter',
  id,
}) => (
  <section
    id={id}
    className={`py-14 sm:py-20 px-4 md:px-6 lg:px-8 fade-in-section ${bgClassName} ${className}`}
  >
    <div className="container mx-auto max-w-5xl">{children}</div>
  </section>
);

// Componente principal da página
const PreviewQuizOfferPage: React.FC = () => {
  // Função para rastreamento de cliques (mock)
  const trackButtonClick = useCallback((buttonId: string, action: string, page: string) => {
    console.log('Rastreando clique (mock):', { buttonId, action, page });
  }, []);

  // Função para lidar com cliques no CTA
  const handleCtaClick = useCallback(
    (buttonId: string, action = 'Comprar Agora') => {
      trackButtonClick(buttonId, action, 'quiz_offer_page');
      window.open('https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912', '_blank');
    },
    [trackButtonClick]
  );

  // Preload de imagens críticas
  useEffect(() => {
    const preloadCriticalImages = (imageUrls: string[]) => {
      imageUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      });
    };

    preloadCriticalImages([HERO_IMAGE_URL, HERO_COMPLEMENTARY_IMAGE_URL]);
  }, []);

  const VALOR_PRODUTO = '47,00';

  const benefitsList = [
    {
      icon: BadgeCheck,
      title: 'Autoconhecimento profundo:',
      text: 'Entenda como sua personalidade, valores e essência se refletem no seu estilo. Lembre-se: 55% da comunicação é visual!',
    },
    {
      icon: BadgeCheck,
      title: 'Orientações práticas:',
      text: 'Descubra cores, tecidos, estampas e modelagens que valorizam seu tipo físico e estilo. Peças que combinam e multiplicam looks.',
    },
    {
      icon: BadgeCheck,
      title: 'Estratégias de imagem:',
      text: 'Comunique visualmente quem você é. Use sua imagem para transmitir seus valores e personalidade em qualquer ambiente.',
    },
    {
      icon: BadgeCheck,
      title: 'Dicas de composição:',
      text: 'Monte looks versáteis e autênticos para diferentes ocasiões, mantendo sua essência.',
    },
  ];

  const bonus1Features = [
    'As peças essenciais que toda mulher deveria ter, independente do estilo.',
    'Como adaptar peças-chave ao seu estilo predominante para looks autênticos.',
    'Estratégias para maximizar combinações e minimizar gastos.',
    'Como montar um guarda-roupa cápsula funcional para sua rotina.',
    'Dicas para valorizar seu tipo físico e criar uma imagem coerente.',
  ];

  const bonus2Features = [
    'Como identificar o formato do seu rosto (oval, redondo, quadrado, etc.).',
    'Quais cortes de cabelo valorizam seus traços e equilibram as proporções.',
    'Como escolher brincos, colares e óculos que complementam seu formato facial.',
    'Técnicas de maquiagem para realçar seus pontos fortes.',
    'Dicas personalizadas para cada tipo de rosto e terços faciais.',
  ];

  return (
    <div className="min-h-screen relative bg-brand-lightest text-brand-dark">
      {/* Efeitos de background */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 sm:w-1/2 sm:h-1/2 bg-brand-accent/5 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2/3 h-2/3 sm:w-1/2 sm:h-1/2 bg-brand-accent-darker/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 opacity-60 pointer-events-none" />

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg py-3.5 sm:py-4 px-4 sm:px-6 mb-8 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto max-w-6xl flex justify-center items-center">
          <FixedIntroImage
            src={HERO_IMAGE_URL}
            alt="Logo Gisele Galvão"
            width={110}
            height={55}
            className="h-auto max-h-9 sm:max-h-11 transition-all duration-300"
            isCritical={true}
          />
        </div>
      </header>

      <main className="relative z-10">
        {/* Seção Hero */}
        <SectionWrapper bgClassName="bg-transparent" id="inicio">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-brand-accent/20 text-center card-hover-effect">
            <h1 className="font-playfair text-brand-dark mb-5 sm:mb-7 leading-tight drop-shadow-sm">
              Descubra Seu Estilo Autêntico e Transforme Seu Guarda-Roupa!
            </h1>
            <p className="text-brand-medium max-w-3xl mx-auto mb-7 sm:mb-12 leading-relaxed">
              Chega de um guarda-roupa lotado e da sensação de que nada combina com você. Descubra
              seu estilo predominante e aprenda a montar looks que refletem sua essência, com{' '}
              <strong>praticidade e confiança.</strong>
            </p>
            <div className="mb-8 sm:mb-12 max-w-md lg:max-w-lg mx-auto relative rounded-2xl overflow-hidden shadow-xl image-hover-effect">
              <FixedIntroImage
                src={HERO_COMPLEMENTARY_IMAGE_URL}
                alt="Mulher com guarda-roupa versátil e elegante"
                width={700}
                height={467}
                imgClassName="rounded-2xl"
                isCritical={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-2xl" />
              <div className="absolute -top-2.5 -right-2.5 w-9 h-9 border-t-3 border-r-3 border-brand-accent rounded-tr-lg sm:-top-3.5 sm:-right-3.5 sm:w-11 sm:h-11 sm:border-t-4 sm:border-r-4 sm:rounded-tr-xl" />
              <div className="absolute -bottom-2.5 -left-2.5 w-9 h-9 border-b-3 border-l-3 border-brand-accent rounded-bl-lg sm:-bottom-3.5 sm:-left-3.5 sm:w-11 sm:h-11 sm:border-b-4 sm:border-l-4 sm:rounded-bl-xl" />
            </div>
            <button
              onClick={() => handleCtaClick('headline_cta', 'Quero Descobrir Meu Estilo Agora!')}
              className="btn-primary-3d animate-pulse-gentle text-base sm:text-lg md:text-xl py-3.5 px-7 sm:py-4 sm:px-12"
            >
              <span className="flex items-center justify-center gap-2.5">
                <ArrowRight size={22} strokeWidth={2.5} /> Quero Descobrir Meu Estilo Agora!
              </span>
            </button>
            <p className="text-xs sm:text-sm text-brand-medium flex items-center justify-center gap-1.5 mt-5">
              <Lock size={14} className="text-brand-accent" /> Compra segura e acesso imediato.
            </p>
            <div className="mt-7 flex justify-center">
              <ActiveUsersIndicator />
            </div>
          </div>
        </SectionWrapper>

        <hr className="custom-hr" />

        {/* Seção do Problema */}
        <SectionWrapper id="o-problema">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-brand-accent-darker/10 card-hover-effect">
            <div className="text-center mb-8 sm:mb-12">
              <FixedIntroImage
                src={PROBLEM_IMAGE_ALT_URL}
                alt="Mulher pensativa em frente ao guarda-roupa"
                width={500}
                height={333}
                wrapperClassName="rounded-2xl shadow-lg mx-auto mb-7 sm:mb-9 transform hover:scale-103 transition-transform duration-300 w-full max-w-sm overflow-hidden image-hover-effect"
                imgClassName="rounded-2xl"
              />
              <h2 className="font-playfair text-brand-dark leading-tight">
                Você se identifica com isso?
              </h2>
            </div>
            <div className="space-y-5 sm:space-y-6 text-brand-medium leading-relaxed text-left md:text-justify">
              <p>
                Você já se sentiu{' '}
                <strong>frustrada ao abrir seu guarda-roupa cheio e não ter o que vestir?</strong>{' '}
                Ou comprou peças que pareciam perfeitas na loja, mas nunca combinaram com nada?
              </p>
              <p>
                Ter um armário lotado não significa ter um guarda-roupa funcional. Muitas vezes,
                isso só aumenta a ansiedade e o sentimento de que{' '}
                <strong>"nada fica bom em mim"</strong>.
              </p>
              <p>
                Quantas vezes você perdeu tempo tentando montar um look que te fizesse sentir{' '}
                <strong>confiante</strong>? Ou gastou dinheiro em peças que raramente usou? Talvez
                sinta que sua imagem não comunica quem você realmente é.
              </p>
              <p className="font-semibold text-brand-dark bg-brand-accent-highlight/60 p-4 sm:p-5 rounded-xl border-l-4 border-brand-accent shadow-inner mt-6">
                Isso acontece porque você ainda não descobriu seu{' '}
                <strong>estilo predominante</strong> - alinhado com sua personalidade, valores e
                essência. Sem esse conhecimento, você continua comprando peças aleatórias que não
                conversam entre si.
              </p>
            </div>
          </div>
        </SectionWrapper>

        <hr className="custom-hr" />

        {/* Seção da Solução */}
        <SectionWrapper bgClassName="bg-brand-light" id="a-solucao">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-brand-accent/20 text-center card-hover-effect">
            <div className="mb-8 sm:mb-12 max-w-md lg:max-w-lg mx-auto relative image-hover-effect">
              <FixedIntroImage
                src={SOLUTION_QUIZ_IMAGE_URL}
                alt="Preview do Quiz de Estilo Gisele Galvão"
                width={600}
                height={450}
                wrapperClassName="w-full h-auto rounded-2xl shadow-xl object-cover overflow-hidden"
                imgClassName="rounded-2xl"
              />
              <div className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 bg-gradient-to-br from-brand-accent to-brand-accent-darker text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-xl text-sm sm:text-base font-bold transform rotate-6 ring-2 ring-white/80 ring-offset-2 ring-offset-white">
                <Gift size={18} className="inline-block mr-1.5 sm:mr-2" /> Exclusivo!
              </div>
            </div>
            <h2 className="font-playfair text-brand-dark mb-6 sm:mb-8 leading-tight">
              A Solução Para Sua Transformação de Estilo Começa Aqui!
            </h2>
            <div className="space-y-5 sm:space-y-6 text-brand-medium leading-relaxed mb-8 sm:mb-10 text-left md:text-justify">
              <p>
                E se eu te dissesse que em minutos você pode descobrir seu estilo predominante e
                transformar sua relação com a moda e sua imagem?
              </p>
              <p className="text-lg sm:text-xl text-brand-dark font-bold bg-brand-accent-highlight/70 p-4 sm:p-5 rounded-xl border-l-4 border-brand-accent shadow-inner">
                Apresento o <strong>Quiz de Estilo Gisele Galvão</strong> - uma ferramenta baseada
                em anos de experiência em consultoria de imagem.
              </p>
              <p>
                Não é um teste genérico. É um <strong>método preciso</strong> que analisa suas
                preferências e identifica seu estilo entre os <strong>7 estilos universais:</strong>{' '}
                Clássico, Natural, Romântico, Dramático, Criativo, Elegante e Contemporâneo.
              </p>
              <p>
                Descobrir seu estilo é o primeiro passo para um guarda-roupa funcional, economizar
                tempo e dinheiro, expressar sua personalidade e sentir-se{' '}
                <strong>confiante e autêntica todos os dias.</strong>
              </p>
              <p>
                O quiz é <strong>rápido e intuitivo</strong>, para mulheres que desejam alinhar
                imagem à essência, sem seguir tendências passageiras ou gastar fortunas.
              </p>
            </div>
            <button
              onClick={() => handleCtaClick('solution_cta', 'Fazer o Quiz e Descobrir Meu Estilo')}
              className="btn-primary-3d animate-pulse-gentle text-base sm:text-lg md:text-xl py-3.5 px-7 sm:py-4 sm:px-12"
            >
              <span className="flex items-center justify-center gap-2.5">
                <ShoppingBag size={22} strokeWidth={2.5} /> Fazer o Quiz e Descobrir Meu Estilo
              </span>
            </button>
            <CountdownTimer />
          </div>
        </SectionWrapper>

        <hr className="custom-hr" />

        {/* Seção de Benefícios */}
        <SectionWrapper id="beneficios">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-brand-accent/20 card-hover-effect">
            <h2 className="font-playfair text-brand-dark mb-10 sm:mb-14 text-center leading-tight">
              Muito Mais Que um Simples Quiz: Uma Jornada Completa
            </h2>
            <div className="grid md:grid-cols-2 gap-10 sm:gap-14 items-center mb-10 sm:mb-14">
              <div className="order-2 md:order-1 space-y-5">
                <p className="text-brand-medium leading-relaxed">
                  Descobrir seu estilo é só o começo. Para transformar sua imagem, você precisa de{' '}
                  <strong>orientação prática e estratégica.</strong>
                </p>
                <p className="text-lg sm:text-xl text-brand-dark font-bold leading-relaxed bg-brand-accent-highlight/60 p-4 rounded-xl border-l-4 border-brand-accent-darker shadow-inner">
                  Por isso, ao fazer o quiz, você terá acesso ao{' '}
                  <strong>
                    Guia de Imagem e Estilo específico para o seu estilo predominante!
                  </strong>
                </p>
                <p className="text-brand-medium leading-relaxed font-semibold mt-1">
                  Cada guia foi desenvolvido para oferecer:
                </p>
                <ul className="list-none space-y-3.5 text-brand-medium pl-0">
                  {benefitsList.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <item.icon
                        size={24}
                        className="text-brand-accent mr-3 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-brand-dark">{item.title}</span>{' '}
                        {item.text}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2 image-hover-effect overflow-hidden rounded-2xl shadow-lg">
                <FixedIntroImage
                  src={GUIDES_BENEFITS_IMAGE_URL}
                  alt="Guia de Imagem e Estilo em tablet"
                  width={500}
                  height={400}
                  imgClassName="rounded-2xl"
                />
              </div>
            </div>
            <div className="flex justify-center mb-7 sm:mb-10 image-hover-effect overflow-hidden rounded-2xl shadow-lg max-w-lg mx-auto">
              <FixedIntroImage
                src={GUIDES_BENEFITS_COMPLEMENTARY_IMAGE_URL}
                alt="Mockup 3 revistas guia de estilo"
                width={600}
                height={390}
                imgClassName="rounded-2xl"
              />
            </div>
            <p className="text-brand-medium text-center max-w-3xl mx-auto leading-relaxed">
              Com o <strong>Guia de Imagem e Estilo</strong>, você terá as ferramentas para
              construir uma imagem que reflete quem você é e potencializa sua comunicação. Não é
              sobre moda, mas sobre criar um <strong>estilo atemporal que te representa.</strong>
            </p>
          </div>
        </SectionWrapper>

        <hr className="custom-hr" />

        {/* Bônus 1 */}
        <SectionWrapper bgClassName="bg-brand-light" id="bonus1">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-brand-accent-darker/10 card-hover-effect">
            <h2 className="font-playfair text-brand-dark mb-2.5 text-center">
              BÔNUS ESPECIAL <span className="text-brand-accent">#1</span>
            </h2>
            <p className="text-xl sm:text-2xl text-brand-accent font-bold mb-10 sm:mb-14 text-center drop-shadow-sm">
              Guia das Peças-Chave do Guarda-Roupa de Sucesso
            </p>
            <div className="grid md:grid-cols-2 gap-10 sm:gap-14 items-center mb-10 sm:mb-14">
              <div className="w-full md:max-w-xs lg:max-w-sm mx-auto image-hover-effect overflow-hidden rounded-2xl shadow-lg">
                <FixedIntroImage
                  src={BONUS_1_KEY_PIECES_IMAGE_URL}
                  alt="Guia Peças-Chave do Guarda-Roupa"
                  width={500}
                  height={400}
                  imgClassName="rounded-2xl aspect-[4/3] object-contain bg-gray-50 p-2"
                />
              </div>
              <div className="space-y-4">
                <p className="text-brand-medium leading-relaxed">
                  Como bônus, você receberá o{' '}
                  <strong>Guia das Peças-Chave do Guarda-Roupa de Sucesso</strong> - um manual para
                  construir um armário funcional, versátil e alinhado à sua identidade.
                </p>
                <p className="text-brand-medium leading-relaxed font-semibold">
                  Neste guia, você vai descobrir:
                </p>
                <ul className="list-none space-y-3 text-brand-medium pl-0">
                  {bonus1Features.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={22} className="text-brand-accent mr-3 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-center mb-7 sm:mb-10 image-hover-effect overflow-hidden rounded-2xl shadow-lg max-w-lg mx-auto">
              <FixedIntroImage
                src={BONUS_1_KEY_PIECES_COMPLEMENTARY_IMAGE_URL}
                alt="Detalhes do Guia Peças-Chave"
                width={600}
                height={390}
                imgClassName="rounded-2xl"
              />
            </div>
            <p className="text-brand-medium text-center max-w-3xl mx-auto leading-relaxed">
              Imagine um guarda-roupa onde tudo combina, looks incríveis em minutos, e cada item
              reflete quem você é! Sem compras por impulso, peças esquecidas ou frustração ao se
              vestir.
            </p>
            <p className="text-lg sm:text-xl text-brand-dark font-bold text-center max-w-3xl mx-auto mt-7 leading-relaxed bg-brand-accent-highlight/60 p-4 sm:p-5 rounded-xl border-l-4 border-brand-accent shadow-inner">
              Este bônus te ajudará a <strong>economizar tempo e dinheiro</strong>, eliminando a
              frustração diária. É como ter uma consultora pessoal te orientando.
            </p>
          </div>
        </SectionWrapper>

        <hr className="custom-hr" />

        {/* Bônus 2 */}
        <SectionWrapper id="bonus2">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-brand-accent/20 card-hover-effect">
            <h2 className="font-playfair text-brand-dark mb-2.5 text-center">
              BÔNUS ESPECIAL <span className="text-brand-accent-darker">#2</span>
            </h2>
            <p className="text-xl sm:text-2xl text-brand-accent-darker font-bold mb-10 sm:mb-14 text-center drop-shadow-sm">
              Guia de Visagismo Facial
            </p>
            <div className="grid md:grid-cols-2 gap-10 sm:gap-14 items-center mb-10 sm:mb-14">
              <div className="order-2 md:order-1 space-y-4">
                <p className="text-brand-medium leading-relaxed">
                  E tem mais! O <strong>Guia de Visagismo Facial</strong> - uma ferramenta para
                  valorizar seus traços naturais e potencializar sua beleza única.
                </p>
                <p className="text-brand-medium leading-relaxed font-semibold">
                  O visagismo harmoniza sua imagem com a estrutura do seu rosto. Aprenda:
                </p>
                <ul className="list-none space-y-3 text-brand-medium pl-0">
                  {bonus2Features.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check
                        size={22}
                        className="text-brand-accent-darker mr-3 mt-0.5 flex-shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2 w-full md:max-w-xs lg:max-w-sm mx-auto image-hover-effect overflow-hidden rounded-2xl shadow-lg">
                <FixedIntroImage
                  src={BONUS_2_VISAGISM_IMAGE_URL}
                  alt="Guia de Visagismo Facial"
                  width={500}
                  height={400}
                  imgClassName="rounded-2xl aspect-[4/3] object-contain bg-gray-50 p-2"
                />
              </div>
            </div>
            <div className="flex justify-center mb-7 sm:mb-10 image-hover-effect overflow-hidden rounded-2xl shadow-lg max-w-lg mx-auto">
              <FixedIntroImage
                src={BONUS_2_VISAGISM_COMPLEMENTARY_IMAGE_URL}
                alt="Exemplo de Visagismo"
                width={600}
                height={390}
                imgClassName="rounded-2xl"
              />
            </div>
            <p className="text-brand-medium text-center max-w-3xl mx-auto leading-relaxed">
              Saber quais acessórios escolher para valorizar seu rosto vai{' '}
              <strong>transformar como você se vê e como os outros te percebem.</strong>
            </p>
            <p className="text-lg sm:text-xl text-brand-dark font-bold text-center max-w-3xl mx-auto mt-7 leading-relaxed bg-brand-accent-highlight/60 p-4 sm:p-5 rounded-xl border-l-4 border-brand-accent-darker shadow-inner">
              Com o Guia de Visagismo, você terá mais uma ferramenta para uma imagem autêntica e
              impactante. Acessórios e corte de cabelo a favor da sua beleza natural.
            </p>
          </div>
        </SectionWrapper>

        <hr className="custom-hr" />

        {/* Seção da Mentora */}
        <SectionWrapper bgClassName="bg-brand-light" id="mentora">
          <div className="text-center">
            <h2 className="font-playfair text-brand-dark mb-10 sm:mb-14">Conheça Sua Mentora</h2>
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-brand-accent/20 md:flex md:items-center md:gap-10 lg:gap-12 max-w-3xl mx-auto card-hover-effect">
              <div className="md:w-1/3 mb-7 md:mb-0 flex-shrink-0">
                <FixedIntroImage
                  src={MENTOR_GISELE_IMAGE_URL}
                  alt="Gisele Galvão, Consultora de Imagem"
                  width={250}
                  height={250}
                  wrapperClassName="rounded-full shadow-xl mx-auto border-4 border-brand-accent/40 transform hover:scale-105 transition-transform duration-300 w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 object-cover overflow-hidden"
                  imgClassName="rounded-full"
                />
              </div>
              <div className="md:w-2/3 text-left space-y-3.5">
                <h3 className="font-playfair text-brand-dark">Gisele Galvão</h3>
                <p className="text-brand-accent font-semibold border-b-2 border-brand-accent/30 pb-2.5 text-sm sm:text-base">
                  Consultora de Imagem e Estilo, Personal Branding, Estrategista de Marca Pessoal e
                  Especialista em Coloração Pessoal com Certificação Internacional.
                </p>
                <p className="text-brand-medium text-sm sm:text-base leading-relaxed">
                  Advogada de formação. Mãe da Victória, esposa do Fabrício. Apaixonada pela vida,
                  detalhes, viagens e crescimento pessoal.
                </p>
                <p className="text-brand-medium text-sm sm:text-base leading-relaxed">
                  Colérica, virginiana, paciente, pacificadora e empata. Linguagens de amor:
                  receber, atos de serviço e tempo de qualidade. Ama vinho, chás e café. Valores:
                  família, justiça, honestidade, ética e liberdade.
                </p>
                <p className="text-brand-medium text-sm sm:text-base leading-relaxed bg-brand-accent-highlight/60 p-3.5 rounded-xl border-l-4 border-brand-accent-darker shadow-inner">
                  "Há anos ajudo mulheres a descobrirem seu estilo autêntico. Minha missão é que
                  você se vista de si mesma, comunicando sua essência. Já transformei centenas de
                  vidas com minha metodologia."
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <hr className="custom-hr" />

        {/* Seção de Depoimentos */}
        <SectionWrapper id="depoimentos">
          <div className="text-center">
            <h2 className="font-playfair text-brand-dark mb-10 sm:mb-14">
              Resultados Reais de Mulheres Reais
            </h2>
            <p className="text-brand-medium max-w-3xl mx-auto mb-10 sm:mb-14 leading-relaxed">
              Veja o que dizem as mulheres que já descobriram seu estilo e transformaram sua imagem
              com os guias:
            </p>
            <div className="mb-10 sm:mb-14 image-hover-effect overflow-hidden rounded-2xl shadow-xl max-w-xl mx-auto">
              <FixedIntroImage
                src={TESTIMONIALS_RESULTS_IMAGE_URL}
                alt="Depoimentos de clientes satisfeitas em mockups"
                width={800}
                height={500}
                imgClassName="rounded-2xl"
              />
            </div>
            <blockquote className="text-brand-medium mb-10 sm:mb-14 leading-relaxed font-semibold italic p-5 sm:p-7 bg-brand-accent-highlight/60 rounded-2xl border-l-4 border-brand-accent shadow-xl max-w-2xl mx-auto text-base sm:text-lg">
              "Os guias da Gisele me deram a clareza que eu precisava. Agora sei o que me valoriza e
              me sinto muito mais confiante!" - Maria S.
            </blockquote>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 mb-10 sm:mb-14">
              {[BEFORE_AFTER_IMAGE_1_URL, BEFORE_AFTER_IMAGE_2_URL, BEFORE_AFTER_IMAGE_3_URL].map(
                (src, i) => (
                  <div
                    key={i}
                    className="image-hover-effect overflow-hidden rounded-2xl shadow-lg border-4 border-brand-accent/20"
                  >
                    <FixedIntroImage
                      src={src}
                      alt={`Antes e Depois Cliente ${i + 1}`}
                      width={300}
                      height={300}
                      imgClassName="rounded-xl aspect-square object-cover"
                    />
                  </div>
                )
              )}
            </div>
            <div className="mb-10 sm:mb-14 image-hover-effect overflow-hidden rounded-2xl shadow-xl max-w-xl mx-auto">
              <FixedIntroImage
                src={TESTIMONIALS_RESULTS_COMPLEMENTARY_IMAGE_URL}
                alt="Mais exemplos de antes e depois de clientes"
                width={700}
                height={438}
                imgClassName="rounded-2xl"
              />
            </div>
            <p className="text-brand-medium mb-7 leading-relaxed">
              Estas são algumas das centenas de mulheres que transformaram sua relação com a moda e
              imagem pessoal.
            </p>
            <p className="text-lg sm:text-xl text-brand-dark font-bold mb-8 sm:mb-10 leading-relaxed p-5 bg-brand-light rounded-2xl border-l-4 border-brand-accent shadow-xl max-w-3xl mx-auto">
              Você também pode ter essa transformação! Imagine se vestir com{' '}
              <strong>confiança</strong>, com um guarda-roupa que reflete quem você é, economizando{' '}
              <strong>tempo e dinheiro</strong>, e sentindo sua imagem alinhada com seu interior.
            </p>
            <button
              onClick={() => handleCtaClick('testimonials_cta', 'Sim, Quero Essa Transformação!')}
              className="btn-primary-3d animate-subtle-float text-base sm:text-lg md:text-xl py-3.5 px-7 sm:py-4 sm:px-12"
            >
              <span className="flex items-center justify-center gap-2.5">
                Sim, Quero Essa Transformação!{' '}
                <Heart
                  size={22}
                  strokeWidth={2.5}
                  className="group-hover:fill-white transition-colors animate-heart-beat"
                />
              </span>
            </button>
            <div className="mt-7 flex justify-center">
              <LimitedSpotsNotification />
            </div>
          </div>
        </SectionWrapper>

        <hr className="custom-hr" />

        {/* Seção de Garantia */}
        <SectionWrapper bgClassName="bg-brand-dark text-white" id="garantia">
          <div className="text-center">
            <div className="mb-8 sm:mb-10">
              <FixedIntroImage
                src={GUARANTEE_IMAGE_URL}
                alt="Selo de Garantia Incondicional de 7 Dias"
                width={250}
                height={250}
                wrapperClassName="mx-auto drop-shadow-lg animate-fade-in-up w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
              />
            </div>
            <h2 className="font-playfair mb-7 leading-tight text-[#fdf6f0]">
              Sua Satisfação Garantida ou Seu Dinheiro de Volta!
            </h2>
            <p className="text-gray-200 mb-9 leading-relaxed max-w-2xl mx-auto text-sm sm:text-base">
              Estou tão confiante de que estes materiais transformarão sua relação com a moda que
              ofereço uma <strong>garantia incondicional de 7 dias.</strong> Se não ficar
              satisfeita, peça o reembolso e devolveremos <strong>100% do seu investimento</strong>,
              sem perguntas. Risco zero!
            </p>
            <div className="bg-brand-lightest text-brand-dark p-6 sm:p-10 rounded-3xl shadow-2xl mb-9 sm:mb-12 border border-brand-accent/30 max-w-2xl mx-auto">
              <h3 className="font-playfair text-brand-dark mb-5">
                Investimento Único Para Uma Transformação Completa:
              </h3>
              <div className="flex justify-center items-baseline mb-3 sm:mb-5">
                <span className="text-xl sm:text-2xl font-semibold mr-1.5">R$</span>
                <span className="text-4xl sm:text-6xl font-extrabold text-brand-accent drop-shadow-md">
                  {VALOR_PRODUTO}
                </span>
              </div>
              <p className="text-brand-dark mb-2 sm:mb-4 font-semibold">Você terá acesso a:</p>
              <ul className="list-none text-left space-y-2.5 max-w-md mx-auto text-sm sm:text-base mb-7 sm:mb-9 pl-0">
                {[
                  {
                    text: 'Quiz de Estilo para descobrir seu estilo predominante',
                    bold: true,
                  },
                  {
                    text: 'Guia de Imagem e Estilo específico para seu resultado',
                    bold: true,
                  },
                  {
                    text: 'Bônus 1: Guia das Peças-Chave do Guarda-Roupa de Sucesso',
                    boldExtra: true,
                  },
                  {
                    text: 'Bônus 2: Guia de Visagismo Facial',
                    boldExtra: true,
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-brand-medium">
                    <Check size={20} className="text-green-500 mr-2.5 flex-shrink-0" />
                    <span
                      className={
                        item.boldExtra ? 'font-extrabold' : item.bold ? 'font-semibold' : ''
                      }
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="my-7 sm:my-9 flex justify-center image-hover-effect overflow-hidden rounded-2xl shadow-lg max-w-md mx-auto">
                <FixedIntroImage
                  src={GUARANTEE_COMPLEMENTARY_IMAGE_URL}
                  alt="Mockup completo com todos os bônus inclusos"
                  width={600}
                  height={390}
                  imgClassName="rounded-2xl"
                />
              </div>
              <p className="text-brand-medium mb-5 leading-relaxed text-sm sm:text-base">
                Pense: quanto já gastou com roupas que não usou? Quanto vale economizar tempo todas
                as manhãs? Quanto vale se sentir confiante e autêntica?
              </p>
              <p className="text-brand-dark font-bold leading-relaxed bg-brand-accent-highlight/60 p-4 sm:p-5 rounded-xl border-l-4 border-brand-accent-darker shadow-inner text-base sm:text-lg">
                Este investimento em autoconhecimento é um investimento em você, na sua confiança e
                na forma como o mundo te percebe.
              </p>
            </div>
            <button
              onClick={() => handleCtaClick('guarantee_cta', 'Quero Descobrir Meu Estilo Agora!')}
              className="btn-primary-3d animate-pulse-gentle text-base sm:text-lg md:text-xl py-3.5 px-7 sm:py-4 sm:px-12"
            >
              <span className="flex items-center justify-center gap-2.5">
                Quero Descobrir Meu Estilo Agora! <Shield size={22} strokeWidth={2.5} />
              </span>
            </button>
            <p className="mt-5 text-xs sm:text-sm text-gray-300 flex items-center justify-center gap-1.5">
              <Lock size={14} />
              Pagamento 100% seguro. Acesso imediato.
            </p>
          </div>
        </SectionWrapper>

        <hr className="custom-hr" />

        {/* Seção FAQ */}
        <SectionWrapper bgClassName="bg-brand-lightest" id="faq">
          <div className="text-center">
            <div className="mb-10 sm:mb-14 flex justify-center image-hover-effect overflow-hidden rounded-2xl shadow-lg max-w-md mx-auto">
              <FixedIntroImage
                src={FAQ_IMAGE_URL}
                alt="Mulher com interrogação, simbolizando perguntas frequentes"
                width={500}
                height={313}
                imgClassName="rounded-2xl"
              />
            </div>
            <FaqSectionNew />
            <div className="mt-12 sm:mt-16">
              <button
                onClick={() => handleCtaClick('faq_cta', 'Quero Transformar Minha Imagem Agora!')}
                className="btn-primary-3d text-base sm:text-lg py-3.5 px-7 sm:py-4 sm:px-10"
              >
                <span className="flex items-center justify-center gap-2.5">
                  Quero Transformar Minha Imagem Agora! <ArrowRight size={20} strokeWidth={2.5} />
                </span>
              </button>
              <p className="mt-5 text-xs sm:text-sm text-brand-medium flex items-center justify-center gap-1.5">
                <Users size={16} className="text-brand-accent" />
                Junte-se a centenas de mulheres que já redescobriram sua confiança!
              </p>
            </div>
          </div>
        </SectionWrapper>
      </main>

      {/* Footer */}
      <footer className="text-center py-10 bg-brand-dark text-gray-400 text-xs sm:text-sm">
        <p>
          &copy; {new Date().getFullYear()} Gisele Galvão Consultoria de Imagem. Todos os direitos
          reservados.
        </p>
        <p className="mt-1.5">CNPJ: XX.XXX.XXX/0001-XX - Contato: contato@giselegalvao.com.br</p>
        <p style={{ color: '#8B7355' }}>Design e Desenvolvimento com ❤️</p>
      </footer>
    </div>
  );
};

export default PreviewQuizOfferPage;
