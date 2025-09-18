import { getOptimizedContainerClasses } from '@/config/containerConfig';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BlockComponentProps, FAQ, Alignment } from './types';

/**
 * FAQSection - Componente de seção de perguntas frequentes
 *
 * Renderiza uma lista expansível de perguntas e respostas com animações
 * suaves e funcionalidade de acordeão.
 *
 * @example
 * <FAQSection
 *   title="Perguntas Frequentes"
 *   faqs={[
 *     {
 *       question: 'Como funciona a consultoria?',
 *       answer: 'Nossa consultoria é 100% personalizada...'
 *     }
 *   ]}
 *   allowMultipleOpen={false}
 * />
 */

export interface FAQSectionProps extends BlockComponentProps {
  // Conteúdo
  title?: string;
  subtitle?: string;
  faqs: FAQ[];

  // Configurações de comportamento
  allowMultipleOpen?: boolean;
  openFirst?: boolean;

  // Layout e estilos
  alignment?: Alignment;
  cardStyle?: 'minimal' | 'bordered' | 'elevated';

  // Configurações visuais
  showIcons?: boolean;
  iconStyle?: 'chevron' | 'plus' | 'arrow';

  // Callbacks
  onFAQToggle?: (faqId: string, isOpen: boolean) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = props => {
  const {
    // Conteúdo
    title = 'Perguntas Frequentes',
    subtitle,
    faqs,

    // Comportamento
    allowMultipleOpen = false,
    openFirst = false,

    // Layout
    alignment = 'center',
    cardStyle = 'bordered',

    // Visual
    showIcons = true,
    iconStyle = 'chevron',

    // Callbacks
    onFAQToggle,

    // Props base
    deviceView = 'desktop',
    className = '',
    style = {},
    testId = 'faq-section',
  } = props;

  const [openFAQs, setOpenFAQs] = useState<Set<string>>(
    new Set(openFirst && faqs.length > 0 ? [faqs[0].id || '0'] : [])
  );

  // Classes de alinhamento
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Classes de estilo do card
  const cardStyleClasses = {
    minimal: 'border-none shadow-none bg-transparent',
    bordered: 'border border-gray-200 hover:border-[#B89B7A] transition-colors duration-200',
    elevated: 'shadow-lg hover:shadow-xl transition-shadow duration-200 border-none',
  };

  // Manipular toggle de FAQ
  const toggleFAQ = (faqId: string) => {
    const newOpenFAQs = new Set(openFAQs);

    if (newOpenFAQs.has(faqId)) {
      newOpenFAQs.delete(faqId);
    } else {
      if (!allowMultipleOpen) {
        newOpenFAQs.clear();
      }
      newOpenFAQs.add(faqId);
    }

    setOpenFAQs(newOpenFAQs);
    onFAQToggle?.(faqId, newOpenFAQs.has(faqId));
  };

  // Renderizar ícone
  const renderIcon = (isOpen: boolean) => {
    if (!showIcons) return null;

    const iconClasses = `w-5 h-5 text-[#B89B7A] transition-transform duration-200 ${
      isOpen ? 'transform rotate-180' : ''
    }`;

    switch (iconStyle) {
      case 'chevron':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        );
      case 'plus':
        return (
          <div className="w-5 h-5 text-[#B89B7A] transition-transform duration-200">
            {isOpen ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
          </div>
        );
      case 'arrow':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  const containerClasses = getOptimizedContainerClasses(
    deviceView || 'desktop',
    'tight',
    'full',
    className
  );

  return (
    <div className={containerClasses} style={style} data-testid={testId}>
      <div className="max-w-full mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className={`mb-12 ${alignmentClasses[alignment]}`}>
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4">{title}</h2>
            )}

            {subtitle && <p style={{ color: '#6B4F43' }}>{subtitle}</p>}
          </div>
        )}

        {/* Lista de FAQs */}
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const faqId = faq.id || index.toString();
            const isOpen = openFAQs.has(faqId);

            return (
              <Card
                key={faqId}
                className={`${cardStyleClasses[cardStyle]} overflow-hidden`}
                data-testid={`faq-${index}`}
              >
                <CardContent className="p-0">
                  {/* Pergunta - Clicável */}
                  <button
                    style={{ backgroundColor: '#FAF9F7' }}
                    onClick={() => toggleFAQ(faqId)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faqId}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg md:text-xl font-semibold text-[#432818] pr-4">
                        {faq.question}
                      </h3>
                      {renderIcon(isOpen)}
                    </div>
                  </button>

                  {/* Resposta - Expansível */}
                  <div
                    id={`faq-answer-${faqId}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <div className="pt-2 border-t border-gray-100">
                        <p style={{ color: '#6B4F43' }}>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Texto de Apoio */}
        <div className="mt-12 text-center">
          <p style={{ color: '#6B4F43' }}>
            Não encontrou sua pergunta?
            <span className="text-[#B89B7A] font-semibold ml-1 cursor-pointer hover:underline">
              Entre em contato conosco
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
