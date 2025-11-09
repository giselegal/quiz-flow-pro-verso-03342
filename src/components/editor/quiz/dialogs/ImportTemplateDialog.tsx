/**
 * Import Template Dialog Component
 * 
 * Permite importar templates JSON no editor com:
 * - Upload de arquivo JSON
 * - Validação Zod de estrutura
 * - Preview do template
 * - Injeção no editor via setStepBlocks
 * 
 * @module dialogs/ImportTemplateDialog
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileJson, AlertCircle, CheckCircle2, X } from 'lucide-react';
import {
  validateTemplate as zodValidateTemplate,
  type Template,
  type ValidationResult
} from '@/types/schemas/templateSchema';
import {
  normalizeAndValidateTemplateV3,
  isNormalizeSuccess,
  type NormalizeAndValidateResult
} from '@/templates/validation/validateAndNormalize';

/**
 * Props for ImportTemplateDialog
 */
export interface ImportTemplateDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Callback when dialog should close
   */
  onClose: () => void;

  /**
   * Callback when template is imported successfully
   * @param template - The imported template
   * @param stepId - Optional step ID to import only one step
   */
  onImport: (template: Template, stepId?: string) => void;

  /**
   * Current step key (for single-step import)
   */
  currentStepKey?: string;
}

/**
 * Import Template Dialog Component
 */
export function ImportTemplateDialog({
  open,
  onClose,
  onImport,
  currentStepKey,
}: ImportTemplateDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<ValidationResult<Template> | null>(null);
  const [importMode, setImportMode] = useState<'full' | 'step'>('full');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog closes
  const handleClose = useCallback(() => {
    setFile(null);
    setValidation(null);
    setImportMode('full');
    onClose();
  }, [onClose]);

  // Handle file selection
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.json')) {
      setValidation({
        success: false,
        errors: ['Arquivo deve ter extensão .json'],
      });
      return;
    }

    setFile(selectedFile);

    // Read and validate file using new V3 validation + normalization
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // ✅ W3: Usar validação + normalização Zod
        const result = normalizeAndValidateTemplateV3(data, {
          replaceLegacyIds: true,      // Substituir Date.now() IDs
          strictValidation: true,       // Validar schema rigoroso
          allowExtraFields: true,       // Permitir campos extras
        });

        if (isNormalizeSuccess(result)) {
          // Adapter para formato legado (ValidationResult)
          setValidation({
            success: true,
            data: result.data as any,
            warnings: result.warnings.length > 0 ? result.warnings : undefined,
          });
        } else {
          setValidation({
            success: false,
            errors: result.errors.map(e => `${e.path.join('.')}: ${e.message}`),
          });
        }
      } catch (error) {
        setValidation({
          success: false,
          errors: [`Erro ao ler JSON: ${error instanceof Error ? error.message : 'Erro desconhecido'}`],
        });
      }
    };
    reader.readAsText(selectedFile);
  }, []);

  // Handle import button click
  const handleImport = useCallback(() => {
    if (!validation?.data) return;

    if (importMode === 'step' && currentStepKey) {
      // Import only current step
      onImport(validation.data, currentStepKey);
    } else {
      // Import full template
      onImport(validation.data);
    }

    handleClose();
  }, [validation, importMode, currentStepKey, onImport, handleClose]);

  // Trigger file input click
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Get blocks from step (handle both v3.1 and simple formats)
  const getStepBlocks = (step: any): any[] => {
    if (Array.isArray(step)) {
      return step;
    }
    if (step && typeof step === 'object' && 'blocks' in step) {
      return step.blocks;
    }
    return [];
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            Importar Template JSON
          </DialogTitle>
          <DialogDescription>
            Importe um template no formato JSON v3.1 para usar no editor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">
              {file ? file.name : 'Clique para selecionar arquivo JSON'}
            </p>
            <p className="text-xs text-muted-foreground">
              Arraste e solte ou clique para selecionar
            </p>
          </div>

          {/* Validation Results */}
          {validation && (
            <div className="space-y-3">
              {/* Success */}
              {validation.success && validation.data && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="font-medium mb-2">✅ Template válido!</div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Nome:</strong> {validation.data.metadata.name}
                      </div>
                      <div>
                        <strong>ID:</strong> {validation.data.metadata.id}
                      </div>
                      <div>
                        <strong>Versão:</strong> {validation.data.metadata.version}
                      </div>
                      <div>
                        <strong>Steps:</strong>{' '}
                        {Object.keys(validation.data.steps).length} step(s)
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Errors */}
              {validation.errors && validation.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">❌ Erros encontrados:</div>
                    <ScrollArea className="h-24">
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        {validation.errors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </AlertDescription>
                </Alert>
              )}

              {/* Warnings */}
              {validation.warnings && validation.warnings.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <div className="font-medium mb-2">⚠️ Avisos:</div>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      {validation.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Import Mode Selection */}
          {validation?.success && validation.data && currentStepKey && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Modo de Importação:</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={importMode === 'full' ? 'default' : 'outline'}
                  onClick={() => setImportMode('full')}
                  className="flex-1"
                >
                  Template Completo
                </Button>
                <Button
                  size="sm"
                  variant={importMode === 'step' ? 'default' : 'outline'}
                  onClick={() => setImportMode('step')}
                  className="flex-1"
                >
                  Apenas Step Atual ({currentStepKey})
                </Button>
              </div>
            </div>
          )}

          {/* Step Preview */}
          {validation?.data && importMode === 'step' && currentStepKey && (
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="text-sm font-medium mb-2">Preview - Step {currentStepKey}:</div>
              {validation.data.steps[currentStepKey] ? (
                <div className="space-y-1 text-xs">
                  <div>
                    <Badge variant="secondary">
                      {getStepBlocks(validation.data.steps[currentStepKey]).length} blocos
                    </Badge>
                  </div>
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {getStepBlocks(validation.data.steps[currentStepKey]).map((block: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
                          <span className="font-mono">{block.type}</span>
                          <span>-</span>
                          <span className="truncate">{block.id}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <Alert variant="destructive" className="text-sm">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription>
                    Step "{currentStepKey}" não encontrado no template
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={!validation?.success || !validation?.data}
            className="bg-primary"
          >
            <FileJson className="w-4 h-4 mr-1" />
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportTemplateDialog;
