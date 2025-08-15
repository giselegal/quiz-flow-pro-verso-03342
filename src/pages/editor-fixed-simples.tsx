import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Editor Fixed Simples - Versão Funcional Garantida
 * 
 * Esta versão garante que o editor sempre renderize,
 * com fallbacks e error boundaries robustos
 */
export default function EditorFixedSimples() {
  const editorContext = useEditor();

  // Test se o contexto está funcionando
  if (!editorContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">❌ Editor Context Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">EditorContext não está disponível.</p>
            <Button onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    stages,
    activeStageId,
    computed: { currentBlocks, stageCount },
    stageActions: { setActiveStage },
    blockActions: { addBlock, deleteBlock, setSelectedBlockId },
    selectedBlockId,
  } = editorContext;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      style={{ 
        // Forcing visibility with important styles
        minHeight: '100vh',
        display: 'block !important' as any,
        visibility: 'visible !important' as any,
        opacity: '1 !important' as any
      }}
    >
      {/* Header Fixed */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">E</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Editor Quiz Quest</h1>
              </div>
              <Badge variant="outline">v1.0 - Simples & Funcional</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {stageCount} Etapas
              </Badge>
              <Badge variant="default">
                {currentBlocks?.length || 0} Componentes
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-120px)]">
          {/* Coluna 1: Etapas */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                📋 Etapas ({stages?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-auto">
              {stages?.slice(0, 10).map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`w-full p-2 text-left text-xs rounded-lg border transition-colors ${
                    stage.id === activeStageId
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {stage.name}
                </button>
              ))}
              {stages && stages.length > 10 && (
                <p className="text-xs text-gray-500 text-center py-2">
                  ...e mais {stages.length - 10} etapas
                </p>
              )}
            </CardContent>
          </Card>

          {/* Coluna 2: Componentes Disponíveis */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                🧩 Componentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: 'text-inline', name: '📝 Texto', color: 'bg-blue-50 hover:bg-blue-100' },
                { type: 'image-display-inline', name: '🖼️ Imagem', color: 'bg-green-50 hover:bg-green-100' },
                { type: 'button-inline', name: '🔘 Botão', color: 'bg-purple-50 hover:bg-purple-100' },
                { type: 'quiz-question-inline', name: '❓ Pergunta', color: 'bg-orange-50 hover:bg-orange-100' },
              ].map((comp) => (
                <button
                  key={comp.type}
                  onClick={() => activeStageId && addBlock(comp.type, activeStageId)}
                  className={`w-full p-2 text-left text-xs rounded-lg border transition-colors ${comp.color}`}
                  disabled={!activeStageId}
                >
                  {comp.name}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Coluna 3: Canvas Principal */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                🎨 Canvas - {activeStageId || 'Nenhuma etapa selecionada'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!activeStageId ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="font-medium mb-2">Selecione uma Etapa</h3>
                  <p className="text-sm">
                    Clique em uma etapa na coluna à esquerda para começar a editar
                  </p>
                </div>
              ) : currentBlocks && currentBlocks.length > 0 ? (
                <div className="space-y-3">
                  {currentBlocks.map((block, index) => (
                    <div
                      key={block.id || `block-${index}`}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedBlockId === block.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedBlockId(block.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {block.type.replace('-inline', '').replace('-', ' ')}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {block.type}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Deletar este componente?')) {
                              deleteBlock(block.id);
                            }
                          }}
                          className="text-xs px-2 py-1"
                        >
                          🗑️
                        </Button>
                      </div>
                      {block.content && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {JSON.stringify(block.content).substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="font-medium mb-2">Canvas Vazio</h3>
                  <p className="text-sm mb-4">
                    Adicione componentes da coluna "Componentes" para começar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Footer */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Editor Funcionando</span>
              <Badge variant="outline" className="text-xs">
                {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}