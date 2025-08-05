import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { BlockComponentProps } from '../../../types/blocks';

interface FAQItem {
  question: string;
  answer: string;
}

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
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado</p>
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
    const updatedItems = faqItems.map((item: FAQItem, i: number) => (i === index ? { ...item, [field]: value } : item));
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
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">{title}</h3>

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
        <div className="text-center text-gray-500 py-8">
          <p>Nenhuma pergunta adicionada ainda</p>
          <p className="text-sm">Configure as perguntas nas propriedades do bloco</p>
        </div>
      )}
    </div>
  );
};

export default FAQSectionInlineBlock;
