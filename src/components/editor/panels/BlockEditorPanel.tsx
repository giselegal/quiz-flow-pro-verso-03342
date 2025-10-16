/**
 * 🎨 BLOCK EDITOR PANEL
 * 
 * Painel lateral para edição visual de blocos modulares
 * - Lista de blocos do step atual
 * - Adicionar novos blocos
 * - Editar propriedades
 * - Reordenar (drag & drop)
 * - Deletar blocos
 */

import { useState } from 'react';
import { Plus, GripVertical, Eye, EyeOff, Trash2, Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { StepBlockSchema } from '@/data/stepBlockSchemas';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface BlockEditorPanelProps {
  blocks: StepBlockSchema[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onAddBlock: (type: string) => void;
  onUpdateBlock: (blockId: string, updates: Partial<StepBlockSchema>) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onReorderBlock: (blockId: string, direction: 'up' | 'down') => void;
}

// Biblioteca de blocos disponíveis
const AVAILABLE_BLOCKS = [
  { type: 'LogoBlock', label: 'Logo', icon: '🖼️', category: 'branding' },
  { type: 'HeadlineBlock', label: 'Título', icon: '📝', category: 'content' },
  { type: 'TextBlock', label: 'Texto', icon: '📄', category: 'content' },
  { type: 'ImageBlock', label: 'Imagem', icon: '🖼️', category: 'media' },
  { type: 'ButtonBlock', label: 'Botão', icon: '🔘', category: 'interactive' },
  { type: 'FormInputBlock', label: 'Input', icon: '📝', category: 'interactive' },
  { type: 'GridOptionsBlock', label: 'Grid de Opções', icon: '🔲', category: 'interactive' },
  { type: 'ProgressBarBlock', label: 'Progresso', icon: '📊', category: 'visual' },
  { type: 'SpacerBlock', label: 'Espaçador', icon: '↕️', category: 'layout' },
  { type: 'FooterBlock', label: 'Rodapé', icon: '📋', category: 'content' },
];

export function BlockEditorPanel({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onReorderBlock
}: BlockEditorPanelProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['current']));

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  // Agrupar blocos por categoria
  const blocksByCategory = AVAILABLE_BLOCKS.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_BLOCKS>);

  const categoryLabels: Record<string, string> = {
    branding: 'Marca',
    content: 'Conteúdo',
    media: 'Mídia',
    interactive: 'Interativo',
    visual: 'Visual',
    layout: 'Layout'
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Blocos</h3>
          <Badge variant="secondary">{blocks.length}</Badge>
        </div>

        <Button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full"
          variant="default"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Bloco
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {/* Menu de Adicionar Blocos */}
        {showAddMenu && (
          <div className="p-4 bg-muted/30 border-b">
            <p className="text-xs text-muted-foreground mb-3">
              Selecione um bloco para adicionar:
            </p>
            
            <div className="space-y-3">
              {Object.entries(blocksByCategory).map(([category, categoryBlocks]) => (
                <div key={category}>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    {categoryLabels[category]}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryBlocks.map((block) => (
                      <button
                        key={block.type}
                        onClick={() => {
                          onAddBlock(block.type);
                          setShowAddMenu(false);
                        }}
                        className="flex flex-col items-center gap-1 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors text-center"
                      >
                        <span className="text-2xl">{block.icon}</span>
                        <span className="text-xs font-medium">{block.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Blocos Atuais */}
        <div className="p-4">
          <Collapsible
            open={expandedGroups.has('current')}
            onOpenChange={() => toggleGroup('current')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2">
              <div className="flex items-center gap-2">
                {expandedGroups.has('current') ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="font-medium text-sm">Blocos no Step</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {blocks.length}
              </Badge>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2 space-y-2">
              {blocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p>Nenhum bloco adicionado</p>
                  <p className="text-xs mt-1">Clique em "Adicionar Bloco" para começar</p>
                </div>
              ) : (
                blocks
                  .sort((a, b) => a.order - b.order)
                  .map((block, index) => {
                    const isSelected = selectedBlockId === block.id;
                    const blockInfo = AVAILABLE_BLOCKS.find(b => b.type === block.type);

                    return (
                      <div
                        key={block.id}
                        className={cn(
                          'group relative p-3 rounded-lg border transition-all cursor-pointer',
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border bg-background hover:border-primary/50 hover:bg-muted/30'
                        )}
                        onClick={() => onSelectBlock(block.id)}
                      >
                        {/* Drag Handle */}
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>

                        {/* Block Info */}
                        <div className="flex items-start gap-3 pl-4">
                          <span className="text-xl flex-shrink-0">
                            {blockInfo?.icon || '📦'}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">
                                {blockInfo?.label || block.type}
                              </p>
                              {!block.deletable && (
                                <Badge variant="secondary" className="text-xs">
                                  Obrigatório
                                </Badge>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground truncate">
                              {block.type}
                            </p>

                            {/* Quick Actions */}
                            {isSelected && (
                              <div className="flex items-center gap-1 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onReorderBlock(block.id, 'up');
                                  }}
                                  disabled={index === 0 || !block.movable}
                                >
                                  ↑
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onReorderBlock(block.id, 'down');
                                  }}
                                  disabled={index === blocks.length - 1 || !block.movable}
                                >
                                  ↓
                                </Button>

                                <Separator orientation="vertical" className="h-4 mx-1" />

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicateBlock(block.id);
                                  }}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>

                                {block.deletable !== false && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm('Deletar este bloco?')) {
                                        onDeleteBlock(block.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Eye className="w-3 h-3" />
          <span>
            {selectedBlockId ? 'Bloco selecionado' : 'Selecione um bloco para editar'}
          </span>
        </div>
      </div>
    </div>
  );
}
