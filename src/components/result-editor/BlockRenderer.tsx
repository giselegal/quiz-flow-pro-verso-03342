// @ts-nocheck
import { Block, FAQItem } from '@/types/editor';
import { StyleResult } from '@/types/quiz';

interface BlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  primaryStyle?: StyleResult;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isEditing = false,
  onUpdate,
  primaryStyle,
}) => {
  const content = block.content || {};

  const handleContentChange = (key: string, value: any) => {
    if (onUpdate) {
      onUpdate({ ...content, [key]: value });
    }
  };

  // Type guard to check if items is string array or FAQItem array
  const isStringArray = (items: any[]): items is string[] => {
    return items.length === 0 || typeof items[0] === 'string';
  };

  const isFAQItemArray = (items: any[]): items is FAQItem[] => {
    return items.length > 0 && typeof items[0] === 'object' && 'question' in items[0];
  };

  switch (block.type) {
    case 'header':
    case 'headline':
      return (
        <div className="text-center">
          {isEditing ? (
            <input
              type="text"
              value={content.title || ''}
              onChange={e => handleContentChange('title', e.target.value)}
              className="text-2xl font-bold w-full border-none outline-none bg-transparent"
              placeholder="Digite o título"
            />
          ) : (
            <h1 style={{ color: '#432818' }}>{content.title || 'Título'}</h1>
          )}
          {content.subtitle && <p style={{ color: '#6B4F43' }}>{content.subtitle}</p>}
        </div>
      );

    case 'text':
      return (
        <div>
          {isEditing ? (
            <textarea
              value={content.text || ''}
              onChange={e => handleContentChange('text', e.target.value)}
              className="w-full p-2 border rounded resize-none"
              rows={4}
              placeholder="Digite o texto"
            />
          ) : (
            <p style={{ color: '#6B4F43' }}>{content.text || 'Texto de exemplo'}</p>
          )}
        </div>
      );

    case 'image':
      return (
        <div className="text-center">
          {content.imageUrl ? (
            <img
              src={content.imageUrl}
              alt={content.imageAlt || 'Imagem'}
              className="max-w-full h-auto rounded-lg mx-auto"
            />
          ) : (
            <div style={{ backgroundColor: '#E5DDD5' }}>
              <span style={{ color: '#8B7355' }}>Imagem</span>
            </div>
          )}
          {content.description && <p style={{ color: '#6B4F43' }}>{content.description}</p>}
        </div>
      );

    case 'button':
      return (
        <div className="text-center">
          <button className="bg-[#B89B7A] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {content.buttonText || 'Clique aqui'}
          </button>
        </div>
      );

    case 'benefits':
      const benefitItems = content.items || [];
      return (
        <div>
          <h3 className="text-xl font-semibold mb-4">{content.title || 'Benefícios'}</h3>
          <ul className="space-y-2">
            {benefitItems.length > 0 && isStringArray(benefitItems) ? (
              benefitItems.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li style={{ color: '#8B7355' }}>Nenhum benefício adicionado</li>
            )}
          </ul>
        </div>
      );

    case 'faq':
      const faqItems = content.faqItems || content.items || [];
      return (
        <div>
          <h3 className="text-xl font-semibold mb-4">{content.title || 'Perguntas Frequentes'}</h3>
          <div className="space-y-4">
            {faqItems.length > 0 && isFAQItemArray(faqItems) ? (
              faqItems.map((item: FAQItem, index: number) => (
                <div key={index} className="border-b pb-3">
                  <h4 style={{ color: '#432818' }}>{item.question}</h4>
                  <p style={{ color: '#6B4F43' }}>{item.answer}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#8B7355' }}>Nenhuma pergunta adicionada</p>
            )}
          </div>
        </div>
      );

    case 'testimonials':
      return (
        <div style={{ backgroundColor: '#FAF9F7' }}>
          <blockquote style={{ color: '#432818' }}>
            "{content.quote || 'Depoimento incrível sobre o produto...'}"
          </blockquote>
          <cite style={{ color: '#6B4F43' }}>— {content.quoteAuthor || 'Nome do Cliente'}</cite>
        </div>
      );

    case 'pricing':
      return (
        <div className="bg-white border-2 border-[#B89B7A]/30 rounded-lg p-6 text-center">
          {content.regularPrice && (
            <div style={{ color: '#8B7355' }}>R$ {content.regularPrice}</div>
          )}
          <div style={{ color: '#B89B7A' }}>R$ {content.salePrice || '97'}</div>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
            Comprar Agora
          </button>
        </div>
      );

    default:
      return (
        <div style={{ color: '#6B4F43' }}>
          Bloco: {block.type}
          {content.title && <div className="font-medium">{content.title}</div>}
          {content.text && <div className="text-sm">{content.text}</div>}
        </div>
      );
  }
};

export default BlockRenderer;
