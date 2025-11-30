import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import { useResultOptional } from '@/contexts/ResultContext';
import { sanitizeHtml } from '@/lib/utils/sanitizeHtml';

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
    const content = (block as any).content || {};
    const logoUrl: string = props.logoUrl || content.logoUrl || props.url || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png';
    const logoAlt: string = props.logoAlt || content.logoAlt || props.alt || 'Logo';
    const title: string | undefined = content.title || (props as any).title;
    const subtitle: string | undefined = content.subtitle || (props as any).subtitle;
    const description: string | undefined = content.description || (props as any).description;
    const imageUrl: string | undefined = content.imageUrl || (props as any).introImageUrl;
    const imageAlt: string | undefined = content.imageAlt || (props as any).introImageAlt || 'Imagem introdutória';
    const showProgress: boolean = Boolean(content.showProgress ?? (props as any).showProgress);
    const progressValue: number = Number(content.progressValue ?? (props as any).progressValue ?? 0);

    // Interpolação de textos com contexto de resultado (ex: {username})
    const result = useResultOptional();
    const titleInterp = title ? (result ? result.interpolateText(title) : title) : undefined;
    const subtitleInterp = subtitle ? (result ? result.interpolateText(subtitle) : subtitle) : undefined;
    const descriptionInterp = description ? (result ? result.interpolateText(description) : description) : undefined;

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Header de Introdução"
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

                {(titleInterp || subtitleInterp || descriptionInterp) && (
                    <div className="text-center space-y-3">
                        {titleInterp && (
                            <h1
                                className="text-2xl sm:text-3xl md:text-4xl leading-tight"
                                style={{ color: '#432818', fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(titleInterp) }}
                            />
                        )}
                        {subtitleInterp && (
                            <div
                                className="text-base md:text-lg"
                                style={{ color: '#432818', fontFamily: '"Playfair Display", serif' }}
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(subtitleInterp) }}
                            />
                        )}
                        {descriptionInterp && (
                            <p className="text-sm md:text-base text-gray-700">{descriptionInterp}</p>
                        )}
                    </div>
                )}

                {imageUrl && (
                    <div className="flex justify-center">
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="object-contain w-full max-w-[300px] h-auto rounded-lg"
                        />
                    </div>
                )}

                {showProgress && (
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-[#B89B7A] h-1.5 rounded-full" style={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }} />
                        </div>
                    </div>
                )}
            </header>
        </SelectableBlock>
    );
};

export default React.memo(QuizIntroHeaderBlock);
