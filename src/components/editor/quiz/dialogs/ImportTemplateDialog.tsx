/**
 * Import Template Dialog Component
 * 
 * Permite importar templates JSON no editor com:
 * - Upload de arquivo JSON
 * - Validação de estrutura
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
import type { Block } from '@/types/editor';

/**
 * Template JSON structure (v3.1 format)
 */
interface TemplateJSON {
    metadata: {
        id: string;
        name: string;
        description?: string;
        version: string;
        totalSteps?: number;
        category?: string;
    };
    steps: Record<string, Block[]>;
}

/**
 * Validation result
 */
interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    template?: TemplateJSON;
}

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
    onImport: (template: TemplateJSON, stepId?: string) => void;

    /**
     * Current step key (for single-step import)
     */
    currentStepKey?: string;
}

/**
 * Validate template JSON structure
 */
function validateTemplate(data: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if data is object
    if (!data || typeof data !== 'object') {
        return {
            valid: false,
            errors: ['Template deve ser um objeto JSON válido'],
            warnings: [],
        };
    }

    const template = data as Partial<TemplateJSON>;

    // Validate metadata
    if (!template.metadata) {
        errors.push('Template deve conter propriedade "metadata"');
    } else {
        if (!template.metadata.id) {
            errors.push('metadata.id é obrigatório');
        }
        if (!template.metadata.name) {
            errors.push('metadata.name é obrigatório');
        }
        if (!template.metadata.version) {
            warnings.push('metadata.version não especificada');
        }
    }

    // Validate steps
    if (!template.steps) {
        errors.push('Template deve conter propriedade "steps"');
    } else if (typeof template.steps !== 'object') {
        errors.push('steps deve ser um objeto');
    } else {
        const stepKeys = Object.keys(template.steps);
        if (stepKeys.length === 0) {
            errors.push('Template deve conter pelo menos uma step');
        }

        // Validate each step
        stepKeys.forEach((stepKey) => {
            const blocks = template.steps![stepKey];
            if (!Array.isArray(blocks)) {
                errors.push(`Step "${stepKey}" deve ser um array de blocos`);
            } else {
                // Validate blocks
                blocks.forEach((block, index) => {
                    if (!block.id) {
                        errors.push(`Bloco ${index} em step "${stepKey}" deve ter propriedade "id"`);
                    }
                    if (!block.type) {
                        errors.push(`Bloco ${index} em step "${stepKey}" deve ter propriedade "type"`);
                    }
                });
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        template: errors.length === 0 ? (template as TemplateJSON) : undefined,
    };
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
    const [validation, setValidation] = useState<ValidationResult | null>(null);
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
                valid: false,
                errors: ['Arquivo deve ter extensão .json'],
                warnings: [],
            });
            return;
        }

        setFile(selectedFile);

        // Read and validate file
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);
                const result = validateTemplate(data);
                setValidation(result);
            } catch (error) {
                setValidation({
                    valid: false,
                    errors: [`Erro ao ler JSON: ${error instanceof Error ? error.message : 'Erro desconhecido'}`],
                    warnings: [],
                });
            }
        };
        reader.readAsText(selectedFile);
    }, []);

    // Handle import button click
    const handleImport = useCallback(() => {
        if (!validation?.template) return;

        if (importMode === 'step' && currentStepKey) {
            // Import only current step
            onImport(validation.template, currentStepKey);
        } else {
            // Import full template
            onImport(validation.template);
        }

        handleClose();
    }, [validation, importMode, currentStepKey, onImport, handleClose]);

    // Trigger file input click
    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

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
                            {validation.valid && (
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        <div className="font-medium mb-2">Template válido!</div>
                                        {validation.template && (
                                            <div className="space-y-1 text-sm">
                                                <div>
                                                    <strong>Nome:</strong> {validation.template.metadata.name}
                                                </div>
                                                <div>
                                                    <strong>ID:</strong> {validation.template.metadata.id}
                                                </div>
                                                <div>
                                                    <strong>Versão:</strong> {validation.template.metadata.version || 'N/A'}
                                                </div>
                                                <div>
                                                    <strong>Steps:</strong>{' '}
                                                    {Object.keys(validation.template.steps).length} step(s)
                                                </div>
                                            </div>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Errors */}
                            {validation.errors.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="font-medium mb-2">Erros encontrados:</div>
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
                            {validation.warnings.length > 0 && (
                                <Alert className="border-yellow-200 bg-yellow-50">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-800">
                                        <div className="font-medium mb-2">Avisos:</div>
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
                    {validation?.valid && currentStepKey && (
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
                    {validation?.template && importMode === 'step' && currentStepKey && (
                        <div className="border rounded-lg p-3 bg-gray-50">
                            <div className="text-sm font-medium mb-2">Preview - Step {currentStepKey}:</div>
                            {validation.template.steps[currentStepKey] ? (
                                <div className="space-y-1 text-xs">
                                    <div>
                                        <Badge variant="secondary">
                                            {validation.template.steps[currentStepKey].length} blocos
                                        </Badge>
                                    </div>
                                    <ScrollArea className="h-32">
                                        <div className="space-y-1">
                                            {validation.template.steps[currentStepKey].map((block, i) => (
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
                        disabled={!validation?.valid}
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
