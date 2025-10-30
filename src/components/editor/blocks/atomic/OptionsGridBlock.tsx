import React, { useEffect, useRef } from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import { useResultOptional } from '@/contexts/ResultContext';

interface OptionsGridBlockProps {
    block: Block;
    isSelected?: boolean;
    isEditable?: boolean;
    onSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    contextData?: Record<string, any>;
}

const OptionsGridBlock: React.FC<OptionsGridBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties, contextData }) => {
    const ensureArray = <T,>(val: unknown): T[] => Array.isArray(val) ? (val as T[]) : [];
    const props = block?.properties || {};
    const content = (block as any)?.content || {};
    // Normalizar opções aceitando alias 'image' -> 'imageUrl'
    const rawOptions = ensureArray<{ id: string; text: string; imageUrl?: string; image?: string; value?: string }>(props.options || content.options);
    const options = rawOptions.map(opt => ({
        ...opt,
        imageUrl: opt.imageUrl || (opt as any).image || undefined,
    }));
    const currentAnswers = ensureArray<string>(contextData?.currentAnswers);
    const onAnswersChange: ((answers: string[]) => void) | undefined = contextData?.onAnswersChange;
    const result = useResultOptional();

    // Auto-advance configuration
    const autoAdvance = content.autoAdvance === true;
    const autoAdvanceDelay = content.autoAdvanceDelay || 1500;
    const minSelections = content.minSelections || content.requiredSelections || 1;
    const maxSelections = content.maxSelections || options.length;
    const multipleSelection = content.multipleSelection !== false;

    // Track if minimum selections are met
    const hasMinimumSelections = currentAnswers.length >= minSelections;
    const hasMaximumSelections = currentAnswers.length >= maxSelections;
    const canProceed = hasMinimumSelections;

    // Timer ref for auto-advance
    const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-advance effect
    useEffect(() => {
        // Clear any existing timer
        if (autoAdvanceTimerRef.current) {
            clearTimeout(autoAdvanceTimerRef.current);
            autoAdvanceTimerRef.current = null;
        }

        // Only auto-advance if enabled, user can proceed, and we have navigation
        if (autoAdvance && canProceed && !isEditable) {
            const goToNext = contextData?.goToNext || contextData?.onNext;

            if (goToNext && typeof goToNext === 'function') {
                autoAdvanceTimerRef.current = setTimeout(() => {
                    goToNext();
                }, autoAdvanceDelay);
            }
        }

        // Cleanup on unmount or when dependencies change
        return () => {
            if (autoAdvanceTimerRef.current) {
                clearTimeout(autoAdvanceTimerRef.current);
                autoAdvanceTimerRef.current = null;
            }
        };
    }, [autoAdvance, canProceed, autoAdvanceDelay, contextData, isEditable]);

    const toggle = (id: string) => {
        if (!onAnswersChange) return;
        const exists = currentAnswers.includes(id);

        // Handle single vs multiple selection
        if (!multipleSelection) {
            // Single selection: replace current selection
            onAnswersChange([id]);
        } else {
            // Multiple selection: toggle with max limit
            if (exists) {
                // Remove selection
                const next = currentAnswers.filter(a => a !== id);
                onAnswersChange(next);
            } else {
                // Add selection if under max limit
                if (currentAnswers.length < maxSelections) {
                    const next = [...currentAnswers, id];
                    onAnswersChange(next);
                }
            }
        }
    };

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Quiz Options"
            onOpenProperties={() => onOpenProperties?.(block.id)}
            isDraggable={true}
        >
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto grid grid-cols-2 gap-2">
                {options.length === 0 && (
                    <div className="col-span-2 text-xs text-gray-400 text-center py-4">Sem opções configuradas</div>
                )}
                {options.map(opt => (
                    <button
                        key={opt.id}
                        type="button"
                        data-testid={`option-${opt.id}`}
                        className={`border rounded-md p-2 text-sm transition ${currentAnswers.includes(opt.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                        onClick={() => toggle(opt.id)}
                    >
                        {opt.imageUrl && (
                            <img src={opt.imageUrl} alt={opt.text} className="w-full h-24 object-cover rounded" />
                        )}
                        <span className="block mt-1">{result ? result.interpolateText(opt.text) : opt.text}</span>
                    </button>
                ))}
            </div>
        </SelectableBlock>
    );
};

export default React.memo(OptionsGridBlock);
