import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Badge } from '@/components/ui/badge';
import { BlockComponentProps, SocialStat, Alignment } from './types';

/**
 * SocialProof - Componente de prova social configurável
 *
 * Exibe estatísticas e números impressionantes para construir credibilidade
 * e confiança, como quantidade de clientes, avaliações, etc.
 *
 * @example
 * <SocialProof
 *   title="Mais de 10.000 mulheres já transformaram seu estilo"
 *   stats={[
 *     { number: '10.000+', label: 'Mulheres Atendidas' },
 *     { number: '4.9★', label: 'Avaliação Média' },
 *     { number: '99%', label: 'Satisfação' }
 *   ]}
 *   layout="horizontal"
 *   showLogos={true}
 * />
 */

export interface SocialProofProps extends BlockComponentProps {
  // Conteúdo principal
  title?: string;
  subtitle?: string;
  description?: string;

  // Estatísticas
  stats: SocialStat[];

  // Layout
  layout?: 'horizontal' | 'vertical' | 'grid';
  alignment?: Alignment;

  // Elementos visuais
  showLogos?: boolean;
  logoUrls?: string[];
  showBadges?: boolean;
  badges?: string[];

  // Avaliações/Reviews
  showReviews?: boolean;
  averageRating?: number;
  totalReviews?: number;
  reviewPlatforms?: string[];

  // Certificações
  showCertifications?: boolean;
  certifications?: {
    name: string;
    icon?: string;
    description?: string;
  }[];

  // Estilo
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export const SocialProof: React.FC<SocialProofProps> = props => {
  const {
    // Conteúdo
    title,
    subtitle,
    description,

    // Estatísticas
    stats,

    // Layout
    layout = 'horizontal',
    alignment = 'center',

    // Elementos visuais
    showLogos = false,
    logoUrls = [],
    showBadges = false,
    badges = [],

    // Reviews
    showReviews = true,
    averageRating = 4.9,
    totalReviews = 1250,
    reviewPlatforms = ['Google', 'Facebook', 'Trustpilot'],

    // Certificações
    showCertifications = false,
    certifications = [],

    // Estilo
    backgroundColor = '#f8fafc',
    textColor = '#1f2937',
    accentColor = '#B89B7A',

    // Props base
    deviceView = 'desktop',
    className = '',
    style = {},
    testId = 'social-proof',
  } = props;

  // Classes de alinhamento
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Classes de layout para stats
  const statsLayoutClasses = {
    horizontal: 'flex flex-wrap justify-center gap-8 md:gap-12',
    vertical: 'flex flex-col space-y-2',
    grid:
      deviceView === 'mobile'
        ? 'grid grid-cols-1 gap-6'
        : deviceView === 'tablet'
          ? 'grid grid-cols-2 gap-6'
          : 'grid grid-cols-3 gap-8',
  };

  // Renderizar estrelas
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <svg
                key={`full-star-${index}`}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <svg
                key={`half-star-${index}`}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <defs>
                  <linearGradient id="half-star">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#d1d5db" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#half-star)"
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            );
          } else {
            return (
              <svg
                key={`empty-star-${index}`}
                className="w-5 h-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          }
        })}
      </div>
    );
  };

  const containerClasses = getOptimizedContainerClasses(
    deviceView || 'desktop',
    'tight',
    'full',
    className
  );

  return (
    <div
      className={containerClasses}
      style={{ backgroundColor, color: textColor, ...style }}
      data-testid={testId}
    >
      <div className="max-w-full mx-auto">
        {/* Header */}
        {(title || subtitle || description) && (
          <div className={`mb-12 ${alignmentClasses[alignment]}`}>
            {title && <h2 className="text-2xl md:text-4xl font-bold mb-4">{title}</h2>}

            {subtitle && (
              <h3 className="text-xl md:text-2xl font-medium mb-4 opacity-90">{subtitle}</h3>
            )}

            {description && <p className="text-lg opacity-80 max-w-2xl mx-auto">{description}</p>}
          </div>
        )}

        {/* Estatísticas Principais */}
        <div className={`mb-12 ${statsLayoutClasses[layout]}`}>
          {stats.map((stat, index) => (
            <div
              key={`stat-${stat.label}-${index}`}
              className="text-center"
              data-testid={`stat-${index}`}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: accentColor }}>
                {stat.number}
              </div>
              <div className="text-lg md:text-xl font-medium opacity-80">{stat.label}</div>
              {stat.icon && <div className="mt-2 text-2xl">{stat.icon}</div>}
            </div>
          ))}
        </div>

        {/* Avaliações */}
        {showReviews && (
          <div className="mb-12 text-center">
            <div className="inline-flex flex-col items-center space-y-2 px-6 py-4 bg-white bg-opacity-80 rounded-lg shadow-lg">
              {renderStars(averageRating)}
              <div className="text-lg font-semibold">{averageRating} de 5 estrelas</div>
              <div className="text-sm opacity-70">
                Baseado em {totalReviews.toLocaleString()} avaliações
              </div>
              {reviewPlatforms.length > 0 && (
                <div className="text-xs opacity-60">{reviewPlatforms.join(' • ')}</div>
              )}
            </div>
          </div>
        )}

        {/* Logos de Empresas/Parceiros */}
        {showLogos && logoUrls.length > 0 && (
          <div className="mb-12">
            <p className="text-center text-sm opacity-70 mb-6">Confiam em nós:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {logoUrls.map((logoUrl, index) => (
                <img
                  key={`logo-${logoUrl}-${index}`}
                  src={logoUrl}
                  alt={`Logo ${index + 1}`}
                  className="h-8 md:h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              ))}
            </div>
          </div>
        )}

        {/* Badges/Selos */}
        {showBadges && badges.length > 0 && (
          <div className="mb-12 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              {badges.map((badge, index) => (
                <Badge
                  key={`badge-${badge}-${index}`}
                  className="px-4 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    border: `1px solid ${accentColor}40`,
                  }}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certificações */}
        {showCertifications && certifications.length > 0 && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-6 opacity-90">
              Certificações e Reconhecimentos
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={`cert-${cert.name}-${index}`}
                  className="flex flex-col items-center space-y-2 p-4 bg-white bg-opacity-60 rounded-lg"
                >
                  {cert.icon && <div className="text-3xl">{cert.icon}</div>}
                  <div className="font-semibold text-sm">{cert.name}</div>
                  {cert.description && (
                    <div className="text-xs opacity-70 text-center max-w-20">
                      {cert.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialProof;
