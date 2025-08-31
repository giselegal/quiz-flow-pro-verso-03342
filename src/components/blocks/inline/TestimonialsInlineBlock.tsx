import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { safeGetBlockProperties, logBlockDebug } from '@/utils/blockUtils';

/**
 * TestimonialsInlineBlock - Seção de depoimentos
 */

const TestimonialsInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('TestimonialsInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    title = 'Depoimentos',
    testimonials = [{ name: 'Ana Silva', text: 'Ótimo produto!', rating: 5 }],
  } = properties;

  return (
    <div
      className={cn(
        'w-full p-4 rounded-lg transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500',
        'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <h3 className="font-semibold mb-4 text-center">{title}</h3>
      <div className="space-y-4">
        {testimonials.map((testimonial: any, index: number) => (
          <div key={index} style={{ backgroundColor: '#FAF9F7' }}>
            <p className="text-sm mb-2">"{testimonial.text}"</p>
            <p className="font-medium text-xs">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsInlineBlock;
