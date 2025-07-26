import React, { useEffect, useState } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';
import { usePageConfig } from '@/hooks/usePageConfig';
import DynamicBlockRenderer from '@/components/DynamicBlockRenderer';
import { Header } from '@/components/result/Header';
import { styleConfig } from '@/config/styleConfig';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ShoppingCart, CheckCircle, ArrowDown, Lock } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import SecondaryStylesSection from '@/components/quiz-result/SecondaryStylesSection';
import ErrorState from '@/components/result/ErrorState';
import MotivationSection from '@/components/result/MotivationSection';
import MentorSection from '@/components/result/MentorSection';
import GuaranteeSection from '@/components/result/GuaranteeSection';
import Testimonials from '@/components/quiz-result/sales/Testimonials';
import BeforeAfterTransformation from '@/components/result/BeforeAfterTransformation';
import BonusSection from '@/components/result/BonusSection';
import { Button } from '@/components/ui/button';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useIsLowPerformanceDevice } from '@/hooks/use-mobile';
import ResultSkeleton from '@/components/result/ResultSkeleton';
import { trackButtonClick } from '@/utils/analytics';
import BuildInfo from '@/components/BuildInfo';
import SecurePurchaseElement from '@/components/result/SecurePurchaseElement';
import { useAuth } from '@/context/AuthContext';

