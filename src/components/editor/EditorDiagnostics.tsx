/**
 * 🔍 FIX 1.5: DIAGNÓSTICO VISUAL
 * 
 * Painel debug para observabilidade do editor (DEV only)
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEditor } from '@/hooks/useEditor';
import { Bug, X } from 'lucide-react';

export const EditorDiagnostics: React.FC = () => {
  const [show, setShow] = useState(false);
  // Torna o uso do contexto opcional para evitar crashes em ambientes de teste/rotas sem provider
  const editor = useEditor({ optional: true });

  // Só em desenvolvimento
  if (!import.meta.env.DEV) return null;

  // Se o provider não estiver presente, não renderiza nada (evita lançar erro em testes de rota mínima)
  if (!editor) return null;

  const stepBlocks = editor.state.stepBlocks || {};
  const stepCount = Object.keys(stepBlocks).length;
  const totalBlocks = Object.values(stepBlocks).reduce((sum, blocks) => sum + blocks.length, 0);

  // Detectar modo
  let mode = 'unknown';
  let modeLabel = '❓ Desconhecido';
  let modeColor = 'bg-gray-500';

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const hasTemplate = Boolean(params.get('template'));
    const hasFunnel = Boolean(params.get('funnelId'));

    if (hasTemplate && !hasFunnel) {
      mode = 'template';
      modeLabel = '🎨 Template (Local)';
      modeColor = 'bg-blue-500';
    } else if (hasFunnel) {
      mode = 'funnel';
      modeLabel = '💾 Funnel (Supabase)';
      modeColor = 'bg-green-500';
    }
  }

  const supabaseStatus = editor.state.databaseMode === 'online' ? '✅ Ativo' : '❌ Local';

  return (
    <>
      <Button
        onClick={() => setShow(!show)}
        size="sm"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 gap-2 shadow-lg"
      >
        <Bug className="h-4 w-4" />
        Diagnóstico
      </Button>

      {show && (
        <Card className="fixed bottom-16 right-4 z-50 w-96 max-h-[600px] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">🔍 Editor Diagnostics</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShow(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-3 text-xs overflow-auto max-h-[500px]">
            {/* Modo */}
            <div className="space-y-1">
              <div className="font-semibold">Modo de Operação</div>
              <Badge className={`${modeColor} text-white`}>
                {modeLabel}
              </Badge>
            </div>

            {/* Supabase */}
            <div className="space-y-1">
              <div className="font-semibold">Supabase Status</div>
              <div className="font-mono">{supabaseStatus}</div>
            </div>

            {/* Database Mode */}
            <div className="space-y-1">
              <div className="font-semibold">Database Mode</div>
              <div className="font-mono">{editor.state.databaseMode || 'local'}</div>
            </div>

            {/* Steps Carregados */}
            <div className="space-y-1">
              <div className="font-semibold">Steps Carregados</div>
              <div className="font-mono">
                {stepCount} steps / {totalBlocks} blocos
              </div>
            </div>

            {/* Fontes por Step */}
            <div className="space-y-1">
              <div className="font-semibold">Fontes de Dados</div>
              <div className="space-y-1 max-h-40 overflow-auto">
                {Object.keys(stepBlocks).length > 0 ? (
                  Object.keys(stepBlocks)
                    .sort()
                    .map((stepKey) => {
                      const blocks = stepBlocks[stepKey];

                      return (
                        <div key={stepKey} className="flex items-center justify-between py-1 border-b">
                          <span className="font-mono text-xs">{stepKey}</span>
                          <Badge variant="outline" className="text-xs">
                            {blocks.length} blocos
                          </Badge>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-muted-foreground italic">
                    Nenhum step carregado
                  </div>
                )}
              </div>
            </div>

            {/* Estado do Editor */}
            <div className="space-y-1">
              <div className="font-semibold">Estado</div>
              <div className="space-y-0.5 font-mono text-xs">
                <div>Loading: {editor.state.isLoading ? '⏳' : '✅'}</div>
              </div>
            </div>

            {/* Info Adicional */}
            <div className="pt-2 border-t text-muted-foreground text-xs">
              <div>Use este painel para debug rápido</div>
              <div className="mt-1">💡 Disponível apenas em DEV</div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
