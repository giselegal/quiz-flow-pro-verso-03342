import React from 'react';

export interface CompositeResultStepProps {
  title: string;
  subtitle?: string;
  resultPlaceholder?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

const wrapperStyle: React.CSSProperties = {
  padding: '72px 24px',
  backgroundColor: '#f8fafc',
};

const cardStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  borderRadius: '24px',
  padding: '48px',
  backgroundColor: '#ffffff',
  boxShadow: '0 20px 30px rgba(15, 23, 42, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 700,
  lineHeight: 1.25,
};

const badgeStyle: React.CSSProperties = {
  alignSelf: 'center',
  padding: '8px 20px',
  borderRadius: '999px',
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  backgroundColor: '#e0f2fe',
  color: '#0284c7',
};

const CompositeResultStep: React.FC<CompositeResultStepProps> = ({
  title,
  subtitle = 'Seu estilo predominante será calculado com base nas respostas do quiz.',
  resultPlaceholder = 'Resultado aparecerá aqui...',
  backgroundColor = '#f8fafc',
  textColor = '#0f172a',
  accentColor = '#38bdf8',
}) => {
  return (
    <section style={{ ...wrapperStyle, backgroundColor }}>
      <div style={{ ...cardStyle, color: textColor }}>
        <span style={{ ...badgeStyle, backgroundColor: `${accentColor}20`, color: accentColor }}>
          Resultado Personalizado
        </span>

        <h2 style={titleStyle}>{title}</h2>

        <p style={{ fontSize: '18px', color: '#475569', margin: 0 }}>{subtitle}</p>

        <div
          style={{
            border: `2px dashed ${accentColor}50`,
            borderRadius: '16px',
            padding: '32px',
            fontSize: '24px',
            fontWeight: 600,
            color: accentColor,
          }}
        >
          {resultPlaceholder}
        </div>
      </div>
    </section>
  );
};

export default CompositeResultStep;
