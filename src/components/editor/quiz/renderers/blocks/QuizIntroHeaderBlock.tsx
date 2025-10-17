import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';

export interface BlockRendererCommonProps {
    isSelected?: boolean;
    isEditable?: boolean;
    onSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    contextData?: Record<string, any>;
}

interface QuizIntroHeaderBlockProps extends BlockRendererCommonProps {
    block: Block;
}

const QuizIntroHeaderBlock: React.FC<QuizIntroHeaderBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties }) => {
    const props = block.properties || {};
    const logoUrl: string = props.logoUrl || props.url || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png';
    const logoAlt: string = props.logoAlt || props.alt || 'Logo';

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Header com Logo"
            onOpenProperties={() => onOpenProperties?.(block.id)}
            isDraggable={true}
        >
            <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 py-8 mx-auto space-y-8">
                <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                        <img
                            src={logoUrl}
                            alt={logoAlt}
                            className="h-auto mx-auto"
                            width={120}
                            height={50}
                            style={{ objectFit: 'contain', maxWidth: '120px', aspectRatio: '120 / 50' }}
                        />
                        <div className="h-[3px] bg-[#B89B7A] rounded-full mt-1.5 mx-auto" style={{ width: '300px', maxWidth: '90%' }} />
                    </div>
                </div>
            </header>
        </SelectableBlock>
    );
};

export default React.memo(QuizIntroHeaderBlock);
