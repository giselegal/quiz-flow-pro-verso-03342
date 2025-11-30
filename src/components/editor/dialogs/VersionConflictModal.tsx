/**
 * 🔒 Version Conflict Modal
 * 
 * Modal para resolução de conflitos de edição simultânea.
 * Oferece 3 estratégias: overwrite, cancel, merge.
 */

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, GitMerge, XCircle, Save } from 'lucide-react';
import type { ConflictResolutionStrategy, MergeResult } from '@/services/optimistic-locking/OptimisticLockingService';

export interface VersionConflict {
    expectedVersion: number;
    actualVersion: number;
    lastModified?: string;
    message: string;
}

export interface VersionConflictModalProps {
    open: boolean;
    conflict: VersionConflict;
    onResolve: (strategy: ConflictResolutionStrategy) => void;
    onCancel: () => void;
    mergePreview?: MergeResult;
}

export function VersionConflictModal({
    open,
    conflict,
    onResolve,
    onCancel,
    mergePreview,
}: VersionConflictModalProps) {
    const [selectedStrategy, setSelectedStrategy] = useState<ConflictResolutionStrategy | null>(null);

    const handleConfirm = () => {
        if (selectedStrategy) {
            onResolve(selectedStrategy);
        }
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return 'Data desconhecida';
        try {
            return new Date(isoString).toLocaleString('pt-BR');
        } catch {
            return isoString;
        }
    };

    const hasConflicts = mergePreview && !mergePreview.success;
    const conflictCount = mergePreview?.conflicts?.length || 0;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Conflito de Versão Detectado
                    </DialogTitle>
                    <DialogDescription>
                        Outra pessoa ou aba editou este step enquanto você trabalhava.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Informações do conflito */}
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="font-medium">Sua versão:</span>
                                <Badge variant="outline" className="ml-2">
                                    v{conflict.expectedVersion}
                                </Badge>
                            </div>
                            <div>
                                <span className="font-medium">Versão atual:</span>
                                <Badge variant="outline" className="ml-2">
                                    v{conflict.actualVersion}
                                </Badge>
                            </div>
                            {conflict.lastModified && (
                                <div className="col-span-2 mt-2 text-xs text-muted-foreground">
                                    Última modificação: {formatDate(conflict.lastModified)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview de merge (se disponível) */}
                    {mergePreview && (
                        <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Preview do Merge</span>
                                {hasConflicts ? (
                                    <Badge variant="destructive">{conflictCount} conflito(s)</Badge>
                                ) : (
                                    <Badge variant="default" className="bg-green-500">Merge limpo</Badge>
                                )}
                            </div>
                            {hasConflicts && (
                                <div className="text-sm text-muted-foreground">
                                    {conflictCount} bloco(s) modificado(s) em ambas as versões.
                                    O merge automático usará a versão remota por padrão.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Estratégias de resolução */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium">Escolha como resolver:</p>

                        {/* Overwrite */}
                        <button
                            onClick={() => setSelectedStrategy('overwrite')}
                            className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${selectedStrategy === 'overwrite'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <Save className="h-5 w-5 mt-0.5 text-blue-500" />
                                <div>
                                    <div className="font-medium">Sobrescrever Mudanças Remotas</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Salvar suas alterações e descartar as mudanças feitas por outros.
                                        <span className="text-red-500 font-medium"> (Use com cuidado)</span>
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Merge */}
                        <button
                            onClick={() => setSelectedStrategy('merge')}
                            disabled={!mergePreview}
                            className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${selectedStrategy === 'merge'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                } ${!mergePreview ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <GitMerge className="h-5 w-5 mt-0.5 text-green-500" />
                                <div>
                                    <div className="font-medium">
                                        Merge Automático
                                        {hasConflicts && <Badge variant="outline" className="ml-2 text-xs">Com conflitos</Badge>}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Combinar suas alterações com as mudanças remotas automaticamente.
                                        {hasConflicts && (
                                            <span className="text-yellow-600 font-medium">
                                                {' '}Blocos em conflito usarão a versão remota.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Cancel */}
                        <button
                            onClick={() => setSelectedStrategy('cancel')}
                            className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${selectedStrategy === 'cancel'
                                    ? 'border-gray-500 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 mt-0.5 text-gray-500" />
                                <div>
                                    <div className="font-medium">Cancelar Salvamento</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Não salvar e recarregar a versão mais recente. Suas alterações serão perdidas.
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        Fechar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedStrategy}
                        variant={selectedStrategy === 'overwrite' ? 'destructive' : 'default'}
                    >
                        {selectedStrategy === 'overwrite' && 'Sobrescrever'}
                        {selectedStrategy === 'merge' && 'Fazer Merge'}
                        {selectedStrategy === 'cancel' && 'Descartar Mudanças'}
                        {!selectedStrategy && 'Selecione uma opção'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
