import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  Settings, 
  Play, 
  Eye,
  Code,
  Layout,
  Palette,
  Database,
  FileText
} from 'lucide-react';

// Importar todos os componentes do sistema de funil
import {
  FunnelIntroStep,
  NameCollectStep,
  QuizIntroStep,
  QuestionMultipleStep,
  QuizTransitionStep,
  ProcessingStep,
  ResultIntroStep,
  ResultDetailsStep,
  ResultGuideStep,
  OfferTransitionStep,
  OfferPageStep,
  FunnelProgressBar,
  QuizOption,
  CountdownTimer,
  ResultCard,
  StyleGuideViewer,
  OfferCard,
  FunnelConfigProvider,
  useFunnelNavigation,
  useFunnelConfig
} from '@/components/funnel-blocks';

// Importar sistema modular que criamos
import { ModularEditor } from '@/components/editor/ModularEditor';
import { ModularPropertiesPanel } from '@/components/editor/ModularPropertiesPanel';

// Dados de exemplo para demonstração
const sampleFunnelData = {
  steps: [
    {
      id: 'intro',
      stepType: 'intro' as const,
      title: 'Introdução ao Quiz',
      content: {
        title: 'Descubra Seu Estilo Ideal',
        subtitle: 'Responda nosso quiz e receba um guia personalizado',
        buttonText: 'Começar Agora',
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        backgroundImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp'
      }
    },
    {
      id: 'name-collect',
      stepType: 'name-collect' as const,
      title: 'Coleta de Nome',
      content: {
        title: 'Como podemos te chamar?',
        subtitle: 'Digite seu nome para personalizar sua experiência',
        placeholder: 'Seu nome aqui...',
        buttonText: 'Continuar'
      }
    },
    {
      id: 'quiz-intro',
      stepType: 'quiz-intro' as const,
      title: 'Introdução ao Quiz',
      content: {
        title: 'Vamos descobrir seu estilo!',
        subtitle: 'Responda 10 perguntas rápidas',
        description: 'Este quiz foi desenvolvido para identificar suas preferências e criar um guia personalizado.',
        buttonText: 'Começar Quiz'
      }
    },
    {
      id: 'question-1',
      stepType: 'question-multiple' as const,
      title: 'Pergunta 1',
      content: {
        question: 'Qual o seu tipo de roupa favorita?',
        questionNumber: 1,
        totalQuestions: 10,
        options: [
          {
            id: 'natural',
            text: 'Conforto, leveza e praticidade no vestir',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
            value: 'natural',
            category: 'natural'
          },
          {
            id: 'classico',
            text: 'Discrição, caimento clássico e sobriedade',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
            value: 'classico',
            category: 'classico'
          },
          {
            id: 'contemporaneo',
            text: 'Praticidade com um toque de estilo atual',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
            value: 'contemporaneo',
            category: 'contemporaneo'
          },
          {
            id: 'elegante',
            text: 'Elegância refinada, moderna e sem exageros',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
            value: 'elegante',
            category: 'elegante'
          }
        ]
      }
    },
    {
      id: 'result-details',
      stepType: 'result-details' as const,
      title: 'Resultado Detalhado',
      content: {
        result: {
          category: 'elegante',
          title: 'Seu Estilo é Elegante',
          description: 'Você possui uma preferência por elegância refinada, moderna e sem exageros.',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
          guideImageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp',
          recommendations: [
            'Invista em peças atemporais',
            'Prefira tecidos de qualidade',
            'Mantenha uma paleta neutra',
            'Adicione acessórios discretos'
          ]
        }
      }
    },
    {
      id: 'offer',
      stepType: 'offer-page' as const,
      title: 'Oferta Final',
      content: {
        offer: {
          title: 'Consultoria de Estilo Personalizada',
          description: 'Receba um guia completo baseado no seu resultado',
          price: 'R$ 297',
          originalPrice: 'R$ 497',
          buttonText: 'Quero minha consultoria',
          features: [
            'Análise completa do seu estilo',
            'Guia de compras personalizado',
            'Dicas de combinações',
            'Suporte por 30 dias'
          ]
        }
      }
    }
  ],
  theme: {
    primaryColor: '#B89B7A',
    secondaryColor: '#403C34',
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    fontFamily: 'Inter, sans-serif'
  },
  settings: {
    showProgressBar: true,
    autoAdvance: false,
    enableHistory: true,
    analyticsEnabled: true
  }
};

/**
 * Componente de navegação do funil
 */
