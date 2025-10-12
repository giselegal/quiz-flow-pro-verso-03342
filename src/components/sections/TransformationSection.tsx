/**
 * TransformationSection Component
 * 
 * Seção de jornada de transformação com layout antes/depois
 * 
 * @version 1.0.0
 * @date 2025-10-12
 */

import React from 'react';
import type { ThemeSystem } from '@/types/template-v3.types';

interface TransformationSectionProps {
  theme: ThemeSystem;
  sectionId?: string;
  sectionTitle?: string;

  // Props customizáveis
  beforeTitle?: string;
  beforeDescription?: string;
  beforePoints?: string[];
  afterTitle?: string;
  afterDescription?: string;
  afterPoints?: string[];
  timelineSteps?: Array<{
    label: string;
    description: string;
  }>;
}

export const TransformationSection: React.FC<TransformationSectionProps> = ({
  theme,
  sectionId,
  sectionTitle,
  beforeTitle = 'Antes',
  beforeDescription = 'Desafios e dificuldades enfrentadas',
  beforePoints = [
    'Insegurança com roupas',
    'Armário cheio, nada para vestir',
    'Compras por impulso',
    'Estilo indefinido',
  ],
  afterTitle = 'Depois',
  afterDescription = 'Transformação e conquistas alcançadas',
  afterPoints = [
    'Confiança no seu estilo',
    'Guarda-roupa estratégico',
    'Compras conscientes',
    'Identidade visual clara',
  ],
  timelineSteps = [
    { label: 'Autoconhecimento', description: 'Descubra quem você é' },
    { label: 'Análise', description: 'Entenda seu estilo' },
    { label: 'Estratégia', description: 'Crie seu plano' },
    { label: 'Transformação', description: 'Viva seu novo estilo' },
  ],
}) => {
  return (
    <section
      className="transformation-section"
      data-section-id={sectionId}
      style={{
        padding: '5rem 1.5rem',
        background: `linear-gradient(180deg, ${theme.colors.background} 0%, white 50%, ${theme.colors.background} 100%)`,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontFamily: theme.fonts.heading,
            color: theme.colors.secondary,
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}>
            {sectionTitle || 'Sua Jornada de Transformação'}
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: theme.colors.text,
            opacity: 0.8,
          }}>
            Do caos à clareza em 4 passos
          </p>
        </div>

        {/* Before/After Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
        }}>
          {/* Before Card */}
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-large, 1rem)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            border: '2px solid #e9ecef',
          }}>
            <div style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderBottom: '3px solid #dc3545',
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '0.5rem',
              }}>
                😔
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontFamily: theme.fonts.heading,
                color: theme.colors.secondary,
                marginBottom: '0.5rem',
              }}>
                {beforeTitle}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: theme.colors.text,
                opacity: 0.7,
              }}>
                {beforeDescription}
              </p>
            </div>
            <div style={{ padding: '2rem' }}>
              {beforePoints.map((point, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{
                    fontSize: '1.25rem',
                    color: '#dc3545',
                    flexShrink: 0,
                  }}>
                    ❌
                  </span>
                  <span style={{
                    fontSize: '0.95rem',
                    color: theme.colors.text,
                    lineHeight: 1.5,
                  }}>
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: theme.colors.primary,
          }}>
            <span style={{
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              →
            </span>
          </div>

          {/* After Card */}
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-large, 1rem)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            border: `2px solid ${theme.colors.success || '#28a745'}`,
          }}>
            <div style={{
              padding: '2rem',
              background: `linear-gradient(135deg, ${theme.colors.primary}22 0%, ${theme.colors.success || '#28a745'}22 100%)`,
              borderBottom: `3px solid ${theme.colors.success || '#28a745'}`,
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '0.5rem',
              }}>
                ✨
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontFamily: theme.fonts.heading,
                color: theme.colors.secondary,
                marginBottom: '0.5rem',
              }}>
                {afterTitle}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: theme.colors.text,
                opacity: 0.7,
              }}>
                {afterDescription}
              </p>
            </div>
            <div style={{ padding: '2rem' }}>
              {afterPoints.map((point, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{
                    fontSize: '1.25rem',
                    color: theme.colors.success || '#28a745',
                    flexShrink: 0,
                  }}>
                    ✅
                  </span>
                  <span style={{
                    fontSize: '0.95rem',
                    color: theme.colors.text,
                    lineHeight: 1.5,
                  }}>
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-large, 1rem)',
          padding: '3rem 2rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontFamily: theme.fonts.heading,
            color: theme.colors.secondary,
            marginBottom: '2.5rem',
            textAlign: 'center',
          }}>
            Como funciona a transformação
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${timelineSteps.length}, 1fr)`,
            gap: '1.5rem',
            position: 'relative',
          }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '30px',
              left: '10%',
              right: '10%',
              height: '3px',
              background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.success || '#28a745'} 100%)`,
              zIndex: 0,
            }} />

            {timelineSteps.map((step, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Number badge */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 1rem',
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}>
                  {index + 1}
                </div>

                {/* Label */}
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: theme.colors.secondary,
                  marginBottom: '0.5rem',
                }}>
                  {step.label}
                </div>

                {/* Description */}
                <div style={{
                  fontSize: '0.875rem',
                  color: theme.colors.text,
                  opacity: 0.7,
                  lineHeight: 1.4,
                }}>
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }
                
                @media (max-width: 768px) {
                    .transformation-section [style*="gridTemplateColumns"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
    </section>
  );
};

export default TransformationSection;
