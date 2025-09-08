import React from 'react';
import { cn } from '@/lib/utils';
import { InlineEditableText } from '@/components/editor/blocks/InlineEditableText';
import type { BlockComponentProps } from '@/types/blocks';

const SalesHeroBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected,
    onPropertyChange,
    className = '',
}) => {
    const props = block?.properties || {};

    const {
        eyebrow = 'Apresente sua grande ideia',
        title = 'Título de impacto que comunica valor',
        subtitle = 'Subtítulo claro mostrando benefício e removendo objeções',
        primaryCtaText = 'Começar agora',
        primaryCtaUrl = '#',
        secondaryCtaText = 'Ver detalhes',
        secondaryCtaUrl = '#',
        align = 'center', // left | center | right
        bgColor = '#FFFFFF',
        textColor = '#432818',
        accentColor = '#B89B7A',
        containerWidth = 'xl', // sm | md | lg | xl | full
        paddingY = 32, // px
    } = props;

    const containerMax = (
        containerWidth === 'sm' ? 'max-w-screen-sm' :
            containerWidth === 'md' ? 'max-w-screen-md' :
                containerWidth === 'lg' ? 'max-w-screen-lg' :
                    containerWidth === 'full' ? 'max-w-none' : 'max-w-screen-xl'
    );

    const alignCls = align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center';

    const handleChange = (key: string, value: any) => onPropertyChange?.(key, value);

    return (
        <section
            className={cn(
                'w-full border rounded-lg',
                isSelected ? 'border-[#B89B7A]' : 'border-transparent',
                className,
            )}
            style={{ backgroundColor: bgColor }}
        >
            <div className={cn('mx-auto px-6', containerMax)} style={{ paddingTop: paddingY, paddingBottom: paddingY }}>
                <div className={cn('flex flex-col gap-4', alignCls)} style={{ color: textColor }}>
                    <span className="uppercase tracking-wide text-sm opacity-80">
                        <InlineEditableText
                            value={eyebrow}
                            onChange={(v) => handleChange('eyebrow', v)}
                            placeholder="Eyebrow"
                            className="uppercase tracking-wide text-sm"
                        />
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        <InlineEditableText
                            value={title}
                            onChange={(v) => handleChange('title', v)}
                            placeholder="Título forte"
                            className=""
                        />
                    </h1>
                    <p className="text-base md:text-lg opacity-90 max-w-2xl">
                        <InlineEditableText
                            value={subtitle}
                            onChange={(v) => handleChange('subtitle', v)}
                            placeholder="Subtítulo persuasivo"
                            className=""
                            multiline
                        />
                    </p>

                    <div className={cn('flex flex-wrap gap-3', align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start')}>
                        <a
                            href={primaryCtaUrl}
                            onClick={(e) => e.preventDefault()}
                            className="px-5 py-3 rounded-md text-white"
                            style={{ backgroundColor: accentColor }}
                        >
                            <InlineEditableText
                                value={primaryCtaText}
                                onChange={(v) => handleChange('primaryCtaText', v)}
                                placeholder="CTA primária"
                            />
                        </a>
                        <a
                            href={secondaryCtaUrl}
                            onClick={(e) => e.preventDefault()}
                            className="px-5 py-3 rounded-md border"
                            style={{ borderColor: accentColor, color: textColor }}
                        >
                            <InlineEditableText
                                value={secondaryCtaText}
                                onChange={(v) => handleChange('secondaryCtaText', v)}
                                placeholder="CTA secundária"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SalesHeroBlock;
