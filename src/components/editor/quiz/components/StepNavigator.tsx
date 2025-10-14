import React, { useRef, useEffect } from 'react';
import { List as VirtualList, type ListImperativeAPI } from 'react-window';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DirtyBadge } from './DirtyBadge';

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
    isStepDirty?: (id: string) => boolean; // Nova prop para verificar dirty state
}

// Type para props adicionais do row (vazio neste caso)
type RowExtraProps = Record<string, never>;

/**
 * StepNavigator - Coluna de etapas isolada (VIRTUALIZADA).
 * Usa react-window para renderizar apenas os steps visíveis.
 */
export const StepNavigator = <Step extends any = any>({
    steps,
    selectedStepId,
    byStep,
    onSelect,
    onAddStep,
    onMoveStep,
    onDeleteStep,
    extractStepMeta = (s: any) => ({ id: s.id, type: s.type, blockCount: s.blocks?.length || 0 }),
    isStepDirty = () => false // Default: nenhum step dirty
}: StepNavigatorProps<Step>) => {
    const listRef = useRef<ListImperativeAPI | null>(null);
    const ITEM_HEIGHT = 90; // Altura aproximada de cada step item

    // Auto-scroll para o step selecionado quando mudar
    useEffect(() => {
        const selectedIndex = steps.findIndex((s: any) => extractStepMeta(s).id === selectedStepId);
        if (selectedIndex >= 0 && listRef.current) {
            listRef.current.scrollToRow({ index: selectedIndex, align: 'smart' });
        }
    }, [selectedStepId, steps, extractStepMeta]);

    // Componente de linha virtualizado (precisa receber props corretas)
    const StepRow = ({ index, style, ariaAttributes }: { index: number; style: React.CSSProperties; ariaAttributes?: any }) => {
        const step = steps[index];
        const meta = extractStepMeta(step);
        const issues = byStep[meta.id];
        const isSelected = selectedStepId === meta.id;

        return (
            <div style={{ ...style, padding: '4px 8px' }} {...(ariaAttributes || {})}>
                <div className={cn('group rounded-lg border-2 transition-colors', isSelected ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-gray-50')}>
                    <div className="w-full text-left px-3 py-2 cursor-pointer" onClick={() => onSelect(meta.id)}>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                            <span className="text-sm font-medium truncate" title={meta.id}>{meta.id}</span>
                            <DirtyBadge isDirty={isStepDirty(meta.id)} className="ml-1" />
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
                        <Button variant="ghost" size="icon" className="h-5 w-5" disabled={index === 0} onClick={(e) => { e.stopPropagation(); onMoveStep(meta.id, 'up'); }} title="Mover para cima">↑</Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5" disabled={index === steps.length - 1} onClick={(e) => { e.stopPropagation(); onMoveStep(meta.id, 'down'); }} title="Mover para baixo">↓</Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-red-600 hover:text-red-700" onClick={(e) => { e.stopPropagation(); if (window.confirm(`Remover ${meta.id}?`)) onDeleteStep(meta.id); }} title="Remover etapa">✕</Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b shrink-0">
                <h2 className="font-semibold text-sm">Etapas</h2>
                <p className="text-xs text-muted-foreground">{steps.length} etapas (virtualizado)</p>
            </div>
            <div className="flex-1 overflow-hidden relative">
                <VirtualList<RowExtraProps>
                    listRef={listRef}
                    rowCount={steps.length}
                    rowHeight={ITEM_HEIGHT}
                    rowProps={{} as RowExtraProps}
                    overscanCount={3}
                    rowComponent={StepRow}
                    style={{ height: '100%', width: '100%' }}
                />
            </div>
            <div className="p-2 border-t shrink-0">
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={onAddStep}>+ Adicionar etapa</Button>
            </div>
        </div>
    );
};

export default StepNavigator;
