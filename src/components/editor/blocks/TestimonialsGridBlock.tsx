import React from 'react';
import { Star } from 'lucide-react';
import type { BlockData } from '@/types/blocks';

interface TestimonialsGridBlockProps {
  block?: BlockData;
  testimonials?: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
  }>;
  gridColumns?: 1 | 2 | 3;
  showRating?: boolean;
  showAvatar?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

const TestimonialsGridBlock: React.FC<TestimonialsGridBlockProps> = ({
  block,
  testimonials,
  gridColumns = 3,
  showRating = true,
  showAvatar = true,
  backgroundColor = 'bg-gray-50',
  textColor = 'text-gray-900',
}) => {
  // Usar dados do block ou valores padrão
  const blockData = block?.properties || {};
  const finalTestimonials = testimonials ||
    blockData.testimonials || [
      {
        id: '1',
        name: 'Ana Silva',
        role: 'Empresária',
        content: 'Este quiz me ajudou a descobrir aspectos sobre minha personalidade que eu não conhecia. Recomendo!',
        rating: 5,
        avatar: '',
      },
      {
        id: '2',
        name: 'Carlos Santos',
        role: 'Designer',
        content: 'Interface incrível e resultado muito preciso. Compartilhei com todos os meus amigos.',
        rating: 5,
        avatar: '',
      },
      {
        id: '3',
        name: 'Maria Costa',
        role: 'Psicóloga',
        content: 'Como profissional da área, posso dizer que este quiz tem uma base sólida e resultados confiáveis.',
        rating: 5,
        avatar: '',
      },
    ];

  const finalGridColumns = gridColumns || blockData.gridColumns || 3;
  const finalShowRating = showRating ?? blockData.showRating ?? true;
  const finalShowAvatar = showAvatar ?? blockData.showAvatar ?? true;
  const finalBackgroundColor = backgroundColor || blockData.backgroundColor || 'bg-gray-50';
  const finalTextColor = textColor || blockData.textColor || 'text-gray-900';

  const getGridColumns = () => {
    switch (finalGridColumns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className={`py-12 px-4 ${finalBackgroundColor}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${finalTextColor} mb-4`}>O que nossos usuários dizem</h2>
          <p className={`text-lg ${finalTextColor} opacity-75`}>
            Depoimentos reais de pessoas que descobriram mais sobre si mesmas
          </p>
        </div>

        <div className="flex flex-wrap gap-8 justify-center">
          {finalTestimonials.map(
            (testimonial: {
              id: string;
              name: string;
              role: string;
              content: string;
              rating: number;
              avatar?: string;
            }) => (
              <div
                key={testimonial.id}
                className="flex-1 min-w-[300px] max-w-md bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Rating */}
                {finalShowRating && <div className="flex items-center mb-4">{renderStars(testimonial.rating)}</div>}

                {/* Content */}
                <blockquote className={`${finalTextColor} mb-6 text-base leading-relaxed`}>
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  {finalShowAvatar && (
                    <div className="mr-4">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(testimonial.name)}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <div className={`font-semibold ${finalTextColor}`}>{testimonial.name}</div>
                    <div className={`text-sm ${finalTextColor} opacity-75`}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsGridBlock;
