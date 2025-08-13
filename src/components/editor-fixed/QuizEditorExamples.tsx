// =============================================================================
// EXEMPLO DE USO DA INTEGRAÇÃO DO QUIZ EDITOR
// Quiz Quest Challenge Verse - Demonstração Prática
// =============================================================================

import React from 'react';
import {
  QuizEditorFixed,
  SimpleQuizEditorFixed,
  StandaloneQuizEditorFixed,
} from './QuizEditorIntegration';

// =============================================================================
// EXEMPLO 1: USO SIMPLES (EMBEDDED)
// =============================================================================

export const ExemploSimples = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quiz Editor - Uso Simples</h1>
      <SimpleQuizEditorFixed />
    </div>
  );
};

// =============================================================================
// EXEMPLO 2: USO INTEGRADO COM CALLBACKS
// =============================================================================

export const ExemploIntegrado = () => {
  const handleQuizSave = (quizData: any) => {
    console.log('Quiz salvo:', quizData);
    // Aqui você pode adicionar lógica personalizada
  };

  const handleQuizLoad = (quizId: string) => {
    console.log('Carregando quiz:', quizId);
    // Lógica para carregar quiz específico
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Quiz Editor - Integração Completa</h1>
      <QuizEditorFixed
        mode="integrated"
        onQuizSave={handleQuizSave}
        onQuizLoad={handleQuizLoad}
        initialData={{
          title: 'Quiz Exemplo',
          description: 'Um quiz de exemplo',
        }}
      />
    </div>
  );
};

// =============================================================================
// EXEMPLO 3: USO STANDALONE (PÁGINA DEDICADA)
// =============================================================================

export const ExemploStandalone = () => {
  return <StandaloneQuizEditorFixed />;
};

// =============================================================================
// EXEMPLO 4: USO EM MODAL/DIALOG
// =============================================================================

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const ExemploModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir Editor de Quiz</Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Editor de Quiz</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <QuizEditorFixed mode="embedded" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// EXEMPLO 5: USO EM TAB DO EDITOR-FIXED
// =============================================================================

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ExemploTabIntegrada = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Editor Padrão</TabsTrigger>
          <TabsTrigger value="quiz">Quiz Editor</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-6">
          <div className="p-6 border rounded-lg">
            <p>Conteúdo do Editor Padrão aqui...</p>
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <QuizEditorFixed mode="embedded" />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="p-6 border rounded-lg">
            <p>Configurações gerais do sistema...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// =============================================================================
// EXEMPLO COMPLETO: DASHBOARD COM QUIZ EDITOR
// =============================================================================

export const DashboardComQuizEditor = () => {
  const [activeView, setActiveView] = React.useState<'dashboard' | 'quiz' | 'analytics'>(
    'dashboard'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Quiz Quest Challenge Verse</h1>
            <nav className="flex space-x-4">
              <Button
                variant={activeView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setActiveView('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant={activeView === 'quiz' ? 'default' : 'outline'}
                onClick={() => setActiveView('quiz')}
              >
                Quiz Editor
              </Button>
              <Button
                variant={activeView === 'analytics' ? 'default' : 'outline'}
                onClick={() => setActiveView('analytics')}
              >
                Analytics
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {activeView === 'dashboard' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <p>Conteúdo do dashboard...</p>
          </div>
        )}

        {activeView === 'quiz' && (
          <div>
            <QuizEditorFixed
              mode="integrated"
              onQuizSave={data => {
                console.log('Quiz salvo no dashboard:', data);
              }}
            />
          </div>
        )}

        {activeView === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p>Métricas e relatórios...</p>
          </div>
        )}
      </main>
    </div>
  );
};

// =============================================================================
// EXPORTAR TODOS OS EXEMPLOS
// =============================================================================

export default {
  ExemploSimples,
  ExemploIntegrado,
  ExemploStandalone,
  ExemploModal,
  ExemploTabIntegrada,
  DashboardComQuizEditor,
};
