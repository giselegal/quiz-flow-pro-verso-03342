import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  createCalculationEngine,
  DEFAULT_UNIFIED_CONFIG,
  EditorUnified,
  load21StepsTemplate,
  UnifiedEditorProvider,
} from '@/unified/editor';
import { ArrowLeft, FileDown, Save, Sparkles, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

/**
 * 🎯 QuizUnifiedPage - Página integrada com sistema unificado
 *
 * Esta página demonstra a integração completa do sistema unificado,
 * incluindo carregamento de dados, auto-save, cálculos, e analytics.
 */
const QuizUnifiedPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [savedData, setSavedData] = useState<any>(null);
  const [calculationResults, setCalculationResults] = useState<any>(null);

  // Engine de cálculo unificada
  const calculationEngine = createCalculationEngine({
    enableDebug: true,
    confidenceThreshold: 0.7,
    minAnswersRequired: 5, // Reduzido para facilitar testes
  });

  // Simula carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Dados iniciais de exemplo
      const initialData = {
        currentStep: 1,
        blocks: {
          step_1: [
            {
              id: 'welcome_block',
              type: 'text',
              properties: {
                content: 'Bem-vindo ao Quiz Unificado!',
                style: {
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#3366ff',
                },
              },
              order: 0,
              metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
              },
            },
            {
              id: 'intro_block',
              type: 'paragraph',
              properties: {
                content:
                  'Este quiz utiliza o novo sistema unificado com provider centralizado, estado global, e engine de cálculo integrada.',
                style: {
                  fontSize: '16px',
                  textAlign: 'center',
                  marginTop: '10px',
                  color: '#555555',
                },
              },
              order: 1,
              metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
              },
            },
          ],
        },
        mode: 'edit',
        isLoading: false,
        hasUnsavedChanges: false,
        lastSaved: new Date(),
      };

      setSavedData(initialData);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Handler para salvar dados
  const handleSave = async (data: any) => {
    console.log('🎯 Salvando dados unificados:', data);

    // Simula salvar no banco de dados
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setSavedData(data);
        toast({
          title: 'Dados salvos com sucesso!',
          description: `Salvos ${Object.values(data.blocks).flat().length} blocos no total.`,
          variant: 'success',
        });
        resolve();
      }, 800);
    });
  };

  // Handler para calcular resultados
  const handleCalculate = async (answers: any[]) => {
    console.log('🧮 Calculando resultados:', answers);

    // Usa a engine de cálculo unificada
    try {
      // Se não houver respostas suficientes, cria algumas para testes
      if (answers.length < 5) {
        answers = [
          {
            questionId: 'prefer_data_decisions',
            optionId: 'option_1',
            value: 4,
            type: 'scale',
            step: 1,
            timestamp: new Date(),
          },
          {
            questionId: 'like_leading_teams',
            optionId: 'option_2',
            value: 5,
            type: 'scale',
            step: 2,
            timestamp: new Date(),
          },
          {
            questionId: 'enjoy_helping_others',
            optionId: 'option_1',
            value: 3,
            type: 'scale',
            step: 3,
            timestamp: new Date(),
          },
          {
            questionId: 'creative_solutions',
            optionId: 'option_3',
            value: 2,
            type: 'scale',
            step: 4,
            timestamp: new Date(),
          },
          {
            questionId: 'detailed_planning',
            optionId: 'option_2',
            value: 4,
            type: 'scale',
            step: 5,
            timestamp: new Date(),
          },
        ];
      }

      const results = await calculationEngine.calculate(answers);

      setCalculationResults(results);
      toast({
        title: 'Cálculo concluído!',
        description: `Perfil principal: ${results.styleProfile.primaryStyle.style} (${Math.round(results.styleProfile.primaryStyle.percentage * 100)}%)`,
      });

      return results;
    } catch (error) {
      console.error('Erro no cálculo:', error);
      toast({
        title: 'Erro no cálculo',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Handler para analytics
  const handleAnalytics = async (event: any) => {
    console.log('📊 Evento de Analytics:', event);

    // Simula envio para serviço de analytics
    return Promise.resolve();
  };

  // Configuração estendida do editor unificado
  const editorConfig = {
    ...DEFAULT_UNIFIED_CONFIG,
    showToolbar: true,
    showStages: true,
    showComponents: true,
    showProperties: true,
    enableAnalytics: true,
    enableAutoSave: true,
    autoSaveInterval: 10000, // 10 segundos para testes
  };

  // Se estiver carregando, mostra spinner
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner className="mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Carregando sistema unificado...</h2>
          <p className="text-gray-500 mt-2">Inicializando componentes e serviços</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Cabeçalho */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="flex items-center"
              onClick={() => (window.location.href = '/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold text-indigo-700 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
              Quiz Unificado
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">{user?.email || 'Usuário de teste'}</div>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Reiniciar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-50"
              onClick={() => {
                const templateData = load21StepsTemplate();
                setSavedData(templateData);
                toast({
                  title: 'Template carregado!',
                  description: 'Template de 21 etapas carregado com sucesso.',
                });
              }}
            >
              <FileDown className="mr-1 h-4 w-4" />
              Carregar Template
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                if (savedData) {
                  handleSave(savedData);
                }
              }}
            >
              <Save className="mr-1 h-4 w-4" />
              Salvar Manual
            </Button>
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Provider Unificado + Editor */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-indigo-100">
          <UnifiedEditorProvider
            config={editorConfig}
            funnelId="quiz-demo-unificado"
            initialData={savedData}
            onSave={handleSave}
            onCalculate={handleCalculate}
            onAnalytics={handleAnalytics}
          >
            <EditorUnified className="h-[calc(100vh-12rem)]" />
          </UnifiedEditorProvider>
        </div>

        {/* Painel de Resultados (quando disponível) */}
        {calculationResults && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg border border-indigo-100">
            <h2 className="text-xl font-bold text-indigo-700 flex items-center mb-4">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Resultados do Cálculo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Perfil Principal */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-2">Perfil Principal</h3>
                <div className="text-2xl font-bold text-indigo-900">
                  {calculationResults.styleProfile.primaryStyle.style}
                </div>
                <div className="text-indigo-600 font-medium">
                  {Math.round(calculationResults.styleProfile.primaryStyle.percentage * 100)}%
                </div>
              </div>

              {/* Confiança */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Confiança</h3>
                <div className="text-2xl font-bold text-green-900">
                  {Math.round(calculationResults.confidence?.overall * 100)}%
                </div>
                <div className="text-green-600 font-medium">
                  {calculationResults.confidence?.factors.dataQuality}
                </div>
              </div>

              {/* Insights */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Insights</h3>
                <ul className="text-sm text-amber-800">
                  {calculationResults.insights?.map((insight: string, index: number) => (
                    <li key={index} className="mb-1">
                      • {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Distribuição */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Distribuição de Estilos</h3>
              <div className="flex flex-wrap gap-2">
                {calculationResults.distributions &&
                  Object.entries(calculationResults.distributions).map(
                    ([style, percentage]: [string, any]) => (
                      <div
                        key={style}
                        className="bg-white border border-gray-200 rounded-full px-3 py-1 text-sm"
                        style={{
                          opacity: 0.3 + (percentage as number) * 0.7,
                          fontWeight: (percentage as number) > 0.25 ? 'bold' : 'normal',
                        }}
                      >
                        {style}: {Math.round((percentage as number) * 100)}%
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizUnifiedPage;
