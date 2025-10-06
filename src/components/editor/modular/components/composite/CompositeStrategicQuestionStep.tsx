import React from 'react';
import { CompositeQuestionOption } from './CompositeQuestionStep';

export interface CompositeStrategicQuestionStepProps {
  questionText: string;
  options: CompositeQuestionOption[];
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

const wrapperStyle: React.CSSProperties = {
  padding: '60px 24px',
  backgroundColor: '#0f172a',
};

const innerStyle: React.CSSProperties = {
  maxWidth: '720px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const questionStyle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 700,
  lineHeight: 1.4,
};

const optionStyle: React.CSSProperties = {
  width: '100%',
  padding: '18px 20px',
  borderRadius: '14px',
  border: '1px solid transparent',
  backgroundColor: 'rgba(15, 23, 42, 0.6)',
  color: '#f1f5f9',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'left',
};

const CompositeStrategicQuestionStep: React.FC<CompositeStrategicQuestionStepProps> = ({
  questionText,
  options,
  backgroundColor = '#0f172a',
  textColor = '#ffffff',
  accentColor = '#38bdf8',
}) => {
  return (
    <section style={{ ...wrapperStyle, backgroundColor }}>
      <div style={{ ...innerStyle, color: textColor }}>
        <h2 style={questionStyle}>{questionText}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              style={{
                ...optionStyle,
                backgroundColor: `${accentColor}10`,
                borderColor: `${accentColor}30`,
              }}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompositeStrategicQuestionStep;
