import React from 'react';
import ModularFormFieldSimple from '../ModularFormFieldSimple';

export interface CompositeIntroStepProps {
    title: string;
    formQuestion: string;
    placeholder: string;
    buttonText: string;
    image?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    onSubmit?: () => void;
}

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 12px 30px rgba(30, 41, 59, 0.12)',
    maxWidth: '720px',
    margin: '0 auto',
};

const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.4,
};

const imageStyle: React.CSSProperties = {
    width: '100%',
    maxHeight: '360px',
    objectFit: 'cover',
    borderRadius: '12px',
};

const questionStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 500,
    textAlign: 'center',
};

const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 600,
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

const CompositeIntroStep: React.FC<CompositeIntroStepProps> = ({
    title,
    formQuestion,
    placeholder,
    buttonText,
    image,
    backgroundColor = '#ffffff',
    textColor = '#1f2937',
    accentColor = '#B89B7A',
    onSubmit,
}) => {
    return (
        <section
            style={{
                background: `linear-gradient(145deg, ${backgroundColor} 0%, #f8fafc 100%)`,
                padding: '40px 24px',
            }}
        >
            <div style={{ ...containerStyle, color: textColor, backgroundColor: '#ffffff' }}>
                {image && (
                    <img src={image} alt="Intro step" style={imageStyle} />
                )}

                <div
                    style={titleStyle}
                    dangerouslySetInnerHTML={{ __html: title }}
                />

                <div style={questionStyle}>{formQuestion}</div>

                <ModularFormFieldSimple
                    label=""
                    placeholder={placeholder}
                    required
                    containerProps={{ style: { width: '100%', marginBottom: 0 } }}
                    inputProps={{ style: { borderRadius: '12px', padding: '16px', fontSize: '16px' } }}
                />

                <button
                    type="button"
                    onClick={onSubmit}
                    style={{
                        ...buttonStyle,
                        backgroundColor: accentColor,
                        color: '#ffffff',
                        boxShadow: `0 10px 25px ${accentColor}40`,
                    }}
                >
                    {buttonText}
                </button>
            </div>
        </section>
    );
};

export default CompositeIntroStep;
