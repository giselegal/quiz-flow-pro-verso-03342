/**
 * 🐛 BLOCKS DEBUG PANEL
 * 
 * Painel de debug para verificar se os blocos foram inicializados corretamente
 */

import React from 'react';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function BlocksDebugPanel() {
  const editorContext = useEditor({ optional: true });
  
  if (!editorContext) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Editor Context não disponível</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  
  const { state, actions } = editorContext;
  
  const totalBlocks = state.blocks?.length || 0;
  const stepsWithBlocks = Object.keys(state.blocksByStep || {});
  const legacySteps = Object.keys(state.stepBlocks || {});
  
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🐛 Blocks Debug Panel
          {totalBlocks > 0 ? (
            <Badge variant="default" className="bg-green-600">
              ✅ {totalBlocks} blocos
            </Badge>
          ) : (
            <Badge variant="destructive">
              ❌ Nenhum bloco
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estatísticas gerais */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Total de Blocos</div>
            <div className="text-2xl font-bold text-blue-600">{totalBlocks}</div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Steps com Blocos (Flat)</div>
            <div className="text-2xl font-bold text-green-600">{stepsWithBlocks.length}</div>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-600">Steps (Legacy)</div>
            <div className="text-2xl font-bold text-yellow-600">{legacySteps.length}</div>
          </div>
        </div>
        
        {/* Blocos por step */}
        {stepsWithBlocks.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Blocos por Step (Flat Structure):</h4>
            <ScrollArea className="h-[200px] border rounded-lg p-2">
              {stepsWithBlocks.map(stepId => {
                const blockIds = state.blocksByStep![stepId] || [];
                const blocks = actions.getBlocksForStep(stepId);
                
                return (
                  <div key={stepId} className="mb-2 p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold">{stepId}</span>
                      <Badge variant="outline">{blocks.length} blocos</Badge>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      Tipos: {blocks.map(b => b.type).join(', ')}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
        )}
        
        {/* Primeiros 5 blocos (sample) */}
        {totalBlocks > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Sample - Primeiros 5 Blocos:</h4>
            <ScrollArea className="h-[150px] border rounded-lg p-2">
              <pre className="text-xs">
                {JSON.stringify(state.blocks!.slice(0, 5), null, 2)}
              </pre>
            </ScrollArea>
          </div>
        )}
        
        {/* State completo */}
        <details className="border rounded-lg p-2">
          <summary className="cursor-pointer font-semibold text-sm">
            Ver State Completo
          </summary>
          <ScrollArea className="h-[300px] mt-2">
            <pre className="text-xs">
              {JSON.stringify({
                blocks: state.blocks?.length || 0,
                blocksByStep: Object.keys(state.blocksByStep || {}),
                stepBlocks: Object.keys(state.stepBlocks || {}),
                currentStep: state.currentStep,
                selectedBlockId: state.selectedBlockId
              }, null, 2)}
            </pre>
          </ScrollArea>
        </details>
      </CardContent>
    </Card>
  );
}
