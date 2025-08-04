import React from "react";
import Testimonials from "@/components/quiz-result/sales/Testimonials";

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
  cardStyle?: "default" | "modern" | "minimal";
  className?: string;
}

const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  blockId = "testimonials-block",
  testimonials = [
    {
      name: "Maria Silva",
      text: "O CaktoQuiz transformou completamente meu guarda-roupa! Agora sei exatamente o que combina comigo.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b167?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      location: "São Paulo, SP",
    },
    {
      name: "Ana Costa",
      text: "Finalmente descobri meu estilo! As dicas são incríveis e muito práticas.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      location: "Rio de Janeiro, RJ",
    },
    {
      name: "Júlia Santos",
      text: "Recomendo para todas as amigas! É um investimento que vale muito a pena.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      location: "Belo Horizonte, MG",
    },
  ],
  columns = 3,
  showStars = true,
  showImages = true,
  backgroundColor = "#ffffff",
  cardStyle = "default",
  className = "",
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
