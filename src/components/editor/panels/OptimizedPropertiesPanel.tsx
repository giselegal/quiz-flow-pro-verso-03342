/**
 * 🎨 OPTIMIZED PROPERTIES PANEL - CLEAN ARCHITECTURE
 * 
 * Painel de propriedades otimizado usando Clean Architecture
 * com performance melhorada e UI responsiva
 */

import React, { useMemo, useCallback } from 'react';
// import { useEditor } from '@/components/editor/EditorProvider'; // Commented until interface is updated
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// 🎯 INTERFACES
interface OptimizedPropertiesPanelProps {
  className?: string;
  width?: number;
  position?: 'left' | 'right';
}

/**
 * 🎨 Painel de Propriedades Otimizado
 * 
 * Features:
 * - Performance otimizada com memoização
 * - UI responsiva e intuitiva
 * - Edição em tempo real
 * - Suporte a múltipla seleção
 */
export const OptimizedPropertiesPanel: React.FC<OptimizedPropertiesPanelProps> = ({
  className,
  width = 320,
  position = 'right'
}) => {
  // 🔧 HOOKS
  // TODO: Update to use EditorProvider interface
  // const { actions, state } = useEditor();
  // Mock data until interface is updated
  const selectedBlocks: string[] = [];
  const updateBlock = async (id: string, updates: any) => { console.log('updateBlock', id, updates); };
  const deleteBlock = async (id: string) => { console.log('deleteBlock', id); };
  const featureFlags = { useCleanArchitecture: true }; // Mock feature flags

  // 🎯 COMPUTED VALUES
  const selectedBlocksData = useMemo(() => {
    // TODO: Implementar busca de dados dos blocos selecionados
    // Por enquanto retorna mock data
    return selectedBlocks.map((id: string) => ({
      id,
      type: 'text', // mock
      properties: { text: 'Sample text' } // mock
    }));
  }, [selectedBlocks]);

  const isMultiSelection = selectedBlocksData.length > 1;
  const singleBlock = selectedBlocksData.length === 1 ? selectedBlocksData[0] : null;

  // 🎯 HANDLERS
  const handlePropertyChange = useCallback(async (
    blockId: string, 
    property: string, 
    value: any
  ) => {
    try {
      await updateBlock(blockId, {
        [property]: value
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar propriedade:', error);
    }
  }, [updateBlock]);

  const handleDeleteSelected = useCallback(async () => {
    try {
      await Promise.all(
        selectedBlocks.map((blockId: string) => deleteBlock(blockId))
      );
    } catch (error) {
      console.error('❌ Erro ao deletar blocos:', error);
    }
  }, [selectedBlocks, deleteBlock]);

  // 🎨 RENDER EMPTY STATE
  if (selectedBlocksData.length === 0) {
    return (
      <div 
        className={cn(
          'border-l bg-muted/20 flex flex-col',
          position === 'left' && 'border-l-0 border-r',
          className
        )}
        style={{ width }}
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Propriedades</h3>
          {featureFlags.useCleanArchitecture && (
            <Badge variant="secondary" className="mt-1 text-xs">
              Clean Architecture
            </Badge>
          )}
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <div className="text-lg mb-2">🎨</div>
            <div className="text-sm font-medium mb-1">Nenhum bloco selecionado</div>
            <div className="text-xs">
              Selecione um ou mais blocos para editar suas propriedades
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🎨 RENDER MULTI SELECTION
  if (isMultiSelection) {
    return (
      <div 
        className={cn(
          'border-l bg-muted/20 flex flex-col',
          position === 'left' && 'border-l-0 border-r',
          className
        )}
        style={{ width }}
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Propriedades</h3>
          <Badge variant="outline" className="mt-1 text-xs">
            {selectedBlocksData.length} blocos selecionados
          </Badge>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Ações em lote */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Ações em lote</Label>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSelected}
                className="w-full"
              >
                Deletar selecionados ({selectedBlocksData.length})
              </Button>
            </div>
            
            <Separator />
            
            {/* Lista de blocos selecionados */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Blocos selecionados</Label>
              <div className="space-y-1">
                {selectedBlocksData.map((block: any, index: number) => (
                  <div 
                    key={block.id}
                    className="flex items-center justify-between p-2 border rounded-lg bg-background"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {block.type}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {block.id.slice(0, 8)}...
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // 🎨 RENDER SINGLE SELECTION
  return (
    <div 
      className={cn(
        'border-l bg-muted/20 flex flex-col',
        position === 'left' && 'border-l-0 border-r',
        className
      )}
      style={{ width }}
    >
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Propriedades</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {singleBlock?.type}
          </Badge>
          {featureFlags.useCleanArchitecture && (
            <Badge variant="secondary" className="text-xs">
              v3.0
            </Badge>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Informações básicas */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">Informações básicas</Label>
            
            <div className="space-y-2">
              <div>
                <Label className="text-xs">ID do bloco</Label>
                <Input 
                  value={singleBlock?.id || ''} 
                  readOnly 
                  className="text-xs h-8"
                />
              </div>
              
              <div>
                <Label className="text-xs">Tipo</Label>
                <Input 
                  value={singleBlock?.type || ''} 
                  readOnly 
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Propriedades específicas do tipo */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">Propriedades do {singleBlock?.type}</Label>
            
            <div className="space-y-2">
              {/* Exemplo para tipo 'text' */}
              {singleBlock?.type === 'text' && (
                <div>
                  <Label className="text-xs">Texto</Label>
                  <Input 
                    value={singleBlock.properties?.text || ''} 
                    onChange={(e) => handlePropertyChange(
                      singleBlock.id, 
                      'text', 
                      e.target.value
                    )}
                    className="text-xs h-8"
                    placeholder="Digite o texto..."
                  />
                </div>
              )}
              
              {/* Exemplo para tipo 'button' */}
              {singleBlock?.type === 'button' && (
                <>
                  <div>
                    <Label className="text-xs">Texto do botão</Label>
                    <Input 
                      value={singleBlock.properties?.text || ''} 
                      onChange={(e) => handlePropertyChange(
                        singleBlock.id, 
                        'text', 
                        e.target.value
                      )}
                      className="text-xs h-8"
                      placeholder="Clique aqui"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">URL de destino</Label>
                    <Input 
                      value={(singleBlock.properties as any)?.url || ''} 
                      onChange={(e) => handlePropertyChange(
                        singleBlock.id, 
                        'url', 
                        e.target.value
                      )}
                      className="text-xs h-8"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Ações */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Ações</Label>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => deleteBlock(singleBlock?.id || '')}
              className="w-full"
            >
              Deletar bloco
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default OptimizedPropertiesPanel;