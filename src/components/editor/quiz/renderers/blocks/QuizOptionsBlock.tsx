import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { BlockRendererCommonProps } from './QuizIntroHeaderBlock';
import { useResultOptional } from '@/contexts/ResultContext';

interface QuizOptionsBlockProps extends BlockRendererCommonProps {
    block: Block;
}

const QuizOptionsBlock: React.FC<QuizOptionsBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties, contextData }) => {
    const props = block.properties || {};
    const content = (block as any).content || {};
    const options: Array<{ id: string; text: string; imageUrl?: string; value?: string }> = props.options || content.options || [];
    // Estilo e layout (alinhado ao /quiz-estilo)
    const borderColor: string = (props as any).borderColor || '#E5E7EB';
    const selectedBorderColor: string = (props as any).selectedBorderColor || '#B89B7A';
    const hoverColor: string = (props as any).hoverColor || '#F3E8D3';
    const selectionStyle: string = (props as any).selectionStyle || 'highlight';
    const columns: number = Number((props as any).columns ?? 2);
    const showImages: boolean = (props as any).showImages ?? true;
    const currentAnswers: string[] = contextData?.currentAnswers || [];
    const onAnswersChange: ((answers: string[]) => void) | undefined = contextData?.onAnswersChange;
    const result = useResultOptional();

    const toggle = (id: string) => {
        if (!onAnswersChange) return;
        const exists = currentAnswers.includes(id);
        const next = exists ? currentAnswers.filter(a => a !== id) : [...currentAnswers, id];
        onAnswersChange(next);
    };

    // Grid responsivo aproximado (classes estáticas para Tailwind)
    const gridColsClass = React.useMemo(() => {
        if (columns <= 1) return 'grid-cols-1';
        if (columns === 2) return 'grid-cols-1 md:grid-cols-2';
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }, [columns]);

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
            <div className={`w-full max-w-4xl px-4 mx-auto grid ${gridColsClass} gap-6`}>
                {options.length === 0 && (
                    <div className="col-span-2 text-xs text-gray-400 text-center py-4">Sem opções configuradas</div>
                )}
                {options.map(opt => {
                    const selected = currentAnswers.includes(opt.id);
                    const baseClasses = 'flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md';
                    const selectedClasses = selected ? 'shadow-lg transform -translate-y-1' : '';
                    const cardStyle: React.CSSProperties = {
                        borderColor: selected ? selectedBorderColor : borderColor,
                        background: selected && selectionStyle === 'highlight' ? 'linear-gradient(135deg, #ffffff 0%, #f8f5f0 100%)' : undefined,
                    };
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            className={`${baseClasses} ${selectedClasses}`}
                            style={cardStyle}
                            onClick={() => toggle(opt.id)}
                            onMouseEnter={(e) => { if (!selected) (e.currentTarget.style.backgroundColor = hoverColor); }}
                            onMouseLeave={(e) => { if (!selected) (e.currentTarget.style.backgroundColor = ''); }}
                        >
                            {showImages && opt.imageUrl && (
                                <img src={opt.imageUrl} alt={opt.text} className="rounded-md w-full mb-2 object-cover max-h-48" />
                            )}
                            <p className="text-center font-medium text-sm leading-relaxed text-[#432818]">
                                {result ? result.interpolateText(opt.text) : opt.text}
                            </p>
                            {selected && (
                                <div className="mt-2 w-6 h-6" style={{ backgroundColor: selectedBorderColor, borderRadius: '9999px' }}>
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </SelectableBlock>
    );
};

export default React.memo(QuizOptionsBlock);
