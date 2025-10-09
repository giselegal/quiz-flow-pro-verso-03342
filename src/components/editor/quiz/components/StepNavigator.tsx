import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface StepNavigatorValidationIssue {
    severity: 'error' | 'warning';
    message: string;
}

export interface StepNavigatorProps<Step = any> {
    steps: Step[];
    selectedStepId: string;
    byStep: Record<string, StepNavigatorValidationIssue[]>;
    onSelect: (id: string) => void;
    onAddStep: () => void;
    onMoveStep: (id: string, dir: 'up' | 'down') => void;
    onDeleteStep: (id: string) => void;
    extractStepMeta?: (step: Step) => { id: string; type?: string; blockCount?: number };
}

/**
 * StepNavigator - Coluna de etapas isolada.
 * Assume responsabilidade apenas visual + callbacks fornecidos.
 */
export const StepNavigator = <Step extends any = any>({
    steps,
    selectedStepId,
    byStep,
    onSelect,
    onAddStep,
    onMoveStep,
    onDeleteStep,
    extractStepMeta = (s: any) => ({ id: s.id, type: s.type, blockCount: s.blocks?.length || 0 })
}: StepNavigatorProps<Step>) => {
    return (
        <>
            <div className="px-4 py-3 border-b">
                <h2 className="font-semibold text-sm">Etapas</h2>
                <p className="text-xs text-muted-foreground">{steps.length} etapas</p>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {steps.map((step: any, index) => {
                        const meta = extractStepMeta(step);
                        const issues = byStep[meta.id];
                        return (
                            <div key={meta.id} className={cn('group rounded-lg border-2 transition-colors', selectedStepId === meta.id ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-gray-50')}>
                                <div className="w-full text-left px-3 py-2 cursor-pointer" onClick={() => onSelect(meta.id)}>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                                        <span className="text-sm font-medium truncate" title={meta.id}>{meta.id}</span>
                                        {issues?.length ? (
                                            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium">
                                                {(() => {
                                                    const errorCount = issues.filter(e => e.severity === 'error').length;
                                                    const warnCount = issues.filter(e => e.severity === 'warning').length;
                                                    if (errorCount > 0) return <span className="text-red-600">{errorCount} err</span>;
                                                    if (warnCount > 0) return <span className="text-amber-600">{warnCount} av</span>;
                                                    return null;
                                                })()}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {meta.type && <Badge className="text-xs">{meta.type}</Badge>}
                                        {typeof meta.blockCount === 'number' && <span className="text-xs text-muted-foreground">{meta.blockCount} blocos</span>}
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-1 px-2 pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-5 w-5" disabled={index === 0} onClick={() => onMoveStep(meta.id, 'up')} title="Mover para cima">↑</Button>
                                    <Button variant="ghost" size="icon" className="h-5 w-5" disabled={index === steps.length - 1} onClick={() => onMoveStep(meta.id, 'down')} title="Mover para baixo">↓</Button>
                                    <Button variant="ghost" size="icon" className="h-5 w-5 text-red-600 hover:text-red-700" onClick={() => { if (window.confirm(`Remover ${meta.id}?`)) onDeleteStep(meta.id); }} title="Remover etapa">✕</Button>
                                </div>
                            </div>
                        );
                    })}
                    <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full text-xs" onClick={onAddStep}>+ Adicionar etapa</Button>
                    </div>
                </div>
            </ScrollArea>
        </>
    );
};

export default StepNavigator;