const FunnelNavigator: React.FC = () => {
  const { config, currentStepIndex, setCurrentStepIndex } = useFunnelConfig();
  const { goToNextStep, goToPreviousStep, canGoNext, canGoPrevious } = useFunnelNavigation();
  
  const currentStep = config.steps[currentStepIndex];
  
  if (!currentStep) return null;
  
  return (
    <div className="space-y-4">
      {/* Barra de progresso */}
      <FunnelProgressBar
        currentStep={currentStepIndex + 1}
        totalSteps={config.steps.length}
        showPercentage={true}
        animated={true}
      />
      
      {/* Renderizar componente da etapa atual */}
      <div className="min-h-[600px] border rounded-lg overflow-hidden">
        {currentStep.stepType === 'intro' && (
          <FunnelIntroStep
            id={currentStep.id}
            stepType={currentStep.stepType}
            stepNumber={currentStepIndex + 1}
            totalSteps={config.steps.length}
            data={currentStep.content}
            onNext={goToNextStep}
          />
        )}
        
        {currentStep.stepType === 'name-collect' && (
          <NameCollectStep
            id={currentStep.id}
            stepType={currentStep.stepType}
            stepNumber={currentStepIndex + 1}
            totalSteps={config.steps.length}
            data={currentStep.content}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )}
        
        {currentStep.stepType === 'quiz-intro' && (
          <QuizIntroStep
            id={currentStep.id}
            stepType={currentStep.stepType}
            stepNumber={currentStepIndex + 1}
            totalSteps={config.steps.length}
            data={currentStep.content}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )}
        
        {currentStep.stepType === 'question-multiple' && (
          <QuestionMultipleStep
            id={currentStep.id}
            stepType={currentStep.stepType}
            stepNumber={currentStepIndex + 1}
            totalSteps={config.steps.length}
            data={currentStep.content}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )}
        
        {currentStep.stepType === 'result-details' && (
          <ResultDetailsStep
            id={currentStep.id}
            stepType={currentStep.stepType}
            stepNumber={currentStepIndex + 1}
            totalSteps={config.steps.length}
            data={currentStep.content}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )}
        
        {currentStep.stepType === 'offer-page' && (
          <OfferPageStep
            id={currentStep.id}
            stepType={currentStep.stepType}
            stepNumber={currentStepIndex + 1}
            totalSteps={config.steps.length}
            data={currentStep.content}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )}
      </div>
      
      {/* Controles de navegação */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={!canGoPrevious}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            Etapa {currentStepIndex + 1} de {config.steps.length}
          </Badge>
          <span className="text-sm text-gray-500">
            {currentStep.title}
          </span>
        </div>
        
        <Button
          onClick={goToNextStep}
          disabled={!canGoNext}
          className="flex items-center space-x-2"
        >
          <span>Próximo</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

/**
 * Demonstração de componentes compartilhados
 */
const SharedComponentsDemo: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Opções de Quiz */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Quiz Options</span>
          </CardTitle>
          <CardDescription>
            Componentes reutilizáveis para opções de pergunta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleFunnelData.steps[3].content.options?.map((option) => (
            <QuizOption
              key={option.id}
              id={option.id}
              text={option.text}
              imageUrl={option.imageUrl}
              isSelected={selectedOption === option.id}
              onClick={() => setSelectedOption(option.id)}
              size="md"
              showImage={true}
            />
          ))}
        </CardContent>
      </Card>
      
      {/* Card de Resultado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Result Card</span>
          </CardTitle>
          <CardDescription>
            Card para exibição de resultados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResultCard
            result={{
              category: 'elegante',
              title: 'Seu Estilo é Elegante',
              description: 'Você possui uma preferência por elegância refinada, moderna e sem exageros.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp'
            }}
            showButton={true}
            buttonText="Ver Detalhes"
            onButtonClick={() => console.log('Resultado clicado')}
          />
        </CardContent>
      </Card>
      
      {/* Timer de Contagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Countdown Timer</span>
          </CardTitle>
          <CardDescription>
            Timer para criar urgência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CountdownTimer
            initialTime={300} // 5 minutos
            onComplete={() => console.log('Timer finalizado')}
            showIcon={true}
            size="lg"
            color="#B89B7A"
          />
        </CardContent>
      </Card>
      
      {/* Card de Oferta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Offer Card</span>
          </CardTitle>
          <CardDescription>
            Card para exibição de ofertas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OfferCard
            offer={{
              title: 'Consultoria de Estilo',
              description: 'Receba um guia completo baseado no seu resultado',
              price: 'R$ 297',
              originalPrice: 'R$ 497',
              buttonText: 'Quero minha consultoria',
              features: [
                'Análise completa do seu estilo',
                'Guia de compras personalizado',
                'Dicas de combinações',
                'Suporte por 30 dias'
              ]
            }}
            showDiscount={true}
            onPurchase={() => console.log('Compra iniciada')}
          />
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Página principal de demonstração
 */
export default function FunnelComponentsDemo() {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedComponent, setSelectedComponent] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sistema de Componentes de Funil
              </h1>
              <p className="mt-2 text-gray-600">
                Componentes reutilizáveis, editáveis e modulares para funis completos
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                21 Etapas
              </Badge>
              <Badge variant="outline" className="text-sm">
                Modular & Flexbox
              </Badge>
              <Badge variant="default" className="text-sm bg-[#B89B7A]">
                Production Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview do Funil</span>
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center space-x-2">
              <Layout className="w-4 h-4" />
              <span>Componentes</span>
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Editor Modular</span>
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Documentação</span>
            </TabsTrigger>
          </TabsList>

          {/* Preview do Funil Completo */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Navegação Completa do Funil</CardTitle>
                <CardDescription>
                  Navegue pelas etapas do funil usando os componentes reutilizáveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FunnelConfigProvider config={sampleFunnelData}>
                  <FunnelNavigator />
                </FunnelConfigProvider>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Componentes Compartilhados */}
          <TabsContent value="components">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Componentes Compartilhados</CardTitle>
                  <CardDescription>
                    Componentes reutilizáveis usados em múltiplas etapas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SharedComponentsDemo />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Editor Modular */}
          <TabsContent value="editor">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Editor Principal */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Editor Modular Visual</CardTitle>
                    <CardDescription>
                      Editor integrado com sistema de propriedades
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ModularEditor
                      onComponentSelect={setSelectedComponent}
                      selectedComponent={selectedComponent}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Painel de Propriedades */}
              <div>
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-sm">Propriedades</CardTitle>
                    <CardDescription className="text-xs">
                      Painel modular com suporte a todos os tipos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ModularPropertiesPanel
                      selectedComponent={selectedComponent}
                      onUpdateComponent={(updates) => {
                        if (selectedComponent) {
                          setSelectedComponent({ ...selectedComponent, ...updates });
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Documentação */}
          <TabsContent value="documentation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estrutura de Componentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Etapas do Funil (Steps)</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• FunnelIntroStep - Introdução</li>
                      <li>• NameCollectStep - Coleta de nome</li>
                      <li>• QuizIntroStep - Introdução ao quiz</li>
                      <li>• QuestionMultipleStep - Perguntas (4-14)</li>
                      <li>• QuizTransitionStep - Transição</li>
                      <li>• ProcessingStep - Processamento</li>
                      <li>• ResultIntroStep - Resultado intro</li>
                      <li>• ResultDetailsStep - Detalhes do resultado</li>
                      <li>• ResultGuideStep - Guia do resultado</li>
                      <li>• OfferTransitionStep - Transição para oferta</li>
                      <li>• OfferPageStep - Página de oferta</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Componentes Compartilhados</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• FunnelProgressBar - Barra de progresso</li>
                      <li>• QuizOption - Opção de resposta</li>
                      <li>• CountdownTimer - Timer de contagem</li>
                      <li>• ResultCard - Card de resultado</li>
                      <li>• StyleGuideViewer - Visualizador de guia</li>
                      <li>• OfferCard - Card de oferta</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exemplo de Uso</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
{`import {
  FunnelConfigProvider,
  FunnelIntroStep,
  useFunnelNavigation
} from '@/components/funnel-blocks';

export default function MyFunnel() {
  const { currentStep, goToNextStep } = useFunnelNavigation({
    initialStep: 0
  });

  const funnelData = {
    steps: [
      {
        id: 'intro',
        type: 'intro',
        data: {
          title: 'Meu Quiz Personalizado',
          subtitle: 'Responda e descubra seu perfil'
        }
      }
    ]
  };

  return (
    <FunnelConfigProvider config={funnelData}>
      <FunnelIntroStep
        id="intro"
        stepType="intro"
        stepNumber={1}
        totalSteps={21}
        onNext={goToNextStep}
        data={funnelData.steps[0].data}
      />
    </FunnelConfigProvider>
  );
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