const ResultPage: React.FC = () => {
  const {
    primaryStyle,
    secondaryStyles
  } = useQuiz();
  const {
    globalStyles
  } = useGlobalStyles();
  const {
    user
  } = useAuth(); // Get user from auth context
  
  // Integração com o editor visual
  const { 
    config: pageConfig, 
    isLoading: configLoading, 
    getBlockProps,
    applyStyles
  } = usePageConfig('result-page');
  
  const [imagesLoaded, setImagesLoaded] = useState({
    style: false,
    guide: false
  });
  const isLowPerformance = useIsLowPerformanceDevice();
  const {
    isLoading,
    completeLoading
  } = useLoadingState({
    minDuration: isLowPerformance ? 400 : 800,
    disableTransitions: isLowPerformance
  });

  // Button hover state
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  // Aplicar estilos do editor quando disponível
  useEffect(() => {
    if (pageConfig && !configLoading) {
      applyStyles();
    }
  }, [pageConfig, configLoading, applyStyles]);

  // Carregar dados mock durante desenvolvimento se não houver resultado
  useEffect(() => {
    if (!primaryStyle && process.env.NODE_ENV === 'development') {
      console.log('Carregando dados mock para desenvolvimento...');
      loadMockData();
      // Force reload dos dados após carregar mock
      window.location.reload();
    }
  }, [primaryStyle]);

  // Adaptar dados para compatibilidade com os componentes
  const styleData = {
    category: 'Natural' as keyof typeof styleConfig, // Default fallback
    percentage: 85,
    score: 0
  };
  
  // Se primaryStyle existe e tem dados válidos, usar esses dados
  if (primaryStyle) {
    if (typeof primaryStyle === 'string') {
      styleData.category = primaryStyle as keyof typeof styleConfig;
    } else if (typeof primaryStyle === 'object') {
      // Verificar se é StyleResult ou outro formato
      if ('category' in primaryStyle) {
        styleData.category = (primaryStyle as any).category || 'Natural';
        styleData.percentage = (primaryStyle as any).percentage || 85;
        styleData.score = (primaryStyle as any).score || 0;
      }
    }
  }

  useEffect(() => {
    if (!primaryStyle) return;
    window.scrollTo(0, 0);

    // Pré-carregar imagens críticas primeiro
    const criticalImages = [globalStyles.logo || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'];
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Depois carregar as imagens específicas do estilo
    const {
      category
    } = styleData;
    const {
      image,
      guideImage
    } = styleConfig[category];
    const styleImg = new Image();
    styleImg.src = `${image}?q=auto:best&f=auto&w=340`;
    styleImg.onload = () => setImagesLoaded(prev => ({
      ...prev,
      style: true
    }));
    const guideImg = new Image();
    guideImg.src = `${guideImage}?q=auto:best&f=auto&w=540`;
    guideImg.onload = () => setImagesLoaded(prev => ({
      ...prev,
      guide: true
    }));
  }, [primaryStyle, globalStyles.logo]);
  useEffect(() => {
    if (imagesLoaded.style && imagesLoaded.guide) completeLoading();
  }, [imagesLoaded, completeLoading]);
  if (!primaryStyle) return <ErrorState />;
  if (isLoading) return <ResultSkeleton />;
  
  console.log('StyleData processado:', styleData);
  console.log('PrimaryStyle original:', primaryStyle);
  console.log('SecondaryStyles original:', secondaryStyles);
  
  // Debug para identificar problemas
  console.log('ResultPage Debug:', {
    primaryStyle,
    secondaryStyles,
    styleData
  });
  
  const {
    category
  } = styleData;
  const styleConfigData = styleConfig[category] || styleConfig.Natural;
  const {
    image,
    guideImage,
    description
  } = styleConfigData;
  const handleCTAClick = () => {
    // Track checkout initiation
    trackButtonClick('checkout_button', 'Iniciar Checkout', 'results_page');
    window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
  };

  /**
   * Renderiza um componente com configurações do editor se disponível,
   * caso contrário renderiza o componente original
   */
  const renderConfigurableComponent = (blockId: string, originalComponent: React.ReactNode) => {
    if (pageConfig && !configLoading) {
      return <DynamicBlockRenderer 
        pageId="result-page"
        blockId={blockId}
        fallback={originalComponent}
      />;
    }
    return originalComponent;
  };

  return <div className="min-h-screen relative" style={{
    backgroundColor: globalStyles.backgroundColor || '#fffaf7',
    color: globalStyles.textColor || '#432818',
    fontFamily: globalStyles.fontFamily || 'inherit'
  }}>
      {/* Decorative background elements - melhorados */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-[#B89B7A]/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/5 h-1/5 bg-[#aa6b5d]/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      {renderConfigurableComponent('header-component-real', 
        <Header 
          primaryStyle={styleData as any} 
          logoHeight={globalStyles.logoHeight} 
          logo={globalStyles.logo} 
          logoAlt={globalStyles.logoAlt} 
          userName={user?.userName} 
        />
      )}

      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-5xl relative z-10">
        {/* ATTENTION: Primary Style Card - Usando componente inline editável */}
        <AnimatedWrapper animation="fade" show={true} duration={600} delay={300}>
          {renderConfigurableComponent('result-header-inline',
            <DynamicBlockRenderer 
              pageId="result-page"
              blockId="result-header-inline"
              fallback={
                <Card className="p-6 md:p-8 mb-12 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-[#B89B7A]/20 rounded-xl">
                  <div className="text-center mb-8">
                    <div className="max-w-md mx-auto mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[#8F7A6A]">
                          Seu estilo predominante
                        </span>
                        <span className="text-[#aa6b5d] font-medium">{styleData.percentage}%</span>
                      </div>
                      <Progress value={styleData.percentage} className="h-2 bg-[#F3E8E6]" indicatorClassName="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]" />
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={400}>
                        <p className="text-[#432818] leading-relaxed">{description}</p>
                      </AnimatedWrapper>
                      <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={600}>
                        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-[#B89B7A]/10 transition-all duration-200 hover:shadow-md">
                          <h3 className="text-lg font-medium text-[#432818] mb-2">Estilos que Também Influenciam Você</h3>
                          {/* Renderizar estilos secundários de forma correta */}
                          <div className="space-y-2">
                            {secondaryStyles && secondaryStyles.length > 0 ? (
                              secondaryStyles.slice(0, 2).map((style, index) => {
                                // Extrair dados do estilo secundário corretamente
                                let styleName = '';
                                let stylePercentage = 0;
                                
                                if (typeof style === 'string') {
                                  styleName = style;
                                  stylePercentage = 15; // fallback
                                } else if (typeof style === 'object') {
                                  styleName = (style as any).category || String(style);
                                  stylePercentage = (style as any).percentage || (style as any).score || 15;
                                }
                                
                                return (
                                  <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-[#432818]">
                                      {styleName}
                                    </span>
                                    <span className="text-sm font-semibold text-[#aa6b5d]">
                                      {stylePercentage}%
                                    </span>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-sm text-[#8F7A6A] italic">
                                Calculando estilos complementares...
                              </div>
                            )}
                          </div>
                        </div>
                      </AnimatedWrapper>
                    </div>
                    <AnimatedWrapper animation={isLowPerformance ? 'none' : 'scale'} show={true} duration={500} delay={500}>
                      <div className="max-w-[280px] mx-auto relative order-first md:order-last">
                        <img 
                          src={`${image}?q=auto:best&f=auto&w=280`} 
                          alt={`Estilo ${category}`} 
                          className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300" 
                          loading="eager" 
                          fetchpriority="high" 
                          width="280" 
                          height="auto"
                          onError={(e) => {
                            console.error('Erro ao carregar imagem do estilo:', e);
                            console.log('URL da imagem:', `${image}?q=auto:best&f=auto&w=280`);
                            console.log('Category:', category);
                            console.log('StyleConfig data:', styleConfigData);
                          }}
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
                        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
                      </div>
                    </AnimatedWrapper>
                  </div>
                  <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={800}>
                    <div className="mt-8 max-w-[540px] mx-auto relative">
                      <img 
                        src={`${guideImage}?q=auto:best&f=auto&w=540`} 
                        alt={`Guia de Estilo ${category}`} 
                        loading="lazy" 
                        className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300" 
                        width="540" 
                        height="auto"
                        onError={(e) => {
                          console.error('Erro ao carregar imagem do guia:', e);
                          console.log('URL do guia:', `${guideImage}?q=auto:best&f=auto&w=540`);
                        }}
                      />
                      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium transform rotate-12">
                        Exclusivo
                      </div>
                    </div>
                  </AnimatedWrapper>
                </Card>
              }
            />
          )}
        </AnimatedWrapper>

        {/* INTEREST: Before/After Transformation Section */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={700}>
          {renderConfigurableComponent('before-after-component-real', 
            <BeforeAfterTransformation />
          )}
        </AnimatedWrapper>

        {/* INTEREST: Motivation Section */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={800}>
          {renderConfigurableComponent('motivation-component-real', 
            <MotivationSection />
          )}
        </AnimatedWrapper>

        {/* INTEREST: Bonus Section */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={850}>
          {renderConfigurableComponent('bonus-component-real', 
            <BonusSection />
          )}
        </AnimatedWrapper>

        {/* DESIRE: Testimonials */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={900}>
          {renderConfigurableComponent('testimonials-component-real', 
            <Testimonials />
          )}
        </AnimatedWrapper>

        {/* DESIRE: Featured CTA (Green) - Usando componente inline editável */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={950}>
          {renderConfigurableComponent('cta-section-inline',
            <DynamicBlockRenderer 
              pageId="result-page"
              blockId="cta-section-inline"
              fallback={
                <div className="text-center my-12">
                  <div className="bg-gradient-to-br from-[#f9f4ef] to-[#fff7f3] p-6 md:p-8 rounded-xl border border-[#B89B7A]/10 mb-8 shadow-sm">
                    <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">
                      Descubra Como Aplicar Seu Estilo na Prática
                    </h3>
                    <div className="flex justify-center">
                      <ArrowDown className="w-8 h-8 text-[#B89B7A] animate-bounce" />
                    </div>
                  </div>
                  
                  <Button onClick={handleCTAClick} className="text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} style={{
                  background: "linear-gradient(135deg, #4CAF50, #45a049)",
                  boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)"
                }}>
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
                      Quero meu Guia de Estilo Agora
                    </span>
                  </Button>
                  
                  <div className="mt-2 inline-block bg-[#aa6b5d]/10 px-3 py-1 rounded-full">
                    <p className="text-sm text-[#aa6b5d] font-medium flex items-center justify-center gap-1"></p>
                  </div>
                  
                  <SecurePurchaseElement />
                </div>
              }
            />
          )}
        </AnimatedWrapper>

        {/* DESIRE: Guarantee Section */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={1000}>
          {renderConfigurableComponent('guarantee-component-real', 
            <GuaranteeSection />
          )}
        </AnimatedWrapper>

        {/* DESIRE: Mentor and Trust Elements */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={1050}>
          {renderConfigurableComponent('mentor-component-real', 
            <MentorSection />
          )}
        </AnimatedWrapper>

        {/* ACTION: Final Value Proposition and CTA - Usando componente inline editável */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={1100}>
          {renderConfigurableComponent('value-stack-inline',
            <DynamicBlockRenderer 
              pageId="result-page"
              blockId="value-stack-inline"
              fallback={
                <div className="text-center mt-16">
                  <h2 className="text-3xl md:text-4xl font-playfair text-[#aa6b5d] mb-6">
                    Vista-se de Você — na Prática
                  </h2>
                  <div className="elegant-divider"></div>
                  <p className="text-[#432818] mb-6 max-w-xl mx-auto">
                    Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção. 
                    O Guia da Gisele Galvão foi criado para mulheres como você — que querem se vestir 
                    com autenticidade e transformar sua imagem em ferramenta de poder.
                  </p>

                  <div className="bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] p-6 rounded-lg mb-6 border border-[#B89B7A]/10 glass-panel">
                    <h3 className="text-xl font-medium text-[#aa6b5d] mb-4">O Guia de Estilo e Imagem + Bônus Exclusivos</h3>
                    <ul className="space-y-3 text-left max-w-xl mx-auto text-[#432818]">
                      {["Looks com intenção e identidade", "Cores, modelagens e tecidos a seu favor", "Imagem alinhada aos seus objetivos", "Guarda-roupa funcional, sem compras por impulso"].map((item, index) => <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white mr-2 mt-0.5">
                            <CheckCircle className="h-3 w-3" />
                          </div>
                          <span>{item}</span>
                        </li>)}
                    </ul>
                  </div>

                  {/* Updated Value Stack Section with new prices and fixed red line */}
                  <div className="bg-white p-6 rounded-lg shadow-md border border-[#B89B7A]/20 card-elegant mb-8 max-w-md mx-auto">
                    <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">O Que Você Recebe Hoje</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10">
                        <span>Guia Principal</span>
                        <span className="font-medium">R$ 67,00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10">
                        <span>Bônus - Peças-chave</span>
                        <span className="font-medium">R$ 79,00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10">
                        <span>Bônus - Visagismo Facial</span>
                        <span className="font-medium">R$ 29,00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 pt-3 font-bold">
                        <span>Valor Total</span>
                        <div className="relative">
                          <span>R$ 175,00</span>
                          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff5a5a] transform -translate-y-1/2 -rotate-3"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-[#f9f4ef] rounded-lg">
                      <p className="text-sm text-[#aa6b5d] uppercase font-medium">Hoje por apenas</p>
                      <p className="text-4xl font-bold gold-text">R$ 39,00</p>
                      <p className="text-xs text-[#3a3a3a]/60 mt-1">Pagamento único</p>
                    </div>
                  </div>

                  <Button onClick={handleCTAClick} className="text-white py-5 px-8 rounded-md shadow-md transition-colors btn-3d mb-2" style={{
                  background: "linear-gradient(to right, #4CAF50, #45a049)",
                  boxShadow: "0 4px 14px rgba(76, 175, 80, 0.4)",
                  fontSize: "1rem" /* Smaller font size for button */
                }} onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)}>
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart className={`w-4 h-4 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
                      <span>Garantir Meu Guia + Bônus Especiais</span>
                    </span>
                  </Button>
                  
                  <SecurePurchaseElement />

                  <p className="text-sm text-[#aa6b5d] mt-2 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Oferta exclusiva nesta página</span>
                  </p>
                </div>
              }
            />
          )}
        </AnimatedWrapper>
      </div>

      <BuildInfo />
    </div>;
};
export default ResultPage;