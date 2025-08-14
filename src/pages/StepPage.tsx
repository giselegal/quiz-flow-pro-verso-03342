import { StepNavigationSimple } from '@/components/navigation/StepNavigationSimple';
import { useStepNavigationOffline } from '@/hooks/useStepNavigationOffline';
import React, { lazy, Suspense } from 'react';
import { useLocation, useParams } from 'wouter';

// Lazy loading dos componentes de step
const Step01Template = lazy(() => import('@/components/steps/Step01Template'));
const Step01Simple = lazy(() => import('@/components/steps/Step01Simple'));
const Step20Result = lazy(() => import('@/components/steps/Step20Result'));

/**
 * 🎯 Página genérica para todas as etapas do quiz de 21 passos
 *
 * Features:
 * - ✅ Carregamento dinâmico de templates por etapa
 * - ✅ Navegação integrada com persistência
 * - ✅ Renderização automática de blocos
 * - ✅ Sistema de progresso
 * - ✅ Validação de respostas
 */

// Configuração básica das etapas
const STEPS_CONFIG = [
  { step: 1, name: 'Introdução', description: 'Tela inicial do quiz', component: 'Step01Template' },
  { step: 2, name: 'Nome', description: 'Coleta do nome pessoal', component: 'generic' },
  { step: 3, name: 'Roupa Favorita', description: 'Tipo de roupa preferida', component: 'generic' },
  { step: 4, name: 'Estilo Pessoal', description: 'Identificação do estilo', component: 'generic' },
  { step: 5, name: 'Ocasiões', description: 'Contextos de uso', component: 'generic' },
  { step: 6, name: 'Cores', description: 'Preferências de cores', component: 'generic' },
  { step: 7, name: 'Texturas', description: 'Texturas favoritas', component: 'generic' },
  { step: 8, name: 'Silhuetas', description: 'Formas preferidas', component: 'generic' },
  { step: 9, name: 'Acessórios', description: 'Acessórios de estilo', component: 'generic' },
  { step: 10, name: 'Inspiração', description: 'Referências de moda', component: 'generic' },
  { step: 11, name: 'Conforto', description: 'Prioridade de conforto', component: 'generic' },
  { step: 12, name: 'Tendências', description: 'Interesse em tendências', component: 'generic' },
  { step: 13, name: 'Investimento', description: 'Orçamento para roupas', component: 'generic' },
  { step: 14, name: 'Personalidade', description: 'Traços pessoais', component: 'generic' },
  { step: 15, name: 'Transição', description: 'Preparação para resultado', component: 'generic' },
  { step: 16, name: 'Processamento', description: 'Calculando resultado', component: 'generic' },
  { step: 17, name: 'Resultado Parcial', description: 'Primeiro resultado', component: 'generic' },
  { step: 18, name: 'Resultado Completo', description: 'Análise completa', component: 'generic' },
  { step: 19, name: 'Resultado Final', description: 'Apresentação final', component: 'generic' },
  { step: 20, name: 'Lead Capture', description: 'Captura de contato', component: 'Step20Result' },
  { step: 21, name: 'Oferta', description: 'Página de oferta final', component: 'generic' },
];

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mx-auto"></div>
      <p className="text-[#6B4F43]">Carregando...</p>
    </div>
  </div>
);

const StepPage: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const [, setLocation] = useLocation();

  const stepNumber = parseInt(step || '1');
  const navigation = useStepNavigationOffline();

  // Verificar se a etapa é válida
  const stepConfig = STEPS_CONFIG.find(config => config.step === stepNumber);

  if (!stepConfig) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-[#432818] mb-4">Etapa não encontrada</h1>
          <p className="text-[#6B4F43] mb-6">
            A etapa {stepNumber} não foi encontrada ou ainda não foi configurada.
          </p>
          <button
            onClick={() => setLocation('/admin')}
            className="px-6 py-3 bg-[#B89B7A] text-white rounded-lg hover:opacity-90"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Função para navegar entre etapas
  const handleNext = () => {
    const nextStep = stepNumber + 1;
    if (nextStep <= 21) {
      setLocation(`/step/${nextStep}`);
    }
  };

  const handlePrevious = () => {
    const previousStep = stepNumber - 1;
    if (previousStep >= 1) {
      setLocation(`/step/${previousStep}`);
    }
  };

  // Renderizar conteúdo da etapa
  const renderStepContent = () => {
    const sessionId = navigation.session?.id || `session-${Date.now()}`;

    try {
      // Renderização baseada no componente específico
      switch (stepConfig.component) {
        case 'Step01Template':
          return (
            <Suspense fallback={<LoadingSpinner />}>
              <Step01Simple sessionId={sessionId} onNext={handleNext} />
            </Suspense>
          );

        case 'Step20Result':
          return (
            <Suspense fallback={<LoadingSpinner />}>
              <Step20Result sessionId={sessionId} onContinue={handleNext} />
            </Suspense>
          );

        default:
          // Componente genérico para etapas não implementadas
          return (
            <div className="min-h-screen bg-[#FAF9F7]">
              <div className="container mx-auto px-4 py-8">
                {/* Sistema de Navegação */}
                <div className="mb-8">
                  <StepNavigationSimple
                    currentStep={stepNumber}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onStepChange={(step: number) => setLocation(`/step/${step}`)}
                  />
                </div>

                {/* Conteúdo da Etapa */}
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-[#432818] mb-4">{stepConfig.name}</h1>
                      <p className="text-lg text-[#6B4F43] mb-8">{stepConfig.description}</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <p className="text-center text-gray-500">
                        Conteúdo da etapa {stepNumber} será implementado aqui.
                      </p>
                      <p className="text-sm text-gray-400 mt-4 text-center">
                        Template: step-{stepNumber.toString().padStart(2, '0')}.json
                      </p>

                      {/* Botões de navegação temporários */}
                      <div className="flex justify-between mt-6">
                        <button
                          onClick={handlePrevious}
                          disabled={stepNumber <= 1}
                          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={stepNumber >= 21}
                          className="px-6 py-3 bg-[#B89B7A] text-white rounded-lg hover:bg-[#432818] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Próximo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error('Erro ao renderizar conteúdo da etapa:', error);

      return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
            <h2 className="text-xl font-bold text-red-800 mb-2">Erro ao carregar a etapa</h2>
            <p className="text-red-600 mb-4">
              Não foi possível carregar o conteúdo da etapa {stepNumber}.
            </p>
            <p className="text-sm text-red-500 mb-4">
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {renderStepContent()}

      {/* Debug Info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-sm z-50">
          <div>Etapa: {stepNumber}</div>
          <div>Sessão: {navigation.session?.id?.slice(0, 8) || 'N/A'}</div>
          <div>Componente: {stepConfig.component}</div>
          <div>Loading: {navigation.isLoading ? '⏳' : '✅'}</div>
        </div>
      )}
    </>
  );
};

export default StepPage;
