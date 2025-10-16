/**
 * 🎯 PUBLISH DIALOG (Sprint 2 - TK-ED-04)
 * 
 * Dialog para confirmar publicação do funil
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPublishing?: boolean;
  publishedUrl?: string | null;
  hasUnsavedChanges?: boolean;
}

export function PublishDialog({
  open,
  onOpenChange,
  onConfirm,
  isPublishing = false,
  publishedUrl = null,
  hasUnsavedChanges = false,
}: PublishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publicar Funil</DialogTitle>
          <DialogDescription>
            Seu funil será publicado e ficará disponível publicamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning se houver mudanças não salvas */}
          {hasUnsavedChanges && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Você tem mudanças não salvas. Recomendamos salvar antes de publicar.
              </AlertDescription>
            </Alert>
          )}

          {/* URL de publicação (se já publicado) */}
          {publishedUrl && (
            <div className="space-y-2">
              <Label>URL de Acesso</Label>
              <div className="flex gap-2">
                <Input
                  value={publishedUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(publishedUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Informações */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>✓ O funil será publicado em /quiz-estilo</p>
            <p>✓ Qualquer pessoa com o link poderá acessar</p>
            <p>✓ Você pode republicar a qualquer momento</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {publishedUrl ? 'Republicar' : 'Publicar'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
