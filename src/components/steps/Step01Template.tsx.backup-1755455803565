import ConnectedTemplateWrapper from '@/components/quiz/ConnectedTemplateWrapper';
import ConnectedLeadForm from '@/components/forms/ConnectedLeadForm';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface Step01TemplateProps {
  sessionId: string;
  onNext?: () => void;
}

/**
 * 🎯 STEP 01: INTRODUÇÃO AO QUIZ DE ESTILO
 * ✅ CONECTADO AOS HOOKS: useQuizLogic + useSupabaseQuiz
 *
 * Template de introdução que estabelece expectativas e prepara o usuário
 * - Boas-vindas elegante com brand colors
 * - Explicação do que será descoberto
 * - Motivação para começar o quiz
 * - Integração com styleConfig.ts (8 estilos)
 * - 🚀 Navegação premium integrada
 * - 🔗 ConnectedTemplateWrapper para capturar nome do usuário
 */
export default function Step01Template({ sessionId, onNext }: Step01TemplateProps) {
  return (
    <ConnectedTemplateWrapper stepNumber={1} stepType="intro" sessionId={sessionId}>
      {/* 🚀 NAVEGAÇÃO PREMIUM */}
      <QuizNavigation
        canProceed={true}
        onNext={onNext || (() => {})}
        currentQuestionType="normal"
        selectedOptionsCount={3}
        isLastQuestion={false}
        currentStep={1}
        totalSteps={21}
        stepName="Bem-vindo ao Quiz de Estilo"
        showUserInfo={false}
        sessionId={sessionId}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-white to-[#B89B7A]/10">
        {/* Resto do conteúdo permanece igual */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center space-y-8">
            {/* Logo e boas-vindas */}
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto">
                <img
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                  alt="Gisele Galvão Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="inline-flex items-center space-x-2 bg-[#B89B7A]/10 rounded-full px-4 py-2">
                <Sparkles className="h-5 w-5 text-[#B89B7A]" />
                <span className="text-sm font-medium text-[#432818]">
                  Quiz de Descoberta de Estilo
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-[#432818] leading-tight">
                Descubra Seu Estilo
                <span className="block text-[#B89B7A]">Único e Autêntico</span>
              </h1>

              <p className="text-xl text-[#6B4F43] max-w-2xl mx-auto leading-relaxed">
                Em apenas alguns minutos, vamos revelar qual dos 8 estilos representa perfeitamente
                sua personalidade e criar seu guia personalizado.
              </p>
            </div>

            {/* Cards dos 8 estilos */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Natural', color: '#8B7355', letter: 'A' },
                { name: 'Clássico', color: '#432818', letter: 'B' },
                { name: 'Contemporâneo', color: '#6B4F43', letter: 'C' },
                { name: 'Elegante', color: '#B89B7A', letter: 'D' },
                { name: 'Romântico', color: '#D4B5A0', letter: 'E' },
                { name: 'Sexy', color: '#8B4513', letter: 'F' },
                { name: 'Dramático', color: '#654321', letter: 'G' },
                { name: 'Criativo', color: '#A0522D', letter: 'H' },
              ].map(style => (
                <Card
                  key={style.name}
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3"
                      style={{ backgroundColor: style.color }}
                    >
                      {style.letter}
                    </div>
                    <h3 className="font-semibold text-[#432818] text-sm">{style.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Benefícios */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-[#432818]">O que você vai descobrir:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <h3 className="font-semibold text-[#432818]">Seu Estilo Único</h3>
                    <p className="text-[#6B4F43] text-sm">
                      Qual dos 8 perfis de estilo combina perfeitamente com você
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💡</span>
                    </div>
                    <h3 className="font-semibold text-[#432818]">Guia Personalizado</h3>
                    <p className="text-[#6B4F43] text-sm">
                      Recomendações específicas para seu guarda-roupa ideal
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🛍️</span>
                    </div>
                    <h3 className="font-semibold text-[#432818]">Dicas Práticas</h3>
                    <p className="text-[#6B4F43] text-sm">
                      Como combinar peças, cores ideais e onde comprar
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress indicator */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="outline" className="border-[#B89B7A] text-[#432818]">
                  Etapa 1 de 21
                </Badge>
                <Badge variant="outline" className="border-[#B89B7A] text-[#432818]">
                  ⏱️ 3-5 minutos
                </Badge>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-[#B89B7A] to-[#432818] h-2 rounded-full transition-all duration-300"
                  style={{ width: '4.76%' }} // 1/21 = 4.76%
                ></div>
              </div>
            </div>

            {/* Call to action with connected form */}
            <Card className="bg-gradient-to-r from-[#B89B7A] to-[#432818] text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Pronta para descobrir seu estilo?</h3>
                <p className="text-white/90 mb-6 max-w-xl mx-auto">
                  Vamos começar capturando seu nome para personalizar sua experiência e depois
                  descobrir juntas qual estilo reflete sua verdadeira essência.
                </p>

                {/* ✅ FORMULÁRIO CONECTADO AOS HOOKS */}
                <ConnectedLeadForm
                  onSubmit={data => {
                    console.log('✅ Step01: Nome capturado via ConnectedLeadForm:', data.name);
                    // Avançar para próxima etapa após capturar nome
                    setTimeout(() => onNext && onNext(), 500);
                  }}
                  className="text-left"
                />

                <p className="text-xs text-white/70 mt-4">Sessão: {sessionId}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ConnectedTemplateWrapper>
  );
}

// ✅ BACKUP: Template original de blocos para compatibilidade
export const getStep01Template = () => {
  return [
    {
      id: 'step01-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 0,
        progressMax: 100,
        showBackButton: false,
        showProgress: false,
      },
    },
    {
      id: 'intro-decorative-bar',
      type: 'decorative-bar-inline',
      properties: {
        width: '100%',
        height: 4,
        color: '#B89B7A',
        backgroundColor: '#B89B7A',
        marginTop: 0,
        marginBottom: 24,
      },
    },
    {
      id: 'intro-main-title',
      type: 'text-inline',
      properties: {
        content:
          '<span style="color: #B89B7A">Chega</span> de um guarda-roupa lotado e da sensação de que nada combina com <span style="color: #B89B7A">Você</span>.',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
      },
    },
    {
      id: 'intro-image',
      type: 'image-display-inline',
      properties: {
        src: 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
        alt: 'Descubra seu estilo predominante',
        width: 300,
        height: 204,
        containerPosition: 'center',
        marginBottom: 16,
      },
    },
    {
      id: 'intro-subtitle',
      type: 'text-inline',
      properties: {
        content: 'Descubra seu <strong>ESTILO PREDOMINANTE</strong> em apenas alguns minutos!',
        fontSize: 'text-lg',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24,
      },
    },
    {
      id: 'intro-form-container',
      type: 'form-container',
      properties: {
        backgroundColor: 'transparent',
        marginTop: 0,
        marginBottom: 16,
        paddingTop: 0,
        paddingBottom: 0,
        requireNameToEnableButton: true, // ✅ Habilitar validação de botão
        targetButtonId: 'intro-cta-button', // ✅ ID do botão principal
        visuallyDisableButton: true, // ✅ Feedback visual
      },
      children: [
        {
          id: 'intro-form-input', // ✅ ID PRINCIPAL para validação
          type: 'form-input',
          properties: {
            inputType: 'text',
            placeholder: 'Digite seu primeiro nome aqui...',
            label: 'Como posso te chamar?',
            required: true,
            name: 'userName', // ✅ Nome para identificar campo principal
            backgroundColor: '#ffffff',
            borderColor: '#B89B7A',
            marginBottom: 16,
          },
        },
        {
          id: 'intro-cta-button', // ✅ ID PRINCIPAL para eventos de botão
          type: 'button-inline',
          properties: {
            text: 'Quero Descobrir meu Estilo Agora!',
            variant: 'primary',
            size: 'lg',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            requiresValidInput: true,
            watchInputId: 'intro-form-input',
            nextStepUrl: '/quiz/step-2',
            nextStepId: 'step-2',
            disabledText: 'Digite seu nome para continuar',
            showDisabledState: true,
            disabledOpacity: 0.6,
          },
        },
      ],
    },
  ];
};
