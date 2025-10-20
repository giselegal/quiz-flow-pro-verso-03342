import React from 'react';
import type { BaseSectionProps } from '@/types/section-types';

export interface QuestionTitleContent {
    text: string;
    align?: 'left' | 'center' | 'right';
}

export interface QuestionTitleSectionProps extends BaseSectionProps {
    content: QuestionTitleContent;
}

export const QuestionTitleSection: React.FC<QuestionTitleSectionProps> = ({
    id,
    content,
    style,
    animation,
}) => {
    const alignClass = content.align === 'right' ? 'text-right' : content.align === 'left' ? 'text-left' : 'text-center';

    return (
        <div id={id} className={`w-full ${alignClass}`} style={{ marginBottom: 12, ...(style || {}) }}>
            <h2 id={`${id}-question-title`} className="text-xl md:text-2xl font-bold text-[#5b4135]">
                {content.text}
            </h2>
        </div>
    );
};

export default QuestionTitleSection;
