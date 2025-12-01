/**
 * Import Template Dialog
 * 
 * Dialog for importing JSON templates into the editor
 */

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileJson, AlertCircle } from 'lucide-react';
import type { Template } from '@/types/schemas/templateSchema';

export interface ImportTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (template: Template, stepId?: string) => void;
}

export function ImportTemplateDialog({
  open,
  onClose,
  onImport,
}: ImportTemplateDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    
    if (!file.name.endsWith('.json')) {
      setError('Apenas arquivos JSON são suportados');
      return;
    }

    try {
      const text = await file.text();
      const template = JSON.parse(text) as Template;
      
      // Basic validation
      if (!template.metadata || !template.steps) {
        setError('Template inválido: faltando metadata ou steps');
        return;
      }
      
      onImport(template);
    } catch (err) {
      setError(`Erro ao processar arquivo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [onImport]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Importar Template JSON
          </DialogTitle>
          <DialogDescription>
            Arraste e solte um arquivo JSON ou clique para selecionar
          </DialogDescription>
        </DialogHeader>

        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Arraste um arquivo JSON aqui
          </p>
          <Input
            type="file"
            accept=".json"
            onChange={handleInputChange}
            className="hidden"
            id="template-file-input"
          />
          <Button variant="outline" asChild>
            <label htmlFor="template-file-input" className="cursor-pointer">
              Selecionar Arquivo
            </label>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportTemplateDialog;
