/**
 * MethodStepsSection Component
 * 
 * Seção dos 5 passos da metodologia com cards expansíveis
 * 
 * @version 1.0.0
 * @date 2025-10-12
 */

import React, { useState } from 'react';
import type { ThemeSystem } from '@/types/template-v3.types';

interface MethodStep {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  benefits: string[];
}

interface MethodStepsSectionProps {
  theme: ThemeSystem;
  sectionId?: string;
  sectionTitle?: string;

  // Props customizáveis
  steps?: MethodStep[];
  showIcons?: boolean;
  expandable?: boolean;
}

export const MethodStepsSection: React.FC<MethodStepsSectionProps> = ({
  theme,
  sectionId,
  sectionTitle,
  steps = [
    {
      title: 'Autoconhecimento',
      subtitle: 'Descubra sua essência',
      icon: '🔍',
      description: 'Explore sua personalidade, valores e estilo de vida para entender o que realmente combina com você.',
      benefits: [
        'Quiz de personalidade de estilo',
        'Análise de coloração pessoal',
        'Identificação de preferências',
      ],
    },
    {
      title: 'Análise do Guarda-Roupa',
      subtitle: 'Organize o que você tem',
      icon: '👗',
      description: 'Avaliação profissional das peças atuais e identificação do que funciona para seu estilo.',
      benefits: [
        'Checklist de organização',
        'Guia de descarte consciente',
        'Lista de peças essenciais',
      ],
    },
    {
      title: 'Estratégia de Estilo',
      subtitle: 'Crie seu plano',
      icon: '📋',
      description: 'Desenvolvimento de um plano personalizado com looks versáteis e combinações estratégicas.',
      benefits: [
        'Paleta de cores personalizada',
        'Guia de combinações',
        'Planner de looks',
      ],
    },
    {
      title: 'Personal Styling',
      subtitle: 'Vista-se com confiança',
      icon: '✨',
      description: 'Aprenda a montar looks para diferentes ocasiões e expresse sua identidade através das roupas.',
      benefits: [
        'Tutorial de montagem de looks',
        'Dicas de proporção e corte',
        'Guia de ocasiões',
      ],
    },
    {
      title: 'Compras Conscientes',
      subtitle: 'Invista com inteligência',
      icon: '🛍️',
      description: 'Estratégias para fazer compras certeiras que complementam seu guarda-roupa e estilo pessoal.',
      benefits: [
        'Checklist de compras',
        'Guia de investimento',
        'Lista de lojas recomendadas',
      ],
    },
  ],
  showIcons = true,
  expandable = true,
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (index: number) => {
    if (!expandable) return;
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <section
      className="method-steps-section"
      data-section-id={sectionId}
      style={{
        padding: '5rem 1.5rem',
        background: 'white',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
            {sectionTitle || 'Os 5 Passos da Metodologia'}
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: theme.colors.text,
            opacity: 0.8,
          }}>
            Uma jornada estruturada para transformar seu estilo
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          {steps.map((step, index) => {
            const isExpanded = expandedStep === index;
            const isActive = !expandable || isExpanded;

            return (
              <div
                key={index}
                onClick={() => toggleStep(index)}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, white 0%, ${theme.colors.primary}11 100%)`
                    : 'white',
                  borderRadius: 'var(--radius-large, 1rem)',
                  boxShadow: isActive
                    ? `0 10px 40px ${theme.colors.primary}22`
                    : '0 4px 12px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  cursor: expandable ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  border: isActive
                    ? `2px solid ${theme.colors.primary}`
                    : '2px solid transparent',
                }}
              >
                {/* Step Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '2rem',
                }}>
                  {/* Number Badge */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: isActive
                      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                      : '#f8f9fa',
                    color: isActive ? 'white' : theme.colors.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}>
                    {index + 1}
                  </div>

                  {/* Icon (optional) */}
                  {showIcons && (
                    <div style={{
                      fontSize: '2.5rem',
                      flexShrink: 0,
                    }}>
                      {step.icon}
                    </div>
                  )}

                  {/* Title & Subtitle */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontFamily: theme.fonts.heading,
                      color: theme.colors.secondary,
                      marginBottom: '0.25rem',
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: '0.95rem',
                      color: theme.colors.text,
                      opacity: 0.7,
                      margin: 0,
                    }}>
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Expand Icon */}
                  {expandable && (
                    <div style={{
                      fontSize: '1.5rem',
                      color: theme.colors.primary,
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease',
                    }}>
                      ▼
                    </div>
                  )}
                </div>

                {/* Step Content (Expandable) */}
                {(!expandable || isExpanded) && (
                  <div style={{
                    padding: '0 2rem 2rem 2rem',
                    borderTop: '1px solid #e9ecef',
                    animation: expandable ? 'slideDown 0.3s ease' : 'none',
                  }}>
                    {/* Description */}
                    <p style={{
                      fontSize: '1rem',
                      color: theme.colors.text,
                      lineHeight: 1.7,
                      marginTop: '1.5rem',
                      marginBottom: '1.5rem',
                    }}>
                      {step.description}
                    </p>

                    {/* Benefits */}
                    <div>
                      <h4 style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: theme.colors.secondary,
                        marginBottom: '1rem',
                      }}>
                        O que você recebe:
                      </h4>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}>
                        {step.benefits.map((benefit, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                            }}
                          >
                            <span style={{
                              fontSize: '1.25rem',
                              color: theme.colors.success || '#28a745',
                            }}>
                              ✓
                            </span>
                            <span style={{
                              fontSize: '0.95rem',
                              color: theme.colors.text,
                            }}>
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        {expandable && (
          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: theme.colors.text,
            opacity: 0.6,
          }}>
            💡 Clique em cada passo para ver mais detalhes
          </div>
        )}
      </div>

      <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </section>
  );
};

export default MethodStepsSection;
