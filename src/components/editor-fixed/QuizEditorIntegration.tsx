// =============================================================================
// INTEGRAÇÃO DO EDITOR DE QUIZ NO SISTEMA EDITOR-FIXED
// Quiz Quest Challenge Verse - Sistema de Quiz Integrado
// =============================================================================

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { ArrowRight, BookOpen, Database, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Importar o editor de quiz funcional
import { useSupabaseQuizEditor } from '@/hooks/useSupabaseQuizEditor';
import { IntegratedQuizEditor } from '../editor/quiz-specific/IntegratedQuizEditor';

// =============================================================================
// INTERFACE PARA INTEGRAÇÃO
// =============================================================================

interface QuizEditorFixedProps {
  onQuizSave?: (quizData: any) => void;
  onQuizLoad?: (quizId: string) => void;
  initialData?: any;
  mode?: 'standalone' | 'integrated' | 'embedded';
}

// =============================================================================
// COMPONENTE PRINCIPAL DE INTEGRAÇÃO
// =============================================================================

export const QuizEditorFixed: React.FC<QuizEditorFixedProps> = ({
  onQuizSave,
  onQuizLoad,
  initialData,
  mode = 'integrated',
}) => {
  const [currentTab, setCurrentTab] = useState('editor');
  const [integrationStatus, setIntegrationStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');

  // Hook do editor de quiz
  const { isLoading, testConnection, saveQuiz, loadAllQuizzes, connectionStatus } =
    useSupabaseQuizEditor();

  // =============================================================================
  // EFEITOS E INICIALIZAÇÃO
  // =============================================================================

  useEffect(() => {
    initializeIntegration();
  }, []);

  const initializeIntegration = async () => {
    setIntegrationStatus('loading');

    try {
      console.log('🚀 Inicializando integração do Quiz Editor...');

      // Testar conexão com Supabase
      const isConnected = await testConnection();

      if (isConnected) {
        console.log('✅ Conexão com Supabase estabelecida');
        setIntegrationStatus('ready');
        toast({
          title: 'Editor de Quiz Integrado',
          description: 'Sistema pronto para uso com Supabase conectado',
        });
      } else {
        console.log('⚠️ Conexão com Supabase não disponível - modo offline');
        setIntegrationStatus('ready');
        toast({
          title: 'Editor de Quiz - Modo Offline',
          description: 'Sistema funcionando com localStorage como backup',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      setIntegrationStatus('error');
      toast({
        title: 'Erro na Integração',
        description: 'Falha ao inicializar o editor de quiz',
        variant: 'destructive',
      });
    }
  };

  // =============================================================================
  // HANDLERS DE EVENTOS
  // =============================================================================

  const handleQuizSave = async (quizData: any) => {
    try {
      const result = await saveQuiz(quizData);
      if (result && onQuizSave) {
        onQuizSave(quizData);
      }
      return result;
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      throw error;
    }
  };

  const handleQuizLoad = (quizId: string) => {
    if (onQuizLoad) {
      onQuizLoad(quizId);
    }
  };

  // =============================================================================
  // RENDERIZAÇÃO CONDICIONAL POR MODO
  // =============================================================================

  if (mode === 'embedded') {
    return (
      <div className="w-full h-full">
        <IntegratedQuizEditor />
      </div>
    );
  }

  if (mode === 'standalone') {
    return (
      <div className="container mx-auto py-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quiz Editor - Modo Standalone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IntegratedQuizEditor />
          </CardContent>
        </Card>
      </div>
    );
  }

  // =============================================================================
  // MODO INTEGRADO (PADRÃO)
  // =============================================================================

  return (
    <div className="w-full space-y-6">
      {/* Header da Integração */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quiz Editor Integration
            </CardTitle>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  integrationStatus === 'ready'
                    ? 'bg-green-500'
                    : integrationStatus === 'loading'
                      ? 'bg-yellow-500'
                      : integrationStatus === 'error'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                }`}
              />
              <span className="text-sm text-gray-600">
                {integrationStatus === 'ready'
                  ? 'Pronto'
                  : integrationStatus === 'loading'
                    ? 'Carregando...'
                    : integrationStatus === 'error'
                      ? 'Erro'
                      : 'Inicializando'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Supabase</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Status: {connectionStatus ? 'Conectado' : 'Offline'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Editor</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Sistema: Ativo</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Integração</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Modo: {mode}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Editor Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Editor de Quiz Integrado</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-6">
              <IntegratedQuizEditor />
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Preview será exibido aqui após criar um quiz</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Integração</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={initializeIntegration}
                      disabled={integrationStatus === 'loading'}
                    >
                      Reconectar Sistema
                    </Button>
                    <Button variant="outline" onClick={() => testConnection()}>
                      Testar Conexão
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Status do Sistema:</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• Editor: Integrado e Funcional</li>
                      <li>• Supabase: {connectionStatus ? 'Conectado' : 'Desconectado'}</li>
                      <li>• LocalStorage: Backup Ativo</li>
                      <li>• Modo: {mode}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// =============================================================================
// EXPORT E COMPONENTES AUXILIARES
// =============================================================================

export default QuizEditorFixed;

// Componente simplificado para uso rápido
export const SimpleQuizEditorFixed = () => <QuizEditorFixed mode="embedded" />;

// Componente standalone para páginas dedicadas
export const StandaloneQuizEditorFixed = () => <QuizEditorFixed mode="standalone" />;
