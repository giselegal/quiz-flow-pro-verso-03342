
import React from 'react';
import { Block } from '@/types/editor';
import { Star } from 'lucide-react';

interface TestimonialsBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
}

const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false
}) => {
  const title = block.content?.title || 'Depoimentos';
  const testimonials = block.content?.testimonials || [
    {
      name: 'Maria Silva',
      text: 'Excelente produto! Recomendo muito.',
      rating: 5
    },
    {
      name: 'João Santos',
      text: 'Mudou minha vida completamente.',
      rating: 5
    }
  ];

  return (
    <div 
      className={`p-6 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <h3 className="text-2xl font-bold text-[#432818] mb-6 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-[#B89B7A]/20">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-[#432818] mb-4">"{testimonial.text}"</p>
            <p className="text-sm font-medium text-[#8F7A6A]">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsBlock;
