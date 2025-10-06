import React from 'react';

export interface CompositeOfferTestimonial {
    quote: string;
    author: string;
}

export interface CompositeOfferStepProps {
    title: string;
    description: string;
    buttonText: string;
    image?: string;
    testimonial?: CompositeOfferTestimonial;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

const wrapperStyle: React.CSSProperties = {
    padding: '88px 24px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #fff5f7 100%)',
};

const gridStyle: React.CSSProperties = {
    maxWidth: '1040px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
};

const imageStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '24px',
    objectFit: 'cover',
    boxShadow: '0 20px 30px rgba(190, 24, 93, 0.2)',
};

const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    borderRadius: '24px',
    padding: '40px',
    backgroundColor: '#ffffff',
    boxShadow: '0 16px 30px rgba(30, 41, 59, 0.12)',
};

const titleStyle: React.CSSProperties = {
    fontSize: '34px',
    fontWeight: 700,
    lineHeight: 1.3,
};

const descriptionStyle: React.CSSProperties = {
    fontSize: '18px',
    lineHeight: 1.7,
    color: '#475569',
};

const buttonStyle: React.CSSProperties = {
    padding: '18px 28px',
    borderRadius: '999px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

const testimonialStyle: React.CSSProperties = {
    borderRadius: '16px',
    backgroundColor: '#f8fafc',
    padding: '24px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
};

const CompositeOfferStep: React.FC<CompositeOfferStepProps> = ({
    title,
    description,
    buttonText,
    image,
    testimonial,
    backgroundColor,
    textColor = '#0f172a',
    accentColor = '#ec4899',
}) => {
    return (
        <section
            style={{
                ...wrapperStyle,
                background: backgroundColor || wrapperStyle.background,
                color: textColor,
            }}
        >
            <div
                style={{
                    ...gridStyle,
                    gridTemplateColumns: image ? 'minmax(0, 1fr) minmax(0, 1fr)' : '1fr',
                }}
            >
                {image && (
                    <div>
                        <img src={image} alt="Oferta" style={imageStyle} />
                    </div>
                )}

                <div style={contentStyle}>
                    <h2 style={titleStyle} dangerouslySetInnerHTML={{ __html: title }} />
                    <p style={descriptionStyle} dangerouslySetInnerHTML={{ __html: description }} />

                    <button
                        type="button"
                        style={{
                            ...buttonStyle,
                            backgroundColor: accentColor,
                            boxShadow: `0 15px 25px ${accentColor}40`,
                        }}
                    >
                        {buttonText}
                    </button>

                    {testimonial && (
                        <div style={testimonialStyle}>
                            <blockquote style={{ margin: 0, fontStyle: 'italic', color: '#334155' }}>
                                “{testimonial.quote}”
                            </blockquote>
                            <p style={{ marginTop: '12px', fontWeight: 600, color: '#0f172a' }}>{testimonial.author}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CompositeOfferStep;
