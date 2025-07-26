import React from 'react';

// Componentes modernos
import { 
  TestimonialSlider, 
  CountdownTimer, 
  PricingCard, 
  InteractiveProgressBar, 
  SocialProofBanner 
} from './ModernComponents';

// Componentes básicos
import { 
  CheckCircle, Star, Gift, Lock, Shield, Award, Clock, ArrowRight, 
  HelpCircle, Brain, Play, Code, LoaderCircle, Image as ImageIcon,
  StretchHorizontal, Rows3 
} from 'lucide-react';

interface DynamicBlockRendererProps {
  pageId: string;
  blockId: string;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DynamicBlockRenderer: React.FC<DynamicBlockRendererProps> = ({
  pageId,
  blockId,
  fallback = null,
  className = '',
  style = {}
}) => {
  // Para fins de demonstração, vamos simular props baseadas no blockId
  const componentType = blockId || 'default';
  const props: any = {
    question: 'Qual dessas opções representa melhor seu estilo?',
    questionId: 'question-1',
    allowMultiple: true,
    maxSelections: 3,
    showImages: true,
    autoAdvance: false,
    height: '2rem',
    options: [
      { id: '1', text: 'Clássico e elegante', styleCategory: 'Clássico', points: 2, keywords: ['elegante', 'sofisticado'] },
      { id: '2', text: 'Moderno e descolado', styleCategory: 'Contemporâneo', points: 3, keywords: ['moderno', 'descolado'] },
      { id: '3', text: 'Natural e autêntico', styleCategory: 'Natural', points: 1, keywords: ['natural', 'autêntico'] }
    ],
    title: 'Descubra Seu Estilo',
    subtitle: 'Um quiz personalizado para descobrir seu estilo único',
    buttonText: 'Começar Quiz Agora',
    text: 'Texto de exemplo',
    content: 'Conteúdo de exemplo',
    message: 'Analisando suas respostas...',
    src: '',
    alt: 'Imagem',
    caption: '',
    showPercentages: true,
    showSecondaryStyles: true,
    maxSecondaryStyles: 2
  };

  // Renderizar componente baseado no tipo
  const renderComponent = () => {
    switch (componentType) {
      case 'quiz-transition':
        return (
          <div className="min-h-[400px] bg-gradient-to-br from-[#432818] to-[#6B5B73] rounded-xl flex items-center justify-center text-white">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                <LoaderCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {props.message || 'Analisando suas respostas...'}
              </h3>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div className="bg-[#B89B7A] h-2 rounded-full w-2/3 animate-pulse"></div>
              </div>
              <p className="text-white/70 text-sm">
                Isso pode levar alguns segundos
              </p>
            </div>
          </div>
        );

      // COMPONENTES BÁSICOS
      case 'heading':
        return (
          <div className="py-4">
            <h2 className="text-3xl font-bold text-[#432818] leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {props.text || 'Heading'}
            </h2>
          </div>
        );

      case 'paragraph':
        return (
          <div className="py-3">
            <p className="text-gray-700 leading-relaxed text-lg">
              {props.text || 'Your paragraph text here'}
            </p>
          </div>
        );

      case 'button':
        return (
          <div className="py-4">
            <button className="bg-gradient-to-r from-[#B89B7A] to-[#432818] hover:from-[#432818] hover:to-[#B89B7A] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              {props.text || 'Click me'}
            </button>
          </div>
        );

      case 'image':
        return (
          <div className="py-4">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              {props.src ? (
                <img 
                  src={props.src} 
                  alt={props.alt || 'Image'} 
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>Adicione uma imagem</p>
                  </div>
                </div>
              )}
              {props.caption && (
                <div className="bg-black/50 text-white p-3 text-sm">
                  {props.caption}
                </div>
              )}
            </div>
          </div>
        );

      case 'container':
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="space-y-4">
              {props.title && (
                <h3 className="text-xl font-semibold text-[#432818] border-b border-gray-200 pb-2">
                  {props.title}
                </h3>
              )}
              <div className="text-gray-600">
                {props.content || 'Container content here'}
              </div>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div className="py-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">
                  {props.text || ''}
                </span>
              </div>
            </div>
          </div>
        );

      case 'spacer':
        return (
          <div style={{ height: props.height || '2rem' }}></div>
        );

      // COMPONENTES DE LAYOUT
      case 'flex-container-horizontal':
        return (
          <div className="flex flex-wrap gap-4 items-center justify-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
            <div className="text-center flex-1 min-w-[200px]">
              <div className="w-12 h-12 bg-[#B89B7A] rounded-lg flex items-center justify-center mx-auto mb-3">
                <StretchHorizontal className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-[#432818] mb-2">Container Horizontal</h4>
              <p className="text-sm text-gray-600">Elementos organizados lado a lado</p>
            </div>
            <div className="text-center flex-1 min-w-[200px]">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Espaço para conteúdo 1</p>
              </div>
            </div>
            <div className="text-center flex-1 min-w-[200px]">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Espaço para conteúdo 2</p>
              </div>
            </div>
          </div>
        );

      case 'flex-container-vertical':
        return (
          <div className="space-y-4 p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#B89B7A] rounded-lg flex items-center justify-center mx-auto mb-3">
                <Rows3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-[#432818] mb-2">Container Vertical</h4>
              <p className="text-sm text-gray-600">Elementos organizados verticalmente</p>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Espaço para conteúdo 1</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Espaço para conteúdo 2</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Espaço para conteúdo 3</p>
              </div>
            </div>
          </div>
        );

      // COMPONENTES MODERNOS AVANÇADOS
      case 'testimonial-slider':
        return <TestimonialSlider autoPlay={true} interval={5000} />;

      case 'countdown-timer-real':
        return (
          <CountdownTimer 
            title="⏰ Oferta Limitada!"
            urgencyText="Aproveite enquanto há tempo"
          />
        );

      case 'pricing-card-modern':
        return (
          <PricingCard 
            title="Transformação Completa"
            originalPrice={175}
            discountPrice={39.90}
            discount={77}
            isPopular={true}
          />
        );

      case 'progress-bar-modern':
        return (
          <InteractiveProgressBar 
            currentStep={props.currentStep || 8}
            totalSteps={21}
            showPercentage={true}
            showStepLabels={true}
          />
        );

      case 'social-proof':
        return <SocialProofBanner showLiveCounter={true} />;

      // BLOCOS DE QUIZ CONFIGURÁVEIS
      case 'quiz-question':
        return (
          <div className="bg-white border border-[#B89B7A] rounded-xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#432818] mb-2">
                {props.question || 'Qual dessas opções representa melhor seu estilo?'}
              </h3>
              <p className="text-sm text-gray-600">
                {props.allowMultiple ? `Selecione até ${props.maxSelections || 3} opções` : 'Selecione uma opção'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(props.options || [
                { id: '1', text: 'Clássico e elegante', styleCategory: 'Clássico' },
                { id: '2', text: 'Moderno e descolado', styleCategory: 'Contemporâneo' }
              ]).map((option: any) => (
                <div key={option.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#B89B7A] cursor-pointer transition-all">
                  <div className="font-medium text-[#432818]">{option.text}</div>
                  {option.styleCategory && (
                    <div className="text-sm text-[#B89B7A] mt-1">Categoria: {option.styleCategory}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'quiz-question-configurable':
        return (
          <div className="bg-gradient-to-br from-white to-[#f9f4ef] border-2 border-[#B89B7A] rounded-xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B89B7A] to-[#432818] rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#432818] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                {props.question || 'Questão Configurável Avançada'}
              </h3>
              <div className="flex justify-center gap-4 text-sm">
                <span className="bg-[#B89B7A] text-white px-3 py-1 rounded-full">
                  ID: {props.questionId || 'question-1'}
                </span>
                {props.autoAdvance && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full">Auto-avanço</span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(props.options || [
                { id: '1', text: 'Clássico e elegante', styleCategory: 'Clássico', points: 2 },
                { id: '2', text: 'Moderno e descolado', styleCategory: 'Contemporâneo', points: 3 },
                { id: '3', text: 'Natural e autêntico', styleCategory: 'Natural', points: 1 }
              ]).map((option: any) => (
                <div key={option.id} className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-[#B89B7A] hover:shadow-lg cursor-pointer transition-all duration-300">
                  <div className="font-semibold text-[#432818] mb-2">{option.text}</div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Categoria: <span className="text-[#B89B7A] font-medium">{option.styleCategory}</span></div>
                    <div>Pontos: <span className="bg-[#432818] text-white px-2 py-0.5 rounded">{option.points}</span></div>
                    {option.keywords && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {option.keywords.map((keyword: string, idx: number) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'quiz-result-calculated':
        return (
          <div className="bg-gradient-to-br from-[#432818] to-[#6B5B73] rounded-xl p-8 text-white shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Seu Resultado Calculado
              </h3>
              <p className="text-white/80">Baseado em suas respostas</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#B89B7A] mb-2">92%</div>
                <div className="text-lg font-semibold">Estilo Romântico Clássico</div>
                <div className="text-sm text-white/70 mt-2">Compatibilidade com seu perfil</div>
              </div>
            </div>
            
            {props.showSecondaryStyles && (
              <div className="space-y-3">
                <h4 className="font-semibold text-white/90">Estilos Secundários:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#B89B7A]">75%</div>
                    <div className="text-sm">Elegante</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#B89B7A]">68%</div>
                    <div className="text-sm">Sofisticado</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'quiz-start-page':
        return (
          <div className="min-h-[500px] bg-gradient-to-br from-[#f9f4ef] via-white to-[#f9f4ef] rounded-xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-[#B89B7A] to-[#432818] rounded-full flex items-center justify-center mx-auto mb-8">
                <Play className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[#432818] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                {props.title || 'Descubra Seu Estilo'}
              </h1>
              
              <p className="text-lg text-[#6B5B73] mb-8 leading-relaxed">
                {props.subtitle || 'Um quiz personalizado para descobrir seu estilo único e transformar seu guarda-roupa'}
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-[#B89B7A]" />
                    </div>
                    <div className="font-semibold text-[#432818]">5 minutos</div>
                    <div className="text-sm text-gray-600">Duração estimada</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <HelpCircle className="w-6 h-6 text-[#B89B7A]" />
                    </div>
                    <div className="font-semibold text-[#432818]">16 questões</div>
                    <div className="text-sm text-gray-600">Cuidadosamente selecionadas</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-[#B89B7A]" />
                    </div>
                    <div className="font-semibold text-[#432818]">Resultado único</div>
                    <div className="text-sm text-gray-600">Personalizado para você</div>
                  </div>
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-[#B89B7A] to-[#432818] hover:from-[#432818] hover:to-[#B89B7A] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                {props.buttonText || 'Começar Quiz Agora'}
              </button>
            </div>
          </div>
        );

      // FALLBACK
      default:
        return (
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Componente: {componentType}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Este componente agora possui um design personalizado
              </p>
              {props.title && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-gray-700">{props.title}</h4>
                </div>
              )}
              {props.content && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-600">{props.content}</p>
                </div>
              )}
              {props.text && (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">{props.text}</p>
                </div>
              )}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">
                  ✨ Componente com design moderno e responsivo aplicado!
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={className}
      style={style}
      data-block-id={blockId}
      data-component-type={componentType}
    >
      {renderComponent()}
    </div>
  );
};

export default DynamicBlockRenderer;
