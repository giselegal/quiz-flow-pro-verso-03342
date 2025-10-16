/**
 * 🎯 EDITOR HEADER (Sprint 2 - TK-ED-04)
 * 
 * Cabeçalho do editor com ações principais:
 * - Save
 * - Publish
 * - Preview
 * - Undo/Redo
 * - Dirty indicator
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Save,
  Upload,
  Eye,
  Undo,
  Redo,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorHeaderProps {
  funnelName?: string;
  isDirty?: boolean;
  isSaving?: boolean;
  isPublishing?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onSave?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onBack?: () => void;
}

export function EditorHeader({
  funnelName = 'Funil sem título',
  isDirty = false,
  isSaving = false,
  isPublishing = false,
  canUndo = false,
  canRedo = false,
  onSave,
  onPublish,
  onPreview,
  onUndo,
  onRedo,
  onBack,
}: EditorHeaderProps) {
  return (
    <header className="h-14 border-b bg-card flex items-center px-4 gap-3">
      {/* Back button */}
      {onBack && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      {/* Funnel name */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold truncate">
          {funnelName}
        </h1>
        {isDirty && (
          <p className="text-xs text-muted-foreground">
            Mudanças não salvas
          </p>
        )}
      </div>

      {/* History controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 px-2"
          title="Desfazer (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 px-2"
          title="Refazer (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="h-8"
        >
          <Eye className="w-3 h-3 mr-1" />
          Preview
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="h-8"
        >
          {isSaving ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Save className="w-3 h-3 mr-1" />
          )}
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onPublish}
          disabled={isPublishing}
          className={cn(
            "h-8",
            !isDirty && "bg-primary"
          )}
        >
          {isPublishing ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Upload className="w-3 h-3 mr-1" />
          )}
          {isPublishing ? 'Publicando...' : 'Publicar'}
        </Button>
      </div>

      {/* Status badge */}
      {isDirty && (
        <Badge variant="outline" className="text-xs">
          Não salvo
        </Badge>
      )}
    </header>
  );
}
