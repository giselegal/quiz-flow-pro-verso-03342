import React from 'react';

export interface CompositeTransitionResultStepProps {
    title: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

const sectionStyle: React.CSSProperties = {
    padding: '100px 24px',
    background: 'linear-gradient(120deg, #f8fafc 0%, #e0f2fe 100%)',
};

const containerStyle: React.CSSProperties = {
    maxWidth: '640px',
    margin: '0 auto',
    textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.3,
};

const CompositeTransitionResultStep: React.FC<CompositeTransitionResultStepProps> = ({
    title,
    backgroundColor,
    textColor = '#0f172a',
    accentColor = '#38bdf8',
}) => {
    return (
        <section
            style={{
                ...sectionStyle,
                background: backgroundColor || `linear-gradient(120deg, ${accentColor}10 0%, #f8fafc 100%)`,
            }}
        >
            <div style={{ ...containerStyle, color: textColor }}>
                <h2 style={titleStyle}>{title}</h2>
                <p style={{ marginTop: '16px', fontSize: '18px', color: `${textColor}cc` }}>
                    Estamos preparando o seu resultado personalizado. Continue para a próxima etapa!
                </p>
            </div>
        </section>
    );
};

export default CompositeTransitionResultStep;
