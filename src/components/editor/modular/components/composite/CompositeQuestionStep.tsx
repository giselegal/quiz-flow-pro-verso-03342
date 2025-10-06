import React from 'react';
import ModularOptionsGridSimple from '../ModularOptionsGridSimple';

export interface CompositeQuestionOption {
    id: string;
    text: string;
    image?: string;
}

export interface CompositeQuestionStepProps {
    questionNumber?: string;
    questionText: string;
    subtitle?: string;
    options: CompositeQuestionOption[];
    requiredSelections?: number;
    allowMultipleSelection?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

const wrapperStyle: React.CSSProperties = {
    padding: '48px 24px',
    backgroundColor: '#ffffff',
};

const innerStyle: React.CSSProperties = {
    maxWidth: '960px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
};

const badgeStyle: React.CSSProperties = {
    alignSelf: 'center',
    padding: '6px 14px',
    borderRadius: '999px',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
};

const questionStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: 1.35,
};

const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '16px',
    color: '#64748b',
};

const CompositeQuestionStep: React.FC<CompositeQuestionStepProps> = ({
    questionNumber,
    questionText,
    subtitle,
    options,
    requiredSelections = 1,
    allowMultipleSelection = false,
    backgroundColor = '#f8fafc',
    textColor = '#0f172a',
    accentColor = '#0ea5e9',
}) => {
    return (
        <section style={{ ...wrapperStyle, backgroundColor }}>
            <div style={{ ...innerStyle, color: textColor }}>
                {questionNumber && (
                    <span style={{ ...badgeStyle, backgroundColor: `${accentColor}20`, color: accentColor }}>
                        {questionNumber}
                    </span>
                )}

                <h2 style={questionStyle}>{questionText}</h2>

                {(subtitle || requiredSelections) && (
                    <p style={subtitleStyle}>
                        {subtitle}
                        {subtitle && requiredSelections ? ' • ' : ''}
                        {requiredSelections
                            ? `Selecione ${allowMultipleSelection ? `até ${requiredSelections}` : requiredSelections} opção${requiredSelections > 1 ? 's' : ''}`
                            : null}
                    </p>
                )}

                <ModularOptionsGridSimple
                    options={options}
                    columns={2}
                    spacing="16px"
                    allowMultiple={allowMultipleSelection}
                />
            </div>
        </section>
    );
};

export default CompositeQuestionStep;
