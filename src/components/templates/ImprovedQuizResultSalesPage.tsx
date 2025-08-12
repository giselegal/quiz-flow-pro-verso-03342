'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/use-toast';
import { trackButtonClick } from '@/utils/analytics';
import {
  Award,
  CheckCircle,
  Clock,
  Gift,
  Shield,
  ShoppingCart,
  Star,
  XCircle,
  Zap,
} from 'lucide-react';
import React, { lazy, Suspense, useEffect, useState } from 'react';

// Types
interface StyleResult {
  category: string;
  score: number;
  percentage: number;
}

// Helper function to get style descriptions
const getStyleDescription = (styleType: string): string => {
  switch (styleType) {
    case 'Natural':
      return 'Você valoriza o conforto e a praticidade. Seu estilo é descontraído e casual, com peças fáceis de usar no dia a dia.';
    case 'Clássico':
      return 'Você aprecia roupas atemporais e elegantes. Seu estilo é refinado e tradicional, com peças de qualidade que nunca saem de moda.';
    case 'Contemporâneo':
      return 'Você gosta de estar atualizado e seguir as tendências. Seu estilo é moderno e versátil, combinando o clássico com o atual.';
    case 'Elegante':
      return 'Você valoriza a sofisticação e o requinte. Seu estilo é polido e imponente, com peças de alta qualidade e acabamento impecável.';
    case 'Romântico':
      return 'Você aprecia detalhes delicados e femininos. Seu estilo é suave e gracioso, com elementos como rendas, babados e estampas florais.';
    case 'Sexy':
      return 'Você gosta de valorizar suas curvas. Seu estilo é sensual e marcante, com peças que destacam seu corpo e sua confiança.';
    case 'Dramático':
      return 'Você busca impactar e chamar atenção. Seu estilo é arrojado e marcante, com peças estruturadas e de design diferenciado.';
    case 'Criativo':
      return 'Você adora expressar sua individualidade. Seu estilo é único e original, combinando cores, texturas e elementos de forma não convencional.';
    default:
      return 'Seu estilo pessoal reflete sua personalidade e preferências únicas.';
  }
};

// Lazy load componentes menos críticos
const Testimonials = lazy(() => import('@/components/quiz-result/sales/Testimonials'));

interface ImprovedQuizResultSalesPageProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  userName?: string;
}

