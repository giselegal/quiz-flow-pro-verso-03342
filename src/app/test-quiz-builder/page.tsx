/**
 * 🧪 PÁGINA DE TESTE - SISTEMA NOCODE PROPERTIES PANEL
 * 
 * Demonstração completa do sistema de propriedades NOCODE implementado
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NoCodeEditorIntegration from '@/components/editor/properties/NoCodeEditorIntegration';
import type { Block } from '@/types/editor';

// Mock de bloco para teste
const mockBlock: Block = {
  id: 'test-block-1',
  type: 'text-inline',
  order: 0,
  properties: {
    title: 'Olá, {userName}!',
    subtitle: 'Seu estilo é {resultStyle}',
    fontSize: 'text-xl',
    color: '#B89B7A',
    textAlign: 'center'
  },
  content: {
    htmlContent: '<p>Conteúdo com <strong>{userName}</strong> - {resultPercentage}% de afinidade</p>',
    text: 'Texto simples aqui'
  }
};

export default function TestQuizBuilderPage() {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(mockBlock);
  const [activeStage] = useState('step-1');

  const handleUpdate = (blockId: string, updates: Record<string, any>) => {
    console.log('📝 Atualizando bloco:', { blockId, updates });
    
    if (selectedBlock && selectedBlock.id === blockId) {
      setSelectedBlock({
        ...selectedBlock,
        ...updates
      });
    }
  };

  const handleDuplicate = (blockId: string) => {
    console.log('📋 Duplicando bloco:', blockId);
  };

  const handleDelete = (blockId: string) => {
    console.log('🗑️ Deletando bloco:', blockId);
    setSelectedBlock(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Sistema NOCODE - Painel de Propriedades
              <Badge variant="secondary">Versão Completa</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button 
                variant={selectedBlock ? "default" : "outline"}
                onClick={() => setSelectedBlock(mockBlock)}
              >
                Selecionar Bloco de Teste
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedBlock(null)}
              >
                Desselecionar
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Funcionalidades Implementadas:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>✅ Extração universal de propriedades</li>
                  <li>✅ Sistema de interpolação visual</li>
                  <li>✅ Categorização inteligente</li>
                  <li>✅ Validação em tempo real</li>
                  <li>✅ Preview instantâneo</li>
                </ul>
              </div>
              <div>
                <strong>Variáveis Dinâmicas:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code>{'{userName}'}</code> - Ana Silva</li>
                  <li><code>{'{resultStyle}'}</code> - Clássico Elegante</li>
                  <li><code>{'{quizStep}'}</code> - 1</li>
                  <li><code>{'{offerPrice}'}</code> - R$ 197</li>
                  <li><code>{'{resultPercentage}'}</code> - 87%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
          {/* Preview do Bloco */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Preview do Bloco</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedBlock ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded">
                      <div className="text-lg font-semibold">
                        {selectedBlock.properties?.title || 'Título não definido'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedBlock.properties?.subtitle || 'Subtítulo não definido'}
                      </div>
                      <div 
                        className="mt-2"
                        dangerouslySetInnerHTML={{ 
                          __html: selectedBlock.content?.htmlContent || selectedBlock.content?.text || 'Conteúdo não definido'
                        }}
                      />
                    </div>
                    
                    <div className="text-xs space-y-1">
                      <div><strong>ID:</strong> {selectedBlock.id}</div>
                      <div><strong>Tipo:</strong> {selectedBlock.type}</div>
                      <div><strong>Propriedades:</strong> {JSON.stringify(selectedBlock.properties, null, 2)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    Nenhum bloco selecionado
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Painel de Propriedades NOCODE */}
          <div className="h-full">
            <NoCodeEditorIntegration
              selectedBlock={selectedBlock}
              activeStageId={activeStage}
              onUpdate={handleUpdate}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}