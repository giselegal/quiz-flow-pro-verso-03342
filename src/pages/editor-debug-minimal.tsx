import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Editor Debug Minimal - Para identificar o ponto cego
 * Versão simplificada para testar cada componente individualmente
 */
export default function EditorDebugMinimal() {
  const editorContext = useEditor();
  
  // Test se o contexto está funcionando
  if (!editorContext) {
    return (
      <div className="p-8 text-red-500">
        ❌ EditorContext não disponível
      </div>
    );
  }

  const { 
    stages,
    activeStageId,
    computed: { currentBlocks, stageCount }
  } = editorContext;

  return (
    <div className="h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>🔍 Debug Editor - Teste de Componentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Etapas:</strong> {stageCount}
              </div>
              <div>
                <strong>Etapa Ativa:</strong> {activeStageId}
              </div>
              <div>
                <strong>Blocos Atuais:</strong> {currentBlocks?.length || 0}
              </div>
              <div>
                <strong>Context OK:</strong> ✅
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4 h-[calc(100vh-200px)]">
          {/* Coluna 1: Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">📋 Etapas ({stages?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-auto">
              {stages?.slice(0, 5).map((stage) => (
                <div 
                  key={stage.id} 
                  className={`p-2 mb-2 rounded text-xs ${stage.id === activeStageId ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  {stage.name}
                </div>
              ))}
              {stages && stages.length > 5 && (
                <div className="text-xs text-gray-500">...e mais {stages.length - 5}</div>
              )}
            </CardContent>
          </Card>

          {/* Coluna 2: Components */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">🧩 Componentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['text-inline', 'image-display-inline', 'button-inline', 'quiz-question-inline'].map((comp) => (
                  <div key={comp} className="p-2 bg-gray-100 rounded text-xs">
                    {comp}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coluna 3: Canvas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">🎨 Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentBlocks?.map((block, index) => (
                  <div key={block.id || index} className="p-2 bg-blue-50 rounded text-xs">
                    {block.type}
                  </div>
                )) || <div className="text-gray-500 text-xs">Nenhum bloco</div>}
              </div>
            </CardContent>
          </Card>

          {/* Coluna 4: Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">⚙️ Propriedades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500">
                Selecione um bloco para editar
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}