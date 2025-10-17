import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { GripVertical, Trash2, ArrowRightCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BlockComponent } from '../types';

export interface BlockRowProps {
    block: BlockComponent;
    byBlock: Record<string, any[]>;
    selectedBlockId: string;
    isMultiSelected: (id: string) => boolean;
    handleBlockClick: (e: React.MouseEvent, block: BlockComponent) => void;
    renderBlockPreview: (block: BlockComponent, all: BlockComponent[]) => React.ReactNode;
    allBlocks: BlockComponent[];
    removeBlock: (stepId: string, blockId: string) => void;
    stepId: string;
    setBlockPendingDuplicate: (b: BlockComponent) => void;
    setTargetStepId: (id: string) => void;
    setDuplicateModalOpen: (v: boolean) => void;
    hoverContainerId?: string | null;
    expandedContainers?: Set<string>;
    toggleContainer?: (id: string) => void;
    setHoverContainerId?: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * 🎯 DROP ZONE - Zona droppable antes de cada bloco
 * Permite inserir componentes da biblioteca ENTRE os blocos existentes
 */
const DropZoneBefore: React.FC<{ blockId: string; blockIndex: number; stepId: string }> = ({ blockId, blockIndex, stepId }) => {
    const dropZoneId = `drop-before-${blockId}`;
    const { setNodeRef, isOver } = useDroppable({
        id: dropZoneId,
        data: {
            dropZone: 'before',
            blockId: blockId,
            stepId: stepId,
            insertIndex: blockIndex
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'h-8 -my-2 relative transition-all duration-200 border-2 rounded-md',
                isOver
                    ? 'bg-blue-100 border-blue-400 border-dashed shadow-lg'
                    : 'bg-gray-50 border-gray-300 border-dashed opacity-40 hover:opacity-100 hover:bg-blue-50 hover:border-blue-400'
            )}
        >
            <div className={cn(
                'absolute inset-0 flex items-center justify-center',
                isOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}>
                <span className="text-[10px] font-medium text-blue-600 bg-white px-2 py-0.5 rounded shadow-sm">
                    {isOver ? '⬇ Soltar aqui' : '+ Soltar antes'}
                </span>
            </div>
        </div>
    );
};

const Inner: React.FC<BlockRowProps> = (props) => {
    const { block, byBlock, selectedBlockId, isMultiSelected, handleBlockClick, renderBlockPreview, allBlocks, removeBlock, stepId, setBlockPendingDuplicate, setTargetStepId, setDuplicateModalOpen } = props;
    // Defensive defaults for optional props
    const hoverContainerId = props.hoverContainerId ?? null;
    const expandedContainers = props.expandedContainers ?? new Set<string>();
    const toggleContainer = props.toggleContainer;
    const setHoverContainerId = props.setHoverContainerId;
    // Defensive default for byBlock
    const byBlockSafe: Record<string, any[]> = byBlock || {} as any;
    const hasErrors = !!byBlockSafe[block.id]?.length;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
    const style: React.CSSProperties = { transform: transform ? CSS.Transform.toString(transform) : undefined, transition };
    const isContainer = block.type === 'container';
    const isHoverTarget = hoverContainerId === block.id;
    const isExpanded = !isContainer || (expandedContainers?.has?.(block.id) ?? false);

    // Calcular índice do bloco atual (índice real no array, não filtrado)
    const blockIndex = allBlocks.findIndex(b => b.id === block.id);

    return (
        <>
            {/* 🎯 DROP ZONE ANTES DO BLOCO */}
            {!block.parentId && <DropZoneBefore blockId={block.id} blockIndex={blockIndex} stepId={stepId} />}

            <div
                key={block.id}
                className={cn(
                    'group relative p-3 rounded-lg cursor-move bg-white overflow-hidden transition-shadow',
                    (selectedBlockId === block.id || isMultiSelected(block.id)) && 'border border-blue-500 ring-2 ring-blue-200 shadow-sm',
                    hasErrors && !(selectedBlockId === block.id || isMultiSelected(block.id)) && 'shadow-[0_0_0_1px_#dc2626]',
                    isMultiSelected(block.id) && 'bg-blue-50',
                    isDragging && 'opacity-50',
                    isContainer && 'pb-8',
                    isContainer && isHoverTarget && 'outline outline-2 outline-blue-400'
                )}
                onClick={(e) => handleBlockClick(e, block)}
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
            >
                {hasErrors && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="absolute -top-1 -right-1 text-white text-[9px] px-1 rounded shadow cursor-default select-none" style={{ background: byBlockSafe[block.id].some(e => e.severity === 'error') ? '#dc2626' : '#d97706' }}>
                                {byBlockSafe[block.id].length}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs p-2">
                            <div className="space-y-1">
                                {byBlockSafe[block.id].map((e: any) => (
                                    <p key={e.id} className={cn('text-[11px] leading-snug', e.severity === 'error' ? 'text-red-600' : 'text-amber-600')}>
                                        {e.message}
                                    </p>
                                ))}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                )}
                <div className="absolute left-2 top-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                </div>
                <div className="pl-6 pr-8">
                    <div className="text-left flex items-start gap-2">
                        {isContainer && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggleContainer && toggleContainer(block.id); }}
                                className="mt-1 text-[10px] px-1 rounded border bg-white hover:bg-blue-50"
                            >
                                {isExpanded ? '−' : '+'}
                            </button>
                        )}
                        <div className="flex-1">{renderBlockPreview(block, allBlocks)}</div>
                    </div>
                    {isContainer && isExpanded && (
                        <div className="mt-3 relative">
                            <div className="text-[10px] text-slate-400 italic mb-1 flex items-center gap-2">
                                <span>Conteúdo</span>
                                <span className="text-[9px] text-slate-400">{allBlocks.filter(b => b.parentId === block.id).length}</span>
                            </div>
                            <SortableContext
                                items={[...allBlocks.filter(b => b.parentId === block.id).sort((a, b) => a.order - b.order).map(c => c.id), `container-slot:${block.id}`]}
                                strategy={verticalListSortingStrategy}
                            >
                                <div
                                    className={cn(
                                        'min-h-[32px] rounded-md border border-dashed flex flex-col gap-2 p-2 bg-white/40 transition-colors',
                                        isHoverTarget && 'border-blue-400 bg-blue-50/40'
                                    )}
                                    onDragOver={() => setHoverContainerId && setHoverContainerId(block.id)}
                                    onDragLeave={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHoverContainerId && setHoverContainerId((prev: string | null) => (prev === block.id ? null : prev));
                                    }}
                                >
                                    {allBlocks.filter(b => b.parentId === block.id).length === 0 && (
                                        <div className="text-[10px] text-slate-400 italic">Solte aqui para aninhar</div>
                                    )}
                                    {allBlocks.filter(b => b.parentId === block.id).sort((a, b) => a.order - b.order).map(child => (
                                        <MemoBlockRow
                                            key={child.id}
                                            block={child}
                                            byBlock={byBlockSafe}
                                            selectedBlockId={selectedBlockId}
                                            isMultiSelected={isMultiSelected}
                                            handleBlockClick={handleBlockClick}
                                            renderBlockPreview={renderBlockPreview}
                                            allBlocks={allBlocks}
                                            removeBlock={removeBlock}
                                            stepId={stepId}
                                            setBlockPendingDuplicate={setBlockPendingDuplicate}
                                            setTargetStepId={setTargetStepId}
                                            setDuplicateModalOpen={setDuplicateModalOpen}
                                            hoverContainerId={hoverContainerId}
                                            expandedContainers={expandedContainers}
                                            toggleContainer={toggleContainer}
                                            setHoverContainerId={setHoverContainerId}
                                        />
                                    ))}
                                    <div id={`container-slot:${block.id}`} className="h-2 w-full" />
                                </div>
                            </SortableContext>
                        </div>
                    )}
                </div>
                <div className="absolute right-1 top-1 flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); removeBlock(stepId, block.id); }}
                    >
                        <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); setBlockPendingDuplicate(block); setTargetStepId(stepId); setDuplicateModalOpen(true); }}
                    >
                        <ArrowRightCircle className="w-3 h-3 text-blue-500" />
                    </Button>
                </div>
            </div>
        </>
    );
}; const comparator = (prev: BlockRowProps, next: BlockRowProps) => {
    if (prev.block.id !== next.block.id) return false;
    if (prev.block.order !== next.block.order) return false;
    if (prev.block.type !== next.block.type) return false;
    if (prev.block.parentId !== next.block.parentId) return false;
    if (prev.block.type === 'container') {
        const prevChildren = prev.allBlocks.filter(b => b.parentId === prev.block.id).length;
        const nextChildren = next.allBlocks.filter(b => b.parentId === next.block.id).length;
        if (prevChildren !== nextChildren) return false;
    }
    if (prev.selectedBlockId === prev.block.id || next.selectedBlockId === next.block.id) {
        if (prev.selectedBlockId !== next.selectedBlockId) return false;
    }
    const prevMulti = prev.isMultiSelected(prev.block.id);
    const nextMulti = next.isMultiSelected(next.block.id);
    if (prevMulti !== nextMulti) return false;
    if (prev.block.properties !== next.block.properties) return false;
    if (prev.block.content !== next.block.content) return false;
    const prevErrs = (prev.byBlock as any)?.[prev.block.id] || [];
    const nextErrs = (next.byBlock as any)?.[next.block.id] || [];
    if ((prevErrs?.length || 0) !== (nextErrs?.length || 0)) return false;
    if (prevErrs && nextErrs) {
        for (let i = 0; i < prevErrs.length; i++) {
            if (prevErrs[i].severity !== nextErrs[i].severity || prevErrs[i].message !== nextErrs[i].message) return false;
        }
    }
    if (prev.hoverContainerId !== next.hoverContainerId) return false;
    const prevExpanded = prev.expandedContainers?.has?.(prev.block.id) ?? false;
    const nextExpanded = next.expandedContainers?.has?.(next.block.id) ?? false;
    if (prevExpanded !== nextExpanded) return false;
    return true;
};

export const MemoBlockRow = React.memo(Inner, comparator);
export default MemoBlockRow;
