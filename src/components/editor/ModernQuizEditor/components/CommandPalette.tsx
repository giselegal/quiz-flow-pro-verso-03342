/**
 * 🎯 CommandPalette - Quick actions via Ctrl+K
 * 
 * Features:
 * - Fuzzy search
 * - Categories: Navigation, Blocks, Actions, Settings
 * - Keyboard navigation
 */

import { memo, useState, useCallback, useEffect } from 'react';
import { Command } from 'cmdk';
import { useEditorStore } from '../store/editorStore';
import { useQuizStore } from '../store/quizStore';
import { 
  Search, 
  Layers, 
  Plus, 
  Save, 
  Undo2, 
  Redo2, 
  Trash2, 
  Copy, 
  Eye,
  Settings,
  FileJson,
  Layout,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

export const CommandPalette = memo(({ open, onOpenChange, onSave }: CommandPaletteProps) => {
  const [search, setSearch] = useState('');

  const quiz = useQuizStore((s) => s.quiz);
  const undo = useQuizStore((s) => s.undo);
  const redo = useQuizStore((s) => s.redo);
  const history = useQuizStore((s) => s.history);
  const historyIndex = useQuizStore((s) => s.historyIndex);
  const deleteBlock = useQuizStore((s) => s.deleteBlock);
  const duplicateBlock = useQuizStore((s) => s.duplicateBlock);

  // Computed values for undo/redo capability
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const selectedStepId = useEditorStore((s) => s.selectedStepId);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectStep = useEditorStore((s) => s.selectStep);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const togglePreviewMode = useEditorStore((s) => s.togglePreviewMode);
  const toggleEditorMode = useEditorStore((s) => s.toggleEditorMode);
  const toggleSplitPreview = useEditorStore((s) => s.toggleSplitPreview);
  const editorMode = useEditorStore((s) => s.editorMode);

  // Reset search when closing
  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const runCommand = useCallback((command: () => void) => {
    command();
    onOpenChange(false);
  }, [onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Command Dialog */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg">
        <Command 
          className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
          filter={(value, search) => {
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          {/* Search Input */}
          <div className="flex items-center border-b border-border px-4">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Buscar comandos..."
              className="flex-1 py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-muted-foreground">
              Nenhum comando encontrado.
            </Command.Empty>

            {/* Navigation */}
            <Command.Group heading="Navegação" className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
              {quiz?.steps?.map((step: any) => (
                <Command.Item
                  key={step.id}
                  value={`ir para ${step.title || step.id}`}
                  onSelect={() => runCommand(() => selectStep(step.id))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted"
                >
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <span>Ir para: {step.title || `Step ${step.order}`}</span>
                  {selectedStepId === step.id && (
                    <span className="ml-auto text-xs text-primary">atual</span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Actions */}
            <Command.Group heading="Ações" className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
              <Command.Item
                value="salvar"
                onSelect={() => runCommand(() => onSave?.())}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted"
              >
                <Save className="w-4 h-4 text-muted-foreground" />
                <span>Salvar</span>
                <span className="ml-auto text-xs text-muted-foreground">⌘S</span>
              </Command.Item>

              <Command.Item
                value="desfazer undo"
                disabled={!canUndo}
                onSelect={() => runCommand(() => undo())}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted disabled:opacity-50"
              >
                <Undo2 className="w-4 h-4 text-muted-foreground" />
                <span>Desfazer</span>
                <span className="ml-auto text-xs text-muted-foreground">⌘Z</span>
              </Command.Item>

              <Command.Item
                value="refazer redo"
                disabled={!canRedo}
                onSelect={() => runCommand(() => redo())}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted disabled:opacity-50"
              >
                <Redo2 className="w-4 h-4 text-muted-foreground" />
                <span>Refazer</span>
                <span className="ml-auto text-xs text-muted-foreground">⌘Y</span>
              </Command.Item>

              {selectedBlockId && (
                <>
                  <Command.Item
                    value="duplicar bloco"
                    onSelect={() => runCommand(() => {
                      if (selectedStepId) duplicateBlock(selectedStepId, selectedBlockId);
                    })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                    <span>Duplicar bloco</span>
                    <span className="ml-auto text-xs text-muted-foreground">⌘D</span>
                  </Command.Item>

                  <Command.Item
                    value="excluir bloco deletar"
                    onSelect={() => runCommand(() => {
                      if (selectedStepId) {
                        deleteBlock(selectedStepId, selectedBlockId);
                        clearSelection();
                      }
                    })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir bloco</span>
                    <span className="ml-auto text-xs">Del</span>
                  </Command.Item>
                </>
              )}
            </Command.Group>

            {/* View */}
            <Command.Group heading="Visualização" className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
              <Command.Item
                value="preview visualizar"
                onSelect={() => runCommand(() => togglePreviewMode())}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted"
              >
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span>Toggle Preview Mode</span>
              </Command.Item>

              <Command.Item
                value="split preview lado"
                onSelect={() => runCommand(() => toggleSplitPreview())}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted"
              >
                <Layout className="w-4 h-4 text-muted-foreground" />
                <span>Toggle Split Preview</span>
              </Command.Item>

              <Command.Item
                value="json visual modo"
                onSelect={() => runCommand(() => toggleEditorMode())}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted"
              >
                <FileJson className="w-4 h-4 text-muted-foreground" />
                <span>Modo: {editorMode === 'visual' ? 'JSON' : 'Visual'}</span>
              </Command.Item>

              <Command.Item
                value="limpar seleção escape"
                onSelect={() => runCommand(() => clearSelection())}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted aria-selected:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
                <span>Limpar seleção</span>
                <span className="ml-auto text-xs text-muted-foreground">Esc</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer with hints */}
          <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>↑↓ navegar</span>
              <span>↵ selecionar</span>
              <span>esc fechar</span>
            </div>
            <span>⌘K para abrir</span>
          </div>
        </Command>
      </div>
    </div>
  );
});

CommandPalette.displayName = 'CommandPalette';
