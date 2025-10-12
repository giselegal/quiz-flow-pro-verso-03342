/**
 * SocialProofSection Component
 * 
 * Seção de prova social com depoimentos, avatares e avaliações
 * 
 * @version 1.0.0
 * @date 2025-10-12
 */

import React from 'react';
import type { ThemeSystem } from '@/types/template-v3.types';

interface Testimonial {
  name: string;
  role: string;
  photo?: string;
  rating: number;
  text: string;
  date?: string;
}

interface SocialProofSectionProps {
  theme: ThemeSystem;
  sectionId?: string;
  sectionTitle?: string;

  // Props customizáveis
  testimonials?: Testimonial[];
  averageRating?: number;
  totalReviews?: number;
  showPhotos?: boolean;
  layout?: 'grid' | 'carousel';
}

export const SocialProofSection: React.FC<SocialProofSectionProps> = ({
  theme,
  sectionId,
  sectionTitle,
  testimonials = [
    {
      name: 'Mariana Santos',
      role: 'Empresária',
      photo: '👩‍💼',
      rating: 5,
      text: 'Nunca imaginei que entender meu estilo poderia mudar tanto minha autoconfiança. O método é prático e fácil de seguir!',
      date: '15 dias atrás',
    },
    {
      name: 'Ana Paula Lima',
      role: 'Designer',
      photo: '👩‍🎨',
      rating: 5,
      text: 'Finalmente consigo montar looks incríveis sem gastar horas pensando. A paleta de cores personalizada foi um divisor de águas!',
      date: '1 mês atrás',
    },
    {
      name: 'Juliana Costa',
      role: 'Advogada',
      photo: '👩‍⚖️',
      rating: 5,
      text: 'Investimento que valeu cada centavo. Meu guarda-roupa está organizado e sei exatamente o que comprar agora.',
      date: '2 meses atrás',
    },
    {
      name: 'Carla Mendes',
      role: 'Psicóloga',
      photo: '👩‍⚕️',
      rating: 5,
      text: 'O suporte do grupo VIP é maravilhoso! Sempre tem alguém pra tirar dúvidas e dar dicas. Recomendo muito!',
      date: '3 meses atrás',
    },
    {
      name: 'Patrícia Oliveira',
      role: 'Professora',
      photo: '👩‍🏫',
      rating: 5,
      text: 'Comprei achando que não ia usar muito, mas me surpreendi. Uso diariamente o checklist de compras e a planilha!',
      date: '4 meses atrás',
    },
    {
      name: 'Fernanda Rocha',
      role: 'Arquiteta',
      photo: '👩‍💻',
      rating: 5,
      text: 'Metodologia completa e bem estruturada. Senti que foi feito pensando em cada detalhe da minha jornada.',
      date: '5 meses atrás',
    },
  ],
  averageRating = 5.0,
  totalReviews = 247,
  showPhotos = true,
  layout = 'grid',
}) => {
  // Render stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < rating ? '#FFD700' : '#ddd',
          fontSize: '1.25rem',
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <section
      className="social-proof-section"
      data-section-id={sectionId}
      style={{
        padding: '5rem 1.5rem',
        background: '#f8f9fa',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            {sectionTitle || 'O Que Dizem Quem Já Transformou o Estilo'}
          </h2>

          {/* Rating Summary */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: theme.colors.primary,
            }}>
              {averageRating.toFixed(1)}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {renderStars(Math.round(averageRating))}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: theme.colors.text,
                opacity: 0.7,
                marginTop: '0.25rem',
              }}>
                Baseado em {totalReviews} avaliações
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: layout === 'grid'
            ? 'repeat(auto-fit, minmax(320px, 1fr))'
            : '1fr',
          gap: '1.5rem',
        }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-large, 1rem)',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              {/* Header: Photo + Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}>
                {/* Avatar */}
                {showPhotos && (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    flexShrink: 0,
                  }}>
                    {testimonial.photo}
                  </div>
                )}

                {/* Name + Role */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: theme.colors.secondary,
                    marginBottom: '0.25rem',
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: theme.colors.text,
                    opacity: 0.7,
                  }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div style={{
                display: 'flex',
                gap: '0.25rem',
                marginBottom: '1rem',
              }}>
                {renderStars(testimonial.rating)}
              </div>

              {/* Quote */}
              <blockquote style={{
                margin: 0,
                fontSize: '1rem',
                lineHeight: 1.7,
                color: theme.colors.text,
                fontStyle: 'italic',
                borderLeft: `4px solid ${theme.colors.primary}`,
                paddingLeft: '1rem',
                marginBottom: '1rem',
              }}>
                "{testimonial.text}"
              </blockquote>

              {/* Date */}
              {testimonial.date && (
                <div style={{
                  fontSize: '0.75rem',
                  color: theme.colors.text,
                  opacity: 0.5,
                  textAlign: 'right',
                }}>
                  {testimonial.date}
                </div>
              )}

              {/* Verified Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.75rem',
                background: `${theme.colors.success || '#28a745'}22`,
                color: theme.colors.success || '#28a745',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginTop: '1rem',
              }}>
                <span>✓</span> Compra Verificada
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div style={{
          marginTop: '3rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
        }}>
          <div style={{
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: theme.colors.primary,
            }}>
              {totalReviews}+
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: theme.colors.text,
              opacity: 0.7,
            }}>
              Alunas Satisfeitas
            </div>
          </div>

          <div style={{
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: theme.colors.primary,
            }}>
              {averageRating.toFixed(1)} ★
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: theme.colors.text,
              opacity: 0.7,
            }}>
              Avaliação Média
            </div>
          </div>

          <div style={{
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: theme.colors.primary,
            }}>
              98%
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: theme.colors.text,
              opacity: 0.7,
            }}>
              Recomendaria
            </div>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
    </section>
  );
};

export default SocialProofSection;
