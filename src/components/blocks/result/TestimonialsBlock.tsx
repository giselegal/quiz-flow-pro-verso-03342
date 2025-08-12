// @ts-nocheck
import Testimonials from '@/components/quiz-result/sales/Testimonials';

/**
 * BLOCO EDITÁVEL: Grid de Depoimentos
 *
 * Props Editáveis:
 * - testimonials: array de depoimentos
 * - columns: number (colunas no grid)
 * - showStars: boolean (mostrar estrelas)
 * - showImages: boolean (mostrar avatars)
 * - backgroundColor: string
 * - cardStyle: 'default' | 'modern' | 'minimal'
 *
 * Exemplo de Uso:
 * <TestimonialsBlock
 *   testimonials={[
 *     {
 *       name: 'Maria Silva',
 *       text: 'Transformou meu guarda-roupa!',
 *       image: 'https://...',
 *       rating: 5
 *     }
 *   ]}
 *   columns={3}
 *   showStars={true}
 * />
 */

export interface TestimonialData {
  name: string;
  text: string;
  image?: string;
  rating?: number;
  location?: string;
}

export interface TestimonialsBlockProps {
  blockId?: string;
  testimonials?: TestimonialData[];
  columns?: number;
  showStars?: boolean;
  showImages?: boolean;
  backgroundColor?: string;
  cardStyle?: 'default' | 'modern' | 'minimal';
  className?: string;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  blockId = 'testimonials-block',
  testimonials = [
    {
      name: 'Maria Silva',
      text: 'O CaktoQuiz transformou completamente meu guarda-roupa! Agora sei exatamente o que combina comigo.',
      image:
        'https://images.unsplash.com/photo-1494790108755-2616b612b167?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      location: 'São Paulo, SP',
    },
    {
      name: 'Ana Costa',
      text: 'Finalmente descobri meu estilo! As dicas são incríveis e muito práticas.',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      location: 'Rio de Janeiro, RJ',
    },
    {
      name: 'Júlia Santos',
      text: 'Recomendo para todas as amigas! É um investimento que vale muito a pena.',
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      location: 'Belo Horizonte, MG',
    },
  ],
  columns = 3,
  showStars = true,
  showImages = true,
  backgroundColor = '#ffffff',
  cardStyle = 'default',
  className = '',
}) => {
  return (
    <div
      className={`testimonials-block ${className}`}
      data-block-id={blockId}
      style={{ backgroundColor }}
    >
      <Testimonials />
    </div>
  );
};

export default TestimonialsBlock;
