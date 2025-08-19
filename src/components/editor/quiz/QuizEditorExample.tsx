/**
 * 📝 EXEMPLO DE USO DA ESTRUTURA MODULAR
 *
 * QuizEditorExample.tsx - Demonstra como usar os componentes modulares
 * Para implementação no editor com preview e edição ao vivo
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import { Edit, Eye, Play, Settings } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { QuizFlowPage } from './QuizFlowPage';

interface QuizEditorExampleProps {
  initialStep?: number;
}

export const QuizEditorExample: React.FC<QuizEditorExampleProps> = ({ initialStep = 1 }) => {
  // ========================================
  // Estado do Editor
  // ========================================
  const [mode, setMode] = useState<'editor' | 'preview' | 'production'>('editor');
  const [currentTemplate, setCurrentTemplate] = useState(QUIZ_STYLE_21_STEPS_TEMPLATE);
  const [hasChanges, setHasChanges] = useState(false);

  // ========================================
  // Configuração do Quiz
  // ========================================
  const quizConfig = {
    enableLivePreview: true,
    enableValidation: true,
    enableScoring: true,
    enableAnalytics: mode === 'production',
    theme: {
      primaryColor: '#B89B7A',
      backgroundColor: '#FEFEFE',
      textColor: '#432818',
    },
  };

  const initialData = {
    currentStep: initialStep,
    totalSteps: 21,
    sessionData: { userName: 'Usuário Teste' },
    userAnswers: {},
    stepValidation: {},
    calculatedScores: {},
    isCompleted: false,
  };

  // ========================================
  // Handlers
  // ========================================
  const handleBlocksChange = useCallback((stepId: string, blocks: Block[]) => {
    setCurrentTemplate(prev => ({
      ...prev,
      [stepId]: blocks,
    }));
    setHasChanges(true);
    console.log(`📝 Updated blocks for ${stepId}:`, blocks);
  }, []);

  const handleSave = useCallback(() => {
    // Aqui você implementaria a lógica de salvamento
    console.log('💾 Saving quiz template...', currentTemplate);
    setHasChanges(false);

    // Simular API call
    setTimeout(() => {
      console.log('✅ Quiz saved successfully!');
    }, 1000);
  }, [currentTemplate]);

  const handlePreview = useCallback(() => {
    setMode(mode === 'preview' ? 'editor' : 'preview');
  }, [mode]);

  const handlePublish = useCallback(() => {
    if (hasChanges) {
      alert('Salve as alterações antes de publicar');
      return;
    }

    setMode('production');
    console.log('🚀 Publishing quiz...');
  }, [hasChanges]);

  // ========================================
  // Render
  // ========================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Editor */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Info */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">Quiz Editor - 21 Etapas</h1>

              <Badge variant={mode === 'production' ? 'default' : 'secondary'}>
                {mode === 'editor' && '✏️ Editando'}
                {mode === 'preview' && '👁️ Preview'}
                {mode === 'production' && '🚀 Produção'}
              </Badge>

              {hasChanges && <Badge variant="destructive">Alterações não salvas</Badge>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {mode === 'editor' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreview}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className="flex items-center gap-2"
                  >
                    💾 Salvar
                  </Button>
                </>
              )}

              {mode === 'preview' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreview}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Voltar ao Editor
                  </Button>

                  <Button
                    size="sm"
                    onClick={handlePublish}
                    className="flex items-center gap-2"
                    style={{ backgroundColor: quizConfig.theme.primaryColor }}
                  >
                    <Play className="h-4 w-4" />
                    Publicar
                  </Button>
                </>
              )}

              {mode === 'production' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMode('editor')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Configurações
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <QuizFlowPage
        mode={mode}
        template={currentTemplate}
        onBlocksChange={handleBlocksChange}
        initialData={initialData}
        customConfig={quizConfig}
      />

      {/* Footer/Status */}
      {mode === 'editor' && (
        <div className="fixed bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
          <div className="text-sm text-gray-600">
            <div className="font-medium">Status do Editor</div>
            <div className="mt-1 space-y-1 text-xs">
              <div>Template: {Object.keys(currentTemplate).length} etapas</div>
              <div>Modo: {mode}</div>
              <div>Alterações: {hasChanges ? 'Sim' : 'Não'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizEditorExample;
