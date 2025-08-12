// @ts-nocheck
import React, { useState } from 'react';

// Componentes modernos
import {
  TestimonialSlider,
  CountdownTimer,
  PricingCard,
  InteractiveProgressBar,
  SocialProofBanner,
} from './ModernComponents';

// Componentes básicos
import {
  CheckCircle,
  Star,
  Gift,
  Lock,
  Shield,
  Award,
  Clock,
  ArrowRight,
  HelpCircle,
  Brain,
  Play,
  Code,
  LoaderCircle,
  Image as ImageIcon,
  StretchHorizontal,
  Rows3,
  ShoppingCart,
  ArrowDown,
} from 'lucide-react';

// 🚀 SUPABASE: Integração de dados
import { saveQuizResponse } from '../services/quizSupabaseService';

interface DynamicBlockRendererProps {
  pageId: string;
  blockId: string;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  // 🚀 SUPABASE: Props para integração de dados
  enableSupabaseTracking?: boolean;
  stepNumber?: number;
  userName?: string;
}

const DynamicBlockRenderer: React.FC<DynamicBlockRendererProps> = ({
  pageId,
  blockId,
  fallback = null,
  className = '',
  style = {},
  // 🚀 SUPABASE: Props de integração
  enableSupabaseTracking = true,
  stepNumber,
  userName,
}) => {
  // Para fins de demonstração, vamos simular props baseadas no blockId
  const componentType = blockId || 'default';

  // 🚀 SUPABASE: Função helper para tracking de eventos
  const trackEvent = async (
    eventName:
      | 'quiz_start'
      | 'quiz_complete'
      | 'checkout_click'
      | 'step_view'
      | 'step_complete'
      | 'quiz_abandon'
      | 'button_click'
      | 'option_select'
      | 'result_view',
    eventData: any = {}
  ) => {
    if (enableSupabaseTracking) {
      try {
        await saveQuizResponse({
          eventName,
          step_id: pageId,
          event_data: {
            block_id: blockId,
            user_name: userName,
            ...eventData,
          },
        });
        console.log(`🚀 Supabase: Evento ${eventName} rastreado`);
      } catch (error) {
        console.error('❌ Erro ao rastrear evento:', error);
      }
    }
  };

  const props: any = {
    question: 'Qual dessas opções representa melhor seu estilo?',
    questionId: 'question-1',
    allowMultiple: true,
    maxSelections: 3,
    showImages: true,
    autoAdvance: false,
    height: '2rem',
    options: [
      {
        id: '1',
        text: 'Clássico e elegante',
        styleCategory: 'Clássico',
        points: 2,
        keywords: ['elegante', 'sofisticado'],
      },
      {
        id: '2',
        text: 'Moderno e descolado',
        styleCategory: 'Contemporâneo',
        points: 3,
        keywords: ['moderno', 'descolado'],
      },
      {
        id: '3',
        text: 'Natural e autêntico',
        styleCategory: 'Natural',
        points: 1,
        keywords: ['natural', 'autêntico'],
      },
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
    maxSecondaryStyles: 2,
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
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {props.message || 'Analisando suas respostas...'}
              </h3>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div className="bg-[#B89B7A] h-2 rounded-full w-2/3 animate-pulse"></div>
              </div>
              <p className="text-white/70 text-sm">Isso pode levar alguns segundos</p>
            </div>
          </div>
        );

      // COMPONENTES BÁSICOS
      case 'heading':
        return (
          <div className="py-4">
            <h2
              className="text-3xl font-bold text-[#432818] leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {props.text || 'Heading'}
            </h2>
          </div>
        );

      case 'paragraph':
        return (
          <div className="py-3">
            <p style={{ color: '#6B4F43' }}>{props.text || 'Your paragraph text here'}</p>
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
                  <div style={{ color: '#8B7355' }}>
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>Adicione uma imagem</p>
                  </div>
                </div>
              )}
              {props.caption && (
                <div className="bg-black/50 text-white p-3 text-sm">{props.caption}</div>
              )}
            </div>
          </div>
        );

      case 'container':
        return (
          <div style={{ borderColor: '#E5DDD5' }}>
            <div className="space-y-4">
              {props.title && <h3 style={{ borderColor: '#E5DDD5' }}>{props.title}</h3>}
              <div style={{ color: '#6B4F43' }}>{props.content || 'Container content here'}</div>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div className="py-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div style={{ borderColor: '#E5DDD5' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span style={{ color: '#8B7355' }}>{props.text || ''}</span>
              </div>
            </div>
          </div>
        );

      case 'spacer':
        return <div style={{ height: props.height || '2rem' }}></div>;

      // COMPONENTES DE LAYOUT
      case 'flex-container-horizontal':
        return (
          <div style={{ borderColor: '#E5DDD5' }}>
            <div className="text-center flex-1 min-w-[200px]">
              <div className="w-12 h-12 bg-[#B89B7A] rounded-lg flex items-center justify-center mx-auto mb-3">
                <StretchHorizontal className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-[#432818] mb-2">Container Horizontal</h4>
              <p style={{ color: '#6B4F43' }}>Elementos organizados lado a lado</p>
            </div>
            <div className="text-center flex-1 min-w-[200px]">
              <div style={{ borderColor: '#E5DDD5' }}>
                <p style={{ color: '#8B7355' }}>Espaço para conteúdo 1</p>
              </div>
            </div>
            <div className="text-center flex-1 min-w-[200px]">
              <div style={{ borderColor: '#E5DDD5' }}>
                <p style={{ color: '#8B7355' }}>Espaço para conteúdo 2</p>
              </div>
            </div>
          </div>
        );

      case 'flex-container-vertical':
        return (
          <div style={{ borderColor: '#E5DDD5' }}>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#B89B7A] rounded-lg flex items-center justify-center mx-auto mb-3">
                <Rows3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-[#432818] mb-2">Container Vertical</h4>
              <p style={{ color: '#6B4F43' }}>Elementos organizados verticalmente</p>
            </div>
            <div className="space-y-3">
              <div style={{ borderColor: '#E5DDD5' }}>
                <p style={{ color: '#8B7355' }}>Espaço para conteúdo 1</p>
              </div>
              <div style={{ borderColor: '#E5DDD5' }}>
                <p style={{ color: '#8B7355' }}>Espaço para conteúdo 2</p>
              </div>
              <div style={{ borderColor: '#E5DDD5' }}>
                <p style={{ color: '#8B7355' }}>Espaço para conteúdo 3</p>
              </div>
            </div>
          </div>
        );

      // COMPONENTES MODERNOS AVANÇADOS
      case 'testimonial-slider':
        return <TestimonialSlider autoPlay={true} interval={5000} />;

      case 'countdown-timer-real':
        return (
          <CountdownTimer title="⏰ Oferta Limitada!" urgencyText="Aproveite enquanto há tempo" />
        );

      case 'pricing-card-modern':
        return (
          <PricingCard
            title="Transformação Completa"
            originalPrice={175}
            discountPrice={39.9}
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
              <p style={{ color: '#6B4F43' }}>
                {props.allowMultiple
                  ? `Selecione até ${props.maxSelections || 3} opções`
                  : 'Selecione uma opção'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                props.options || [
                  {
                    id: '1',
                    text: 'Clássico e elegante',
                    styleCategory: 'Clássico',
                  },
                  {
                    id: '2',
                    text: 'Moderno e descolado',
                    styleCategory: 'Contemporâneo',
                  },
                ]
              ).map((option: any) => (
                <div key={option.id} style={{ borderColor: '#E5DDD5' }}>
                  <div className="font-medium text-[#432818]">{option.text}</div>
                  {option.styleCategory && (
                    <div className="text-sm text-[#B89B7A] mt-1">
                      Categoria: {option.styleCategory}
                    </div>
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
              <h3
                className="text-2xl font-bold text-[#432818] mb-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {props.question || 'Questão Configurável Avançada'}
              </h3>
              <div className="flex justify-center gap-4 text-sm">
                <span className="bg-[#B89B7A] text-white px-3 py-1 rounded-full">
                  ID: {props.questionId || 'question-1'}
                </span>
                {props.autoAdvance && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                    Auto-avanço
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(
                props.options || [
                  {
                    id: '1',
                    text: 'Clássico e elegante',
                    styleCategory: 'Clássico',
                    points: 2,
                  },
                  {
                    id: '2',
                    text: 'Moderno e descolado',
                    styleCategory: 'Contemporâneo',
                    points: 3,
                  },
                  {
                    id: '3',
                    text: 'Natural e autêntico',
                    styleCategory: 'Natural',
                    points: 1,
                  },
                ]
              ).map((option: any) => (
                <div key={option.id} style={{ borderColor: '#E5DDD5' }}>
                  <div className="font-semibold text-[#432818] mb-2">{option.text}</div>
                  <div style={{ color: '#8B7355' }}>
                    <div>
                      Categoria:{' '}
                      <span className="text-[#B89B7A] font-medium">{option.styleCategory}</span>
                    </div>
                    <div>
                      Pontos:{' '}
                      <span className="bg-[#432818] text-white px-2 py-0.5 rounded">
                        {option.points}
                      </span>
                    </div>
                    {option.keywords && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {option.keywords.map((keyword: string, idx: number) => (
                          <span key={idx} style={{ color: '#6B4F43' }}>
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
              <h3
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
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

              <h1
                className="text-4xl md:text-5xl font-bold text-[#432818] mb-6"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {props.title || 'Descubra Seu Estilo'}
              </h1>

              <p className="text-lg text-[#6B5B73] mb-8 leading-relaxed">
                {props.subtitle ||
                  'Um quiz personalizado para descobrir seu estilo único e transformar seu guarda-roupa'}
              </p>

              <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-[#B89B7A]" />
                    </div>
                    <div className="font-semibold text-[#432818]">5 minutos</div>
                    <div style={{ color: '#6B4F43' }}>Duração estimada</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <HelpCircle className="w-6 h-6 text-[#B89B7A]" />
                    </div>
                    <div className="font-semibold text-[#432818]">16 questões</div>
                    <div style={{ color: '#6B4F43' }}>Cuidadosamente selecionadas</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-[#B89B7A]" />
                    </div>
                    <div className="font-semibold text-[#432818]">Resultado único</div>
                    <div style={{ color: '#6B4F43' }}>Personalizado para você</div>
                  </div>
                </div>
              </div>

              <button className="bg-gradient-to-r from-[#B89B7A] to-[#432818] hover:from-[#432818] hover:to-[#B89B7A] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                {props.buttonText || 'Começar Quiz Agora'}
              </button>
            </div>
          </div>
        );

      // COMPONENTES ESPECÍFICOS DA PÁGINA DE RESULTADO
      case 'header-component-real':
        return (
          <div className="bg-white shadow-sm border-b border-[#B89B7A]/20 py-6">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                    alt="Logo"
                    className="h-12 w-auto"
                  />
                  <div>
                    <h1
                      className="text-2xl font-bold text-[#432818]"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      Seu Resultado Personalizado
                    </h1>
                    <p className="text-[#6B5B73] text-sm">Descubra seu estilo único</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'result-header-inline':
        return (
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#B89B7A]/20 mb-8">
            <div className="text-center mb-6">
              <h2
                className="text-3xl font-bold text-[#432818] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                🎉 Parabéns! Descobrimos seu estilo
              </h2>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#8F7A6A]">Seu estilo predominante</span>
                  <span className="text-[#aa6b5d] font-medium">92%</span>
                </div>
                <div className="w-full bg-[#F3E8E6] rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] h-3 rounded-full"
                    style={{ width: '92%' }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-[#432818] mb-3">
                  Estilo Romântico Clássico
                </h3>
                <p style={{ color: '#6B4F43' }}>
                  Você possui uma elegância natural que combina feminilidade e sofisticação. Seu
                  estilo é atemporal, com peças que valorizam sua personalidade única.
                </p>
                <div className="bg-[#f9f4ef] rounded-lg p-4">
                  <h4 className="font-medium text-[#432818] mb-2">Características principais:</h4>
                  <ul style={{ color: '#6B4F43' }}>
                    <li>• Feminilidade e delicadeza</li>
                    <li>• Elegância atemporal</li>
                    <li>• Versatilidade para todas as ocasiões</li>
                  </ul>
                </div>
              </div>
              <div className="text-center">
                <img
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp"
                  alt="Seu estilo"
                  className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        );

      case 'before-after-component-real':
        return (
          <div className="bg-gradient-to-br from-[#f9f4ef] to-white p-8 rounded-xl mb-8">
            <h3
              className="text-2xl font-bold text-center text-[#432818] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              A Transformação que Você Merece
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div style={{ backgroundColor: '#E5DDD5' }}>
                  <h4 style={{ color: '#6B4F43' }}>Antes</h4>
                  <p style={{ color: '#6B4F43' }}>
                    Guarda-roupa desorganizado, compras por impulso, dúvidas sobre o que vestir a
                    cada ocasião.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-[#B89B7A] to-[#aa6b5d] text-white p-6 rounded-lg mb-4">
                  <h4 className="text-lg font-semibold mb-2">Depois</h4>
                  <p className="text-sm">
                    Estilo definido, looks intencionais, confiança em cada escolha de roupa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'motivation-component-real':
        return (
          <div className="bg-white p-8 rounded-xl shadow-md border border-[#B89B7A]/20 mb-8">
            <div className="text-center mb-6">
              <Award className="w-12 h-12 text-[#B89B7A] mx-auto mb-4" />
              <h3
                className="text-2xl font-bold text-[#432818] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Por que Investir no Seu Estilo?
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#B89B7A]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-[#B89B7A]" />
                </div>
                <h4 className="font-semibold text-[#432818] mb-2">Confiança</h4>
                <p style={{ color: '#6B4F43' }}>Sinta-se poderosa e autêntica em cada look</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#B89B7A]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-[#B89B7A]" />
                </div>
                <h4 className="font-semibold text-[#432818] mb-2">Praticidade</h4>
                <p style={{ color: '#6B4F43' }}>Economize tempo decidindo o que vestir</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#B89B7A]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-8 h-8 text-[#B89B7A]" />
                </div>
                <h4 className="font-semibold text-[#432818] mb-2">Economia</h4>
                <p style={{ color: '#6B4F43' }}>Compre apenas o que realmente funciona</p>
              </div>
            </div>
          </div>
        );

      case 'bonus-component-real':
        return (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 mb-8">
            <div className="text-center mb-6">
              <Gift className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3
                className="text-2xl font-bold text-green-800 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Bônus Exclusivos
              </h3>
              <p style={{ color: '#6B4F43' }}>
                Conteúdos extras para potencializar seus resultados
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Guia de Peças-Chave</h4>
                <p style={{ color: '#6B4F43' }}>As 10 peças essenciais para seu guarda-roupa</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">✨ Visagismo Facial</h4>
                <p style={{ color: '#6B4F43' }}>Como valorizar seu rosto com as escolhas certas</p>
              </div>
            </div>
          </div>
        );

      case 'testimonials-component-real':
        return <TestimonialSlider autoPlay={true} interval={5000} />;

      case 'cta-section-inline':
        return (
          <div className="text-center my-10">
            <div className="bg-[#f9f4ef] p-6 rounded-lg border border-[#B89B7A]/10 mb-6">
              <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">
                Descubra Como Aplicar Seu Estilo na Prática
              </h3>
              <div className="flex justify-center">
                <ArrowDown className="w-8 h-8 text-[#B89B7A] animate-bounce" />
              </div>
            </div>
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={async () => {
                // 🚀 SUPABASE: Rastrear clique no botão de compra
                await trackEvent('checkout_click', {
                  button_text: 'Quero meu Guia de Estilo Agora',
                  location: 'result_page_top',
                });

                // Redirect para checkout
                window.location.href =
                  'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Quero meu Guia de Estilo Agora
              </span>
            </button>
            <div style={{ color: '#6B4F43' }}>
              <Lock className="w-4 h-4" />
              <span>Compra 100% segura</span>
            </div>
          </div>
        );

      case 'guarantee-component-real':
        return (
          <div className="bg-[#B89B7A]/10 p-8 rounded-xl border border-[#B89B7A]/30 mb-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-[#B89B7A] mx-auto mb-4" />
              <h3
                className="text-2xl font-bold text-[#432818] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Garantia de 7 Dias
              </h3>
              <p className="text-[#A38A69] max-w-2xl mx-auto">
                Experimente por 7 dias. Se não ficar completamente satisfeita com os resultados,
                devolvemos 100% do seu investimento, sem perguntas.
              </p>
            </div>
          </div>
        );

      case 'mentor-component-real':
        return (
          <div className="bg-white p-8 rounded-xl shadow-md border border-[#B89B7A]/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3
                  className="text-2xl font-bold text-[#432818] mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Sobre Gisele Galvão
                </h3>
                <p style={{ color: '#6B4F43' }}>
                  Consultora de imagem com mais de 10 anos de experiência, já transformou a vida de
                  milhares de mulheres através do poder do estilo pessoal.
                </p>
                <div className="flex items-center gap-2 text-sm text-[#B89B7A]">
                  <Star className="w-4 h-4 fill-current" />
                  <span>3000+ mulheres transformadas</span>
                </div>
              </div>
              <div className="text-center">
                <img
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                  alt="Gisele Galvão"
                  className="w-40 h-40 rounded-full mx-auto object-cover"
                />
              </div>
            </div>
          </div>
        );

      case 'value-stack-inline':
        return (
          <div className="text-center mt-10">
            <h2
              className="text-2xl md:text-3xl font-bold text-[#aa6b5d] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Vista-se de Você — na Prática
            </h2>
            <p className="text-[#432818] mb-8 max-w-xl mx-auto">
              Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção.
            </p>

            <div className="bg-white p-6 rounded-lg shadow-md border border-[#B89B7A]/20 mb-8 max-w-md mx-auto">
              <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">
                O Que Você Recebe Hoje
              </h3>

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
                    <div style={{ backgroundColor: '#FAF9F7' }}></div>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-[#f9f4ef] rounded-lg">
                <p className="text-sm text-[#aa6b5d] uppercase font-medium">Hoje por apenas</p>
                <p className="text-4xl font-bold text-[#432818]">R$ 39,00</p>
                <p style={{ color: '#8B7355' }}>Pagamento único</p>
              </div>
            </div>

            <button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
              onClick={async () => {
                // 🚀 SUPABASE: Rastrear clique no botão de compra
                await trackEvent('checkout_click', {
                  button_text: 'Garantir Meu Guia + Bônus Especiais',
                  location: 'offer_section_bottom',
                  offer_price: 'R$ 39,00',
                });

                // Redirect para checkout
                window.location.href =
                  'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Garantir Meu Guia + Bônus Especiais
              </span>
            </button>

            <div style={{ color: '#6B4F43' }}>
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                <span>Compra segura</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Garantia 7 dias</span>
              </div>
            </div>
          </div>
        );

      // FALLBACK
      default:
        return (
          <div style={{ borderColor: '#E5DDD5' }}>
            <div className="text-center">
              <div style={{ backgroundColor: '#E5DDD5' }}>
                <Code style={{ color: '#8B7355' }} />
              </div>
              <h3 style={{ color: '#6B4F43' }}>Componente: {componentType}</h3>
              <p style={{ color: '#8B7355' }}>
                Este componente agora possui um design personalizado
              </p>
              {props.title && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <h4 style={{ color: '#6B4F43' }}>{props.title}</h4>
                </div>
              )}
              {props.content && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <p style={{ color: '#6B4F43' }}>{props.content}</p>
                </div>
              )}
              {props.text && (
                <div className="bg-white rounded-lg p-3">
                  <p style={{ color: '#6B4F43' }}>{props.text}</p>
                </div>
              )}
              <div className="mt-4 p-3 bg-[#B89B7A]/10 rounded-lg">
                <p className="text-xs text-[#B89B7A]">
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
