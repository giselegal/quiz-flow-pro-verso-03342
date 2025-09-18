import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Card, CardContent } from '@/components/ui/card';
import { BlockComponentProps, Testimonial, Alignment } from './types';

/**
 * TestimonialsGrid - Componente de grade de depoimentos configurável
 *
 * Renderiza uma grade responsiva de depoimentos com fotos, nomes, profissões,
 * avaliações em estrelas e textos personalizáveis.
 *
 * @example
 * <TestimonialsGrid
 *   title="O que nossas clientes estão dizendo"
 *   testimonials={[
 *     {
 *       author: 'Maria Silva',
 *       role: 'Empresária',
 *       text: 'Transformou completamente meu estilo!',
 *       rating: 5,
 *       avatar: 'https://example.com/avatar1.jpg'
 *     }
 *   ]}
 *   layout="grid"
 *   showRatings={true}
 * />
 */

export interface TestimonialsGridProps extends BlockComponentProps {
  // Conteúdo
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];

  // Layout
  layout?: 'grid' | 'carousel' | 'list';
  columns?: 1 | 2 | 3 | 4;
  alignment?: Alignment;

  // Configurações visuais
  showRatings?: boolean;
  showAvatars?: boolean;
  showRoles?: boolean;
  showCompany?: boolean;

  // Estilo dos cards
  cardStyle?: 'elegant' | 'minimal' | 'bordered' | 'shadow';
  avatarSize?: 'small' | 'medium' | 'large';

  // Configurações responsivas
  mobileColumns?: 1 | 2;
  tabletColumns?: 1 | 2 | 3;
}

export const TestimonialsGrid: React.FC<TestimonialsGridProps> = props => {
  const {
    // Conteúdo
    title = 'Depoimentos de Clientes',
    subtitle,
    testimonials,

    // Layout
    layout = 'grid',
    columns = 3,
    alignment = 'center',

    // Configurações
    showRatings = true,
    showAvatars = true,
    showRoles = true,
    showCompany = false,

    // Estilo
    cardStyle = 'elegant',
    avatarSize = 'medium',

    // Responsivo
    mobileColumns = 1,
    tabletColumns = 2,

    // Props base
    deviceView = 'desktop',
    className = '',
    style = {},
    testId = 'testimonials-grid',
  } = props;

  // Classes de alinhamento
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Classes de layout da grade
  const getGridClasses = () => {
    const baseClasses = 'grid gap-6';

    if (deviceView === 'mobile') {
      return `${baseClasses} grid-cols-${mobileColumns}`;
    } else if (deviceView === 'tablet') {
      return `${baseClasses} grid-cols-${tabletColumns}`;
    } else {
      return `${baseClasses} grid-cols-${columns}`;
    }
  };

  // Classes de estilo do card
  const cardStyleClasses = {
    elegant:
      'bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300',
    minimal: 'bg-gray-50 border-none hover:bg-white transition-colors duration-300',
    bordered:
      'bg-white border-2 border-gray-200 hover:border-[#B89B7A] transition-colors duration-300',
    shadow: 'bg-white shadow-xl border-none hover:shadow-2xl transition-shadow duration-300',
  };

  // Classes de tamanho do avatar
  const avatarSizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  };

  // Renderizar estrelas
  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Renderizar um depoimento
  const renderTestimonial = (testimonial: Testimonial, index: number) => (
    <Card
      key={testimonial.id || index}
      className={`${cardStyleClasses[cardStyle]} overflow-hidden`}
      data-testid={`testimonial-${index}`}
    >
      <CardContent className="p-6">
        {/* Header com Avatar e Info */}
        <div className="flex items-center space-x-4 mb-4">
          {/* Avatar */}
          {showAvatars && testimonial.avatar && (
            <img
              src={testimonial.avatar}
              alt={`Avatar de ${testimonial.author}`}
              className={`${avatarSizeClasses[avatarSize]} rounded-full object-cover`}
            />
          )}

          {/* Info do Cliente */}
          <div className="flex-1">
            <h4 className="font-semibold text-[#432818] text-lg">{testimonial.author}</h4>

            {showRoles && testimonial.role && (
              <p style={{ color: '#6B4F43' }}>
                {testimonial.role}
                {showCompany && testimonial.company && ` • ${testimonial.company}`}
              </p>
            )}

            {testimonial.location && <p style={{ color: '#8B7355' }}>📍 {testimonial.location}</p>}
          </div>
        </div>

        {/* Avaliação */}
        {showRatings && testimonial.rating && (
          <div className="mb-4">{renderStars(testimonial.rating)}</div>
        )}

        {/* Texto do Depoimento */}
        <blockquote style={{ color: '#6B4F43' }}>
          <span className="text-[#B89B7A] text-4xl font-serif leading-none">"</span>
          <span className="text-base">{testimonial.text}</span>
          <span className="text-[#B89B7A] text-4xl font-serif leading-none">"</span>
        </blockquote>
      </CardContent>
    </Card>
  );

  const containerClasses = getOptimizedContainerClasses(
    deviceView || 'desktop',
    'tight',
    'full',
    className
  );

  return (
    <div className={containerClasses} style={style} data-testid={testId}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className={`mb-12 ${alignmentClasses[alignment]}`}>
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4">{title}</h2>
            )}

            {subtitle && <p style={{ color: '#6B4F43' }}>{subtitle}</p>}
          </div>
        )}

        {/* Grid de Depoimentos */}
        {layout === 'grid' && (
          <div className={getGridClasses()}>
            {testimonials.map((testimonial, index) => renderTestimonial(testimonial, index))}
          </div>
        )}

        {/* Lista de Depoimentos */}
        {layout === 'list' && (
          <div className="space-y-2">
            {testimonials.map((testimonial, index) => renderTestimonial(testimonial, index))}
          </div>
        )}

        {/* Carousel de Depoimentos (versão simplificada) */}
        {layout === 'carousel' && (
          <div className="overflow-x-auto">
            <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id || index}
                  className="flex-shrink-0"
                  style={{ width: deviceView === 'mobile' ? '280px' : '320px' }}
                >
                  {renderTestimonial(testimonial, index)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estatística de Satisfação */}
        {testimonials.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-green-50 border border-green-200 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-800 font-semibold">
                Mais de {testimonials.length * 100}+ clientes satisfeitas
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsGrid;
