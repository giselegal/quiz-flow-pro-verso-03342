// @ts-nocheck
import React, { useState } from 'react';
import quizStyles from '@/styles/quiz.module.css';

interface QuizOption {
  id: string;
  text: string;
  value: string;
  image?: string;
}

interface QuizOptionsProps {
  question?: string;
  options?: QuizOption[];
  multiSelect?: boolean;
  hasImages?: boolean; // Original prop
  showImages?: boolean; // ✅ NEW: Alias for hasImages (used in QUIZ_STEPS)
  maxSelections?: number; // Original prop
  requiredSelections?: number; // ✅ NEW: Alias for maxSelections (used in QUIZ_STEPS)
  onSelectionChange?: (selected: string[]) => void;
  className?: string;
}

const QuizOptions: React.FC<QuizOptionsProps> = ({
  question = 'Qual das opções abaixo mais combina com você?',
  options = [],
  multiSelect = false,
  hasImages = false,
  showImages, // ✅ Alias
  maxSelections = 1,
  requiredSelections, // ✅ Alias
  onSelectionChange,
  className = '',
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Use aliases if provided, otherwise fallback to original props
  const effectiveShowImages = showImages !== undefined ? showImages : hasImages;
  const effectiveMaxSelections = requiredSelections !== undefined ? requiredSelections : maxSelections;

  const handleOptionClick = (optionId: string) => {
    let newSelection: string[];

    if (multiSelect) {
      if (selectedOptions.includes(optionId)) {
        newSelection = selectedOptions.filter(id => id !== optionId);
      } else if (selectedOptions.length < effectiveMaxSelections) {
        newSelection = [...selectedOptions, optionId];
      } else {
        return; // Max selections reached
      }
    } else {
      newSelection = selectedOptions.includes(optionId) ? [] : [optionId];
    }

    setSelectedOptions(newSelection);
    onSelectionChange?.(newSelection);
  };

  const containerStyle: React.CSSProperties = {
    margin: '1.5rem 0',
  };

  const questionStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#432818',
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  const optionsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: effectiveShowImages ? 'repeat(auto-fit, minmax(200px, 1fr))' : '1fr',
    gap: '0.75rem',
    maxWidth: effectiveShowImages ? '768px' : '600px',
    margin: '0 auto',
  };

  if (options.length === 0) {
    return (
      <div style={containerStyle} className={className}>
        <div style={questionStyle}>{question}</div>
        <div style={{ color: '#8B7355' }}>
          <p>Nenhuma opção configurada</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <div style={questionStyle}>{question}</div>

      <div style={optionsContainerStyle}>
        {options.map(option => {
          const isSelected = selectedOptions.includes(option.id);
          const isDisabled = !isSelected && selectedOptions.length >= effectiveMaxSelections && multiSelect;

          const optionStyle: React.CSSProperties = {
            padding: effectiveShowImages ? '0' : '1rem 1.25rem',
            background: '#ffffff',
            border: isSelected ? '2px solid #b89b7a' : '2px solid #e5e7eb',
            borderRadius: '8px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.6 : 1,
            transition: 'all 0.2s ease',
            position: 'relative',
            display: 'flex',
            flexDirection: effectiveShowImages ? 'column' : 'row',
            alignItems: effectiveShowImages ? 'stretch' : 'center',
            justifyContent: effectiveShowImages ? 'flex-start' : 'space-between',
            backgroundColor: isSelected ? 'rgba(184, 155, 122, 0.05)' : '#ffffff',
          };

          const textStyle: React.CSSProperties = {
            color: '#432818',
            fontSize: effectiveShowImages ? '0.9rem' : '1rem',
            fontWeight: '500',
            textAlign: effectiveShowImages ? 'center' : 'left',
            padding: effectiveShowImages ? '0.75rem' : '0',
            margin: 0,
          };

          return (
            <div
              key={option.id}
              style={optionStyle}
              onClick={() => !isDisabled && handleOptionClick(option.id)}
              onMouseEnter={e => {
                if (!isDisabled) {
                  e.currentTarget.style.borderColor = '#d4c4b0';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={e => {
                if (!isDisabled) {
                  e.currentTarget.style.borderColor = isSelected ? '#b89b7a' : '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {effectiveShowImages && option.image && (
                <img
                  src={option.image}
                  alt={option.text}
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '6px 6px 0 0',
                  }}
                />
              )}

              <div style={textStyle}>{option.text}</div>

              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#b89b7a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {multiSelect && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: '#6b4f43',
          }}
        >
          {selectedOptions.length < effectiveMaxSelections ? (
            <span>
              💡 Selecione até {effectiveMaxSelections} opções ({selectedOptions.length}/{effectiveMaxSelections})
            </span>
          ) : (
            <span style={{ color: '#059669' }}>
              ✅ Máximo de seleções atingido ({selectedOptions.length}/{effectiveMaxSelections})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizOptions;
