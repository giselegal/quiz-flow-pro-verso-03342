// @ts-nocheck
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { BlockComponentProps } from '@/types/blocks';

interface FAQItem {
  question: string;
  answer: string;
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

const FAQSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block) {
    return (
      <div style={{ borderColor: '#B89B7A' }}>
        <p style={{ color: '#432818' }}>Erro: Bloco não encontrado</p>
      </div>
    );
  }

  const { title = 'Perguntas Frequentes', faqItems = [] } = block.properties || {};

  const handleAddItem = () => {
    const newItem: FAQItem = {
      question: 'Nova pergunta',
      answer: 'Nova resposta',
    };
    const updatedItems = [...faqItems, newItem];
    onPropertyChange?.('faqItems', updatedItems);
  };

  const handleUpdateItem = (index: number, field: keyof FAQItem, value: string) => {
    const updatedItems = faqItems.map((item: FAQItem, i: number) =>
      i === index ? { ...item, [field]: value } : item
    );
    onPropertyChange?.('faqItems', updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = faqItems.filter((_: FAQItem, i: number) => i !== index);
    onPropertyChange?.('faqItems', updatedItems);
  };

  return (
    <div
      className={`
        p-6 rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-gray-300 hover:border-gray-400'
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      <h3 style={{ color: '#432818' }}>{title}</h3>

      {faqItems.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item: FAQItem, index: number) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div style={{ color: '#8B7355' }}>
          <p>Nenhuma pergunta adicionada ainda</p>
          <p className="text-sm">Configure as perguntas nas propriedades do bloco</p>
        </div>
      )}
    </div>
  );
};

export default FAQSectionInlineBlock;
