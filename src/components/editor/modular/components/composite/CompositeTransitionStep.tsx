import React from 'react';

export interface CompositeTransitionStepProps {
  title: string;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

const sectionStyle: React.CSSProperties = {
  padding: '80px 24px',
  display: 'flex',
  justifyContent: 'center',
};

const cardStyle: React.CSSProperties = {
  maxWidth: '720px',
  width: '100%',
  borderRadius: '20px',
  padding: '48px',
  textAlign: 'center',
  boxShadow: '0 24px 40px rgba(15, 23, 42, 0.12)',
};

const titleStyle: React.CSSProperties = {
  fontSize: '30px',
  fontWeight: 700,
  lineHeight: 1.3,
  marginBottom: '16px',
};

const textStyle: React.CSSProperties = {
  fontSize: '18px',
  lineHeight: 1.6,
  margin: 0,
};

const CompositeTransitionStep: React.FC<CompositeTransitionStepProps> = ({
  title,
  text,
  backgroundColor = '#ffffff',
  textColor = '#0f172a',
  accentColor = '#38bdf8',
}) => {
  return (
    <section style={{ ...sectionStyle, backgroundColor: `${accentColor}08` }}>
      <div style={{ ...cardStyle, backgroundColor, color: textColor }}>
        <h2 style={titleStyle}>{title}</h2>
        {text && <p style={textStyle}>{text}</p>}
      </div>
    </section>
  );
};

export default CompositeTransitionStep;
