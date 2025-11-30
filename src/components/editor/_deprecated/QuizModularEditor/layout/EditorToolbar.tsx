/**
 * 🎯 EDITOR TOOLBAR (Sprint 2 - TK-ED-04)
 * 
 * Toolbar com snippets e ferramentas rápidas
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface EditorToolbarProps {
  hasSelection?: boolean;
  canPaste?: boolean;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onClearSelection?: () => void;
  onOpenSnippets?: () => void;
}

export function EditorToolbar({
  hasSelection = false,
  canPaste = false,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onClearSelection,
  onOpenSnippets,
}: EditorToolbarProps) {
  return (
    <TooltipProvider>
      <div className="h-10 border-b bg-muted/50 flex items-center px-3 gap-2">
        {/* Selection actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                disabled={!hasSelection}
                className="h-7 px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copiar (Ctrl+C)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCut}
                disabled={!hasSelection}
                className="h-7 px-2"
              >
                <Scissors className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Recortar (Ctrl+X)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPaste}
                disabled={!canPaste}
                className="h-7 px-2"
              >
                <Clipboard className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Colar (Ctrl+V)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                disabled={!hasSelection}
                className="h-7 px-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Deletar (Del)</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-5" />

        {/* Clear selection */}
        {hasSelection && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-7 px-2"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Limpar seleção (Esc)</TooltipContent>
          </Tooltip>
        )}

        <div className="flex-1" />

        {/* Snippets */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSnippets}
              className="h-7"
            >
              <Layers className="w-3 h-3 mr-1" />
              Snippets
            </Button>
          </TooltipTrigger>
          <TooltipContent>Blocos prontos para inserir</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
