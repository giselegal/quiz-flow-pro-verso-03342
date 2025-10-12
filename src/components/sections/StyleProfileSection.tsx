/**
 * StyleProfileSection Component
 * 
 * Seção de perfil de estilo com características, cores e descrição personalizada
 * 
 * @version 1.0.0
 * @date 2025-10-12
 */

import React from 'react';
import type { ThemeSystem, UserData } from '@/types/template-v3.types';

interface StyleProfileSectionProps {
  theme: ThemeSystem;
  userData?: UserData;
  sectionId?: string;
  sectionTitle?: string;

  // Props customizáveis
  characteristics?: string[];
  colorPalette?: string[];
  description?: string;
  showColorPalette?: boolean;
}

export const StyleProfileSection: React.FC<StyleProfileSectionProps> = ({
  theme,
  userData,
  sectionId,
  sectionTitle,
  characteristics = [
    'Sofisticado e elegante',
    'Peças atemporais',
    'Paleta neutra com toques de cor',
    'Cortes estruturados',
  ],
  colorPalette = ['#2C3E50', '#ECF0F1', '#95A5A6', '#BDC3C7'],
  description = 'Seu estilo reflete equilíbrio entre elegância e praticidade, valorizando peças de qualidade e design atemporal.',
  showColorPalette = true,
}) => {
  const styleName = userData?.styleName || 'Seu Estilo';

  return (
    <section
      className="style-profile-section"
      data-section-id={sectionId}
      style={{
        padding: '4rem 1.5rem',
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, white 100%)`,
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontFamily: theme.fonts.heading,
            color: theme.colors.secondary,
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}>
            {sectionTitle || 'Seu Perfil de Estilo'}
          </h2>

          <p style={{
            fontSize: '1.25rem',
            color: theme.colors.primary,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            {styleName}
          </p>
        </div>

        {/* Main card */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-large, 1rem)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          {/* Description */}
          <div style={{
            padding: '2.5rem',
            borderLeft: `5px solid ${theme.colors.primary}`,
          }}>
            <p style={{
              fontSize: '1.125rem',
              fontFamily: theme.fonts.body,
              color: theme.colors.text,
              lineHeight: 1.8,
              margin: 0,
            }}>
              {description}
            </p>
          </div>

          {/* Characteristics grid */}
          <div style={{
            padding: '2.5rem',
            background: '#f8f9fa',
            borderTop: '1px solid #e9ecef',
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontFamily: theme.fonts.heading,
              color: theme.colors.secondary,
              marginBottom: '1.5rem',
            }}>
              Características do seu estilo
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}>
              {characteristics.map((char, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: 'var(--radius-medium, 0.75rem)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <span style={{
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}>
                    ✨
                  </span>
                  <span style={{
                    fontSize: '0.95rem',
                    color: theme.colors.text,
                    fontFamily: theme.fonts.body,
                  }}>
                    {char}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Color palette */}
          {showColorPalette && (
            <div style={{
              padding: '2.5rem',
              borderTop: '1px solid #e9ecef',
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: theme.fonts.heading,
                color: theme.colors.secondary,
                marginBottom: '1.5rem',
              }}>
                Paleta de cores recomendada
              </h3>

              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {colorPalette.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: color,
                      borderRadius: '50%',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: '3px solid white',
                    }} />
                    <span style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: theme.colors.text,
                      opacity: 0.7,
                    }}>
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StyleProfileSection;