const ImprovedQuizResultSalesPage: React.FC<ImprovedQuizResultSalesPageProps> = ({
  primaryStyle,
  secondaryStyles,
  userName = 'Visitante',
}) => {
  const { toast } = useToast();
  const [setCriticalImagesLoaded] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState<'parcelado' | 'avista'>('parcelado');

  // Pré-carregar imagens críticas
  useEffect(() => {
    const criticalImages = [
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg',
    ];

    let loadedCount = 0;
    const totalImages = criticalImages.length;

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setCriticalImagesLoaded(true);
        }
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };
    });

    // Timeout para garantir que não ficará travado mesmo se alguma imagem falhar
    const timeout = setTimeout(() => {
      setCriticalImagesLoaded(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handleBuyNow = () => {
    // Rastrear evento de clique no botão
    trackButtonClick('buy_now_button', 'Quero Comprar', 'result_page_main_cta');

    toast({
      title: 'Redirecionando para o checkout',
      description: 'Você será redirecionado para a página de pagamento.',
    });

    // URL do checkout
    window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
  };

  // Loading state quando imagens críticas estão carregando
  if (!criticalImagesLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffaf7]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-[#432818]">Carregando seu resultado personalizado...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7]">
      {/* Header */}
      <header className="bg-white py-4 px-4 border-b border-[#B89B7A]/20 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg"
            alt="Logo"
            className="h-12 sm:h-16"
            width="128"
            height="64"
          />
          <div className="text-center sm:text-right">
            <p className="text-sm text-[#432818]">
              <span className="font-semibold text-[#aa6b5d]">5 x de R$ 8,83 *</span>
            </p>
            <p className="text-sm text-[#432818]">Ou R$ 39,90 à vista</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair text-[#aa6b5d] mb-4">
                {userName}, seu Estilo é {primaryStyle.category}!
              </h1>
              <p className="text-base sm:text-lg mb-6 text-[#3a3a3a]">
                Descubra como aplicar seu estilo predominante com clareza e autenticidade no seu dia
                a dia.
              </p>

              {/* Resultado do Estilo */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 border border-[#B89B7A]/10">
                <h2 className="font-medium text-[#aa6b5d] mb-3">Seu estilo predominante:</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#aa6b5d] to-[#B89B7A] flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {primaryStyle.percentage}%
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl sm:text-2xl text-[#432818] font-semibold">
                        {primaryStyle.category}
                      </h3>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#3a3a3a]/80 mt-3 leading-relaxed">
                  {getStyleDescription(primaryStyle.category)}
                </p>
              </div>

              {/* Estilos Complementares */}
              {secondaryStyles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[#aa6b5d] mb-4">
                    Seus estilos complementares
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {secondaryStyles.slice(0, 2).map((style, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-sm border border-[#B89B7A]/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#432818] text-sm">
                            {style.category}
                          </span>
                          <span className="text-sm font-semibold text-[#aa6b5d]">
                            {style.percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#FAF9F7] rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full transition-all duration-500"
                            style={{ width: `${style.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="order-1 md:order-2">
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp"
                alt="Resultado do Quiz Visagismo"
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
                loading="lazy"
                width="600"
                height="400"
              />
            </div>
          </div>
        </section>

        {/* SEÇÃO VALOR MELHORADA */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair text-[#aa6b5d] mb-4">
              Transforme Seu Estilo Hoje
            </h2>
            <p className="text-base sm:text-lg text-[#432818] max-w-2xl mx-auto">
              Guia completo personalizado + bônus exclusivos para você aplicar seu estilo na prática
            </p>
          </div>

          {/* Card Principal de Valor */}
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-2 border-[#B89B7A] bg-white shadow-xl">
              {/* Badge de Oferta Limitada */}
              <div className="absolute -top-3 -right-3 z-10">
                <div className="bg-[#ff6b35] text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12 shadow-lg">
                  <Clock className="w-4 h-4 inline mr-1" />
                  OFERTA LIMITADA
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-12">
                {/* Breakdown de Produtos */}
                <div className="bg-[#fff7f3] p-6 sm:p-8 rounded-xl mb-8 border border-[#B89B7A]/20">
                  <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-[#432818]">
                    Tudo que Você Vai Receber Hoje
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        item: 'Guia Completo de Estilo Personalizado',
                        description: 'Manual exclusivo baseado no seu perfil único',
                        value: 'R$ 97,00',
                        badge: 'PRINCIPAL',
                      },
                      {
                        item: 'Bônus: Manual de Peças Estratégicas',
                        description: 'Descubra as peças-chave do seu guarda-roupa',
                        value: 'R$ 47,00',
                        badge: 'BÔNUS',
                      },
                      {
                        item: 'Bônus: Guia de Visagismo Facial',
                        description: 'Cortes e acessórios ideais para seu rosto',
                        value: 'R$ 31,00',
                        badge: 'BÔNUS',
                      },
                    ].map((product, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-[#B89B7A]/10 shadow-sm"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <CheckCircle className="w-5 h-5 text-[#4CAF50] mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <h4 className="font-bold text-[#432818] text-sm sm:text-base">
                                {product.item}
                              </h4>
                              <span
                                className={`px-2 py-1 text-xs font-bold rounded-full text-white w-fit ${
                                  product.badge === 'PRINCIPAL' ? 'bg-[#B89B7A]' : 'bg-[#aa6b5d]'
                                }`}
                              >
                                {product.badge}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#8F7A6A]">
                              {product.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-4 text-right">
                          <span className="text-base sm:text-lg font-bold text-[#aa6b5d]">
                            {product.value}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="border-t-2 border-[#B89B7A]/30 pt-6 mt-6">
                      <div className="flex justify-between items-center text-lg sm:text-xl">
                        <span className="font-bold text-[#432818]">Valor Total:</span>
                        <div className="relative">
                          <span className="text-2xl sm:text-3xl font-bold line-through text-[#6B5B4E] opacity-70">
                            R$ 175,00
                          </span>
                          <div style={{ backgroundColor: '#FAF9F7' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção de Preços com Tabs */}
                <div className="text-center mb-8">
                  {/* Tabs de Pagamento */}
                  <div className="flex justify-center mb-8">
                    <div className="flex bg-[#f9f4ef] rounded-full p-1 border border-[#B89B7A]/20">
                      {[
                        { key: 'parcelado', label: 'Parcelado' },
                        { key: 'avista', label: 'À Vista' },
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setActivePaymentTab(tab.key as 'avista' | 'parcelado')}
                          className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            activePaymentTab === tab.key
                              ? 'bg-white text-[#432818] shadow-sm border border-[#B89B7A]/20'
                              : 'text-[#8F7A6A] hover:text-[#432818]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preço Dinâmico */}
                  {activePaymentTab === 'parcelado' ? (
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4">
                        <div className="text-center">
                          <p style={{ color: '#8B7355' }}>De</p>
                          <p className="text-xl sm:text-2xl line-through text-[#6B5B4E] opacity-70">
                            R$ 175,00
                          </p>
                        </div>

                        <div className="hidden sm:block text-[#4CAF50]">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium text-[#aa6b5d] mb-1">Por apenas</p>
                          <div className="flex items-baseline gap-1 justify-center">
                            <span className="text-xl sm:text-2xl font-bold text-[#4CAF50]">
                              5x R$
                            </span>
                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4CAF50]">
                              8,83
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#8F7A6A] mt-1">
                            sem juros no cartão
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1 justify-center">
                        <span className="text-lg">R$</span>
                        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#4CAF50]">
                          39
                        </span>
                        <span className="text-xl">,90</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#8F7A6A] mt-1">pagamento único</p>
                    </div>
                  )}

                  {/* Badge de Economia - USANDO VERDE PARA CONVERSÃO */}
                  <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full bg-[#4CAF50] text-white font-bold mb-8 shadow-lg">
                    <Gift className="w-5 h-5" />
                    <span className="text-sm sm:text-base">💰 Economia de R$ 135,10 (77% OFF)</span>
                  </div>

                  {/* CTA Button - VERDE PARA MÁXIMA CONVERSÃO */}
                  <Button
                    onClick={handleBuyNow}
                    className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-4 sm:py-6 px-6 sm:px-12 rounded-xl text-base sm:text-lg shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Transformar Meu Estilo Agora</span>
                    </div>
                  </Button>

                  <p className="text-xs sm:text-sm text-[#aa6b5d] font-medium mt-3 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Oferta expira quando você sair desta página</span>
                  </p>

                  {/* Elementos de Confiança */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm mb-8">
                    {[
                      {
                        icon: <Shield className="w-4 h-4" />,
                        text: 'Pagamento 100% Seguro',
                        color: 'text-[#4CAF50]',
                      },
                      {
                        icon: <Award className="w-4 h-4" />,
                        text: 'Garantia de 7 dias',
                        color: 'text-[#aa6b5d]',
                      },
                      {
                        icon: <Zap className="w-4 h-4" />,
                        text: 'Acesso Imediato',
                        color: 'text-[#B89B7A]',
                      },
                      {
                        icon: <Star className="w-4 h-4" />,
                        text: 'Avaliação 5 estrelas',
                        color: 'text-[#aa6b5d]',
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-[#432818] text-center sm:text-left"
                      >
                        <span className={item.color}>{item.icon}</span>
                        <span className="text-xs">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Métodos de Pagamento */}
                  <div className="text-center">
                    <p className="text-sm text-[#8F7A6A] mb-4">Métodos de pagamento aceitos:</p>
                    <img
                      src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
                      alt="Métodos de pagamento"
                      className="w-full max-w-sm mx-auto rounded-lg shadow-sm"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Seção Antes e Depois */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-playfair text-[#aa6b5d] text-center mb-8">
            A Diferença de Conhecer Seu Estilo
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Antes */}
            <div style={{ borderColor: '#E5DDD5' }}>
              <h3 style={{ color: '#432818' }}>❌ Quando você não conhece seu estilo...</h3>
              <ul className="space-y-3">
                {[
                  'Compra peças por impulso que não combinam entre si',
                  "Sente que tem um guarda-roupa cheio, mas 'nada para vestir'",
                  'Investe em tendências que não valorizam sua imagem',
                  'Tem dificuldade em criar uma imagem coerente e autêntica',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle style={{ color: '#432818' }} />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Depois */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
              <h3 className="text-lg font-semibold text-[#4CAF50] mb-4 text-center">
                ✅ Quando você domina seu estilo...
              </h3>
              <ul className="space-y-3">
                {[
                  'Economiza tempo e dinheiro em compras conscientes',
                  'Projeta a imagem que realmente representa você',
                  'Aumenta sua confiança em qualquer ambiente',
                  'Cria looks harmoniosos com menos peças',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Bonus Carousel */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-playfair text-[#aa6b5d] mb-6 text-center">
            Bônus Exclusivos Inclusos
          </h2>

          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {[
                {
                  title: 'Guia de Maquiagem por Estilo',
                  description: 'Descubra as maquiagens que mais combinam com seu estilo',
                  img: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911677/C%C3%B3pia_de_MOCKUPS_15_-_Copia_grstwl.webp',
                },
                {
                  title: 'Manual de Acessórios Estratégicos',
                  description: 'Aprenda a usar acessórios para potencializar seus looks',
                  img: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp',
                },
                {
                  title: 'Checklist de Compras Inteligentes',
                  description: 'Nunca mais compre por impulso com este guia prático',
                  img: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_13_znzbks.webp',
                },
              ].map((bonus, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="overflow-hidden border border-[#B89B7A]/20 shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={bonus.img}
                        alt={bonus.title}
                        className="w-full aspect-[4/3] object-cover"
                        loading="lazy"
                        width="400"
                        height="300"
                      />
                      <div className="p-4 text-center">
                        <h3 className="font-medium text-[#432818] mb-2 text-sm sm:text-base">
                          {bonus.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#8F7A6A]">{bonus.description}</p>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </section>

        {/* About Author */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-playfair text-[#aa6b5d] mb-4">
                Sobre a Especialista
              </h2>
              <p className="mb-4 text-sm sm:text-base text-[#432818]">
                Com mais de 10 anos de experiência em consultoria de imagem e estilo pessoal, ajudei
                centenas de mulheres a descobrirem sua verdadeira essência através das roupas.
              </p>
              <p className="text-sm sm:text-base text-[#432818]">
                Minha missão é ajudar você a construir um guarda-roupa que reflita sua
                personalidade, valorize seu tipo físico e simplifique sua rotina, permitindo que
                você se vista com confiança todos os dias.
              </p>
            </div>
            <div>
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg"
                alt="Foto da Especialista"
                className="rounded-lg shadow-md w-full max-w-md mx-auto"
                loading="lazy"
                width="400"
                height="300"
              />
            </div>
          </div>
        </section>

        {/* Testimonials - Lazy loaded */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-playfair text-[#aa6b5d] mb-6 text-center">
            O que Dizem As Alunas
          </h2>
          <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
            <Testimonials />
          </Suspense>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-playfair text-[#aa6b5d] mb-6 text-center">
            Dúvidas Frequentes
          </h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {[
              {
                question: 'Como funciona o acesso ao material?',
                answer:
                  'Após a confirmação do pagamento, você receberá um e-mail com o link para download do seu guia personalizado. O acesso é vitalício e você pode baixar quantas vezes quiser.',
              },
              {
                question: 'O guia é realmente personalizado para mim?',
                answer:
                  'Sim! Com base nas suas respostas no quiz, criamos um guia específico para seu estilo predominante, incluindo paleta de cores, tipos de peças e dicas de combinação.',
              },
              {
                question: 'Posso trocar ou devolver se não gostar?',
                answer:
                  'Oferecemos garantia incondicional de 7 dias. Se por qualquer motivo você não ficar satisfeita, devolvemos 100% do seu investimento.',
              },
              {
                question: 'Os bônus estão inclusos no valor?',
                answer:
                  'Sim! Todos os bônus mencionados estão inclusos no valor único de R$ 39,90. Não há taxas extras ou custos adicionais.',
              },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left text-[#432818] hover:text-[#aa6b5d]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#8F7A6A]">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] p-6 sm:p-8 rounded-xl border border-[#B89B7A]/20 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-playfair text-[#aa6b5d] mb-4">
              Não Perca Esta Oportunidade
            </h2>
            <p className="text-sm sm:text-base text-[#432818] mb-6">
              Transforme seu guarda-roupa e sua confiança com um investimento que vale por toda
              vida.
            </p>
            <Button
              onClick={handleBuyNow}
              className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-4 px-8 rounded-lg text-base shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Garantir Meu Guia por R$ 39,90
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ImprovedQuizResultSalesPage;
