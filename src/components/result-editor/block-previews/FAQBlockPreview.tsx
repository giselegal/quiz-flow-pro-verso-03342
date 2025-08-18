import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQBlockPreviewProps {
  content: {
    faqItems?: {
      question: string;
      answer: string;
    }[];
    defaultOpen?: boolean;
    style?: any;
  };
}

const FAQBlockPreview: React.FC<FAQBlockPreviewProps> = ({ content }) => {
  const { faqItems = [], defaultOpen = false, style = {} } = content;

  // Define o valor padrão para o Accordion
  const defaultValue = defaultOpen && faqItems.length > 0 ? `item-0` : undefined;

  return (
    <div style={style} className="w-full">
      {faqItems.length === 0 ? (
        <div className="p-6 text-center text-gray-400 border border-dashed rounded-md">
          Adicione perguntas frequentes ao seu FAQ
        </div>
      ) : (
        <Accordion type="single" collapsible defaultValue={defaultValue} className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
              <AccordionContent>
                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default FAQBlockPreview;
