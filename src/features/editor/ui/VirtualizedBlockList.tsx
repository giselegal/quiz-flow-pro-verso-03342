/**
 * 🎯 FASE 2: Canvas Virtualizado para Blocos
 * 
 * Suporta 500+ blocos sem degradação de performance
 */

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Block } from '@/types/block';
import { cn } from '@/lib/utils';

interface VirtualizedBlockListProps {
    blocks: Block[];
    selectedBlockId: string | null;
    onBlockSelect: (blockId: string) => void;
    onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
    renderBlock: (block: Block, isSelected: boolean) => React.ReactNode;
    threshold?: number;
    estimatedBlockHeight?: number;
    className?: string;
}

export function VirtualizedBlockList({
    blocks,
    selectedBlockId,
    onBlockSelect,
    onBlockUpdate,
    renderBlock,
    threshold = 50,
    estimatedBlockHeight = 150,
    className,
}: VirtualizedBlockListProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    // Apenas virtualizar se houver muitos blocos
    const shouldVirtualize = blocks.length > threshold;

    const virtualizer = useVirtualizer({
        count: blocks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimatedBlockHeight,
        overscan: 3,
        enabled: shouldVirtualize,
    });

    // Renderização não-virtualizada (para poucos blocos)
    if (!shouldVirtualize) {
        return (
            <div
                ref={parentRef}
                className={cn('space-y-4 p-4', className)}
            >
                {blocks.map(block => (
                    <div
                        key={block.id}
                        onClick={() => onBlockSelect(block.id)}
                        className={cn(
                            'cursor-pointer transition-all',
                            selectedBlockId === block.id && 'ring-2 ring-blue-500'
                        )}
                    >
                        {renderBlock(block, selectedBlockId === block.id)}
                    </div>
                ))}
            </div>
        );
    }

    // Renderização virtualizada (para muitos blocos)
    return (
        <div
            ref={parentRef}
            className={cn('h-full overflow-auto', className)}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const block = blocks[virtualRow.index];
                    const isSelected = selectedBlockId === block.id;

                    return (
                        <div
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                            onClick={() => onBlockSelect(block.id)}
                            className={cn(
                                'cursor-pointer transition-all p-4',
                                isSelected && 'ring-2 ring-blue-500'
                            )}
                        >
                            {renderBlock(block, isSelected)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
