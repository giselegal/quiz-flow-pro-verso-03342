/**
 * BonusSection Component
 * 
 * Seção de bônus com checkmarks animados e valores destacados
 * 
 * @version 1.0.0
 * @date 2025-10-12
 */

import React from 'react';
import type { ThemeSystem } from '@/types/template-v3.types';

interface Bonus {
  title: string;
  description: string;
  value?: string;
  icon?: string;
}

interface BonusSectionProps {
  theme: ThemeSystem;
  sectionId?: string;
  sectionTitle?: string;

  // Props customizáveis
  bonuses?: Bonus[];
  totalValue?: string;
  highlightColor?: string;
  showValues?: boolean;
}

export const BonusSection: React.FC<BonusSectionProps> = ({
  theme,
  sectionId,
  sectionTitle,
  bonuses = [
    {
      title: 'E-book: Guia Completo de Estilo',
      description: 'Manual ilustrado com dicas práticas para cada tipo de corpo',
      value: 'R$ 97',
      icon: '📚',
    },
    {
      title: 'Planilha de Organização',
      description: 'Template editável para catalogar seu guarda-roupa',
      value: 'R$ 47',
      icon: '📊',
    },
    {
      title: 'Checklist de Compras',
      description: 'Lista estratégica de peças essenciais por estação',
      value: 'R$ 27',
      icon: '✅',
    },
    {
      title: 'Acesso ao Grupo VIP',
      description: 'Comunidade exclusiva no WhatsApp com suporte e dicas',
      value: 'Sem preço',
      icon: '👥',
    },
    {
      title: 'Atualizações Gratuitas',
      description: 'Todos os novos conteúdos adicionados sem custo extra',
      value: 'Vitalício',
      icon: '🔄',
    },
  ],
  totalValue = 'R$ 171',
  highlightColor,
  showValues = true,
}) => {
  const accentColor = highlightColor || theme.colors.primary;

  return (
    <section
      className="bonus-section"
      data-section-id={sectionId}
      style={{
        padding: '5rem 1.5rem',
        background: `linear-gradient(135deg, ${accentColor}11 0%, white 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: `linear-gradient(135deg, ${accentColor} 0%, ${theme.colors.secondary} 100%)`,
            color: 'white',
            borderRadius: '3rem',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            🎁 Bônus Exclusivos
          </div>

          <h2 style={{
            fontSize: '2.5rem',
            fontFamily: theme.fonts.heading,
            color: theme.colors.secondary,
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}>
            {sectionTitle || 'Você Também Recebe'}
          </h2>

          {showValues && totalValue && (
            <p style={{
              fontSize: '1.25rem',
              color: theme.colors.text,
              opacity: 0.8,
            }}>
              Valor total em bônus: <strong style={{ color: accentColor }}>{totalValue}</strong>
            </p>
          )}
        </div>

        {/* Bonuses Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-large, 1rem)',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: `2px solid ${accentColor}22`,
                transition: 'all 0.3s ease',
                cursor: 'default',
                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 8px 30px ${accentColor}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              {/* Icon + Value */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '1rem',
              }}>
                {bonus.icon && (
                  <div style={{
                    fontSize: '2.5rem',
                  }}>
                    {bonus.icon}
                  </div>
                )}

                {showValues && bonus.value && (
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    background: `${accentColor}22`,
                    color: accentColor,
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}>
                    {bonus.value}
                  </div>
                )}
              </div>

              {/* Checkmark + Title */}
              <div style={{
                display: 'flex',
                alignItems: 'start',
                gap: '0.75rem',
                marginBottom: '0.75rem',
              }}>
                <span style={{
                  fontSize: '1.5rem',
                  color: theme.colors.success || '#28a745',
                  flexShrink: 0,
                }}>
                  ✓
                </span>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: theme.colors.secondary,
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  {bonus.title}
                </h3>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.95rem',
                color: theme.colors.text,
                opacity: 0.8,
                lineHeight: 1.6,
                margin: 0,
                paddingLeft: '2.25rem',
              }}>
                {bonus.description}
              </p>
            </div>
          ))}
        </div>

        {/* Total Value Card */}
        {showValues && totalValue && (
          <div style={{
            background: `linear-gradient(135deg, ${accentColor}22 0%, ${theme.colors.secondary}22 100%)`,
            borderRadius: 'var(--radius-large, 1rem)',
            padding: '2rem',
            textAlign: 'center',
            border: `3px solid ${accentColor}`,
          }}>
            <div style={{
              fontSize: '0.95rem',
              color: theme.colors.text,
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600,
            }}>
              Total em Bônus
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: accentColor,
              fontFamily: theme.fonts.heading,
            }}>
              {totalValue}
            </div>
            <div style={{
              fontSize: '1rem',
              color: theme.colors.text,
              opacity: 0.7,
              marginTop: '0.5rem',
            }}>
              Inclusos sem custo adicional
            </div>
          </div>
        )}
      </div>

      <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
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

export default BonusSection;
