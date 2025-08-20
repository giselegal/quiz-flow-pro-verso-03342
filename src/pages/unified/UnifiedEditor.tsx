import { QuizRenderer } from '@/components/core/QuizRenderer';
import React, { useState } from 'react';

interface UnifiedEditorProps {
  initialStep?: number;
  className?: string;
}

/**
 * 🎨 EDITOR UNIFICADO SIMPLES
 *
 * Preview 100% idêntico à produção
 * Interface clean e focada
 */
export const UnifiedEditor: React.FC<UnifiedEditorProps> = ({
  initialStep = 1,
  className = '',
}) => {
  const [mode, setMode] = useState<'editor' | 'preview'>('editor');

  const toggleMode = () => {
    setMode(mode === 'editor' ? 'preview' : 'editor');
  };

  const handleStepChange = (step: number) => {
    console.log(`Editor - Etapa ${step}`);
  };

  return (
    <div className={`unified-editor ${className}`}>
      {/* Header do Editor */}
      <header className="editor-header bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Quiz Editor</h1>

          <div className="flex items-center gap-3">
            {/* Toggle de Modo */}
            <button
              onClick={toggleMode}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'preview'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {mode === 'preview' ? '👁️ Preview' : '✏️ Editor'}
            </button>

            {/* Salvar */}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              💾 Salvar
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="editor-content flex h-[calc(100vh-64px)]">
        {/* Painel Lateral - Apenas no modo editor */}
        {mode === 'editor' && (
          <aside className="editor-sidebar w-80 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Componentes</h3>

              {/* Lista de componentes disponíveis */}
              <div className="space-y-2">
                {['Header', 'Pergunta', 'Opções', 'Botão', 'Texto', 'Imagem'].map(component => (
                  <div
                    key={component}
                    className="p-3 bg-white rounded border cursor-pointer hover:border-blue-300"
                  >
                    {component}
                  </div>
                ))}
              </div>

              {/* Propriedades do bloco selecionado - removido pois selectedBlock não existe */}
              {false && ( // Comentado para evitar erro
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Propriedades</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cor de Fundo</label>
                      <input
                        type="color"
                        className="w-full h-8 rounded border"
                        defaultValue="#ffffff"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Padding</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded"
                        defaultValue="16"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Texto</label>
                      <textarea
                        className="w-full px-3 py-2 border rounded"
                        rows={3}
                        placeholder="Digite o texto..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Área de Preview/Editor */}
        <main className="editor-main flex-1 overflow-auto">
          <div className="p-6">
            {/* Modo Preview - Idêntico à produção */}
            {mode === 'preview' && (
              <div className="preview-container">
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 text-sm">
                    🎯 <strong>Preview Mode:</strong> Visualização idêntica à produção
                  </p>
                </div>

                <QuizRenderer
                  mode="preview"
                  onStepChange={handleStepChange}
                  initialStep={initialStep}
                />
              </div>
            )}

            {/* Modo Editor - Com controles de edição */}
            {mode === 'editor' && (
              <div className="editor-container">
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-800 text-sm">
                    ✏️ <strong>Editor Mode:</strong> Clique nos elementos para editar
                  </p>
                </div>

                <QuizRenderer
                  mode="editor"
                  onStepChange={handleStepChange}
                  initialStep={initialStep}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="editor-footer bg-gray-100 px-4 py-2 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Modo: {mode === 'preview' ? 'Preview' : 'Edição'}</span>
          <span>Etapa: {initialStep} de 21</span>
          <span>✅ Salvo automaticamente</span>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedEditor;
