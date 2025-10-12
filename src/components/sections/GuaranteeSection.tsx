/**
 * GuaranteeSection Component
 * 
 * Seção de garantia com badge, descrição e ícones de segurança
 * 
 * @version 1.0.0
 * @date 2025-10-12
 */

import React from 'react';
import type { ThemeSystem, OfferSystem } from '@/types/template-v3.types';

interface GuaranteeSectionProps {
  theme: ThemeSystem;
  offer: OfferSystem;
  sectionId?: string;
  sectionTitle?: string;

  // Props customizáveis
  showIcon?: boolean;
  iconType?: 'shield' | 'check' | 'lock';
  highlightColor?: string;
}

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({
  theme,
  offer,
  sectionId,
  sectionTitle,
  showIcon = true,
  iconType = 'shield',
  highlightColor,
}) => {
  const icons = {
    shield: '🛡️',
    check: '✅',
    lock: '🔒',
  };

  const guaranteeColor = highlightColor || theme.colors.success || '#28a745';

  return (
    <section
      className="guarantee-section"
      data-section-id={sectionId}
      style={{
        padding: '4rem 1.5rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: 'var(--radius-large, 1rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${guaranteeColor}22 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        maxWidth: '650px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Icon */}
        {showIcon && (
          <div
            style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            {icons[iconType]}
          </div>
        )}

        {/* Badge */}
        <div
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: guaranteeColor,
            color: 'white',
            borderRadius: '3rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            boxShadow: `0 4px 12px ${guaranteeColor}40`,
            letterSpacing: '0.5px',
          }}
        >
          Garantia de {offer.guarantee.days} dias
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '2rem',
            fontFamily: theme.fonts.heading,
            color: theme.colors.secondary,
            marginBottom: '1.5rem',
            lineHeight: 1.3,
          }}
        >
          {sectionTitle || 'Garantia Incondicional'}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '1.125rem',
            fontFamily: theme.fonts.body,
            color: theme.colors.text,
            lineHeight: 1.7,
            marginBottom: '2rem',
          }}
        >
          {offer.guarantee.description}
        </p>

        {/* Trust badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '2rem',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: theme.colors.text,
            opacity: 0.8,
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔒</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Pagamento Seguro
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: theme.colors.text,
            opacity: 0.8,
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Acesso Imediato
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: theme.colors.text,
            opacity: 0.8,
          }}>
            <span style={{ fontSize: '1.5rem' }}>💳</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Sem Burocracia
            </span>
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
                        transform: scale(1.05);
                        opacity: 0.9;
                    }
                }
            `}</style>
    </section>
  );
};

export default GuaranteeSection;
