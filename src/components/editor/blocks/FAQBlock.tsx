// @ts-nocheck
import React, { useState } from 'react';
import { InlineEditableText } from './InlineEditableText';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  MessageSquare,
  CheckCircle,
  Info,
} from 'lucide-react';
import type { BlockComponentProps, FAQBlock, FAQItem } from '@/types/blocks';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FAQBlockProps extends BlockComponentProps {
  block: FAQBlock;
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

const FAQBlock: React.FC<FAQBlockProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Perguntas Frequentes',
    subtitle = 'Tire suas dúvidas sobre nosso produto',
    faqs = [
      {
        id: 'faq-1',
        question: 'Como funciona o processo de análise de estilo?',
        answer:
          'Nossa análise é baseada em suas respostas ao quiz e leva em consideração suas preferências pessoais, biotipo, estilo de vida e objetivos. O resultado é um guia personalizado com recomendações específicas para você.',
        category: 'Processo',
        isHighlight: true,
        tags: ['análise', 'personalização'],
      },
      {
        id: 'faq-2',
        question: 'Quanto tempo demora para receber o resultado?',
        answer:
          'Você recebe seu resultado imediatamente após completar o quiz. O material complementar é enviado por email em até 24 horas.',
        category: 'Prazo',
        isHighlight: false,
        tags: ['prazo', 'entrega'],
      },
      {
        id: 'faq-3',
        question: 'Posso usar o método em qualquer idade?',
        answer:
          'Sim! Nosso método é adaptável para mulheres de todas as idades, desde jovens adultas até mulheres maduras. O importante é descobrir seu estilo autêntico.',
        category: 'Aplicação',
        isHighlight: false,
        tags: ['idade', 'aplicação'],
      },
      {
        id: 'faq-4',
        question: 'Há garantia de satisfação?',
        answer:
          'Oferecemos 30 dias de garantia incondicional. Se não ficar satisfeita com o resultado, devolvemos 100% do seu investimento.',
        category: 'Garantia',
        isHighlight: true,
        tags: ['garantia', 'satisfação'],
      },
    ],
    layout = 'accordion',
    showSearch = true,
    showCategories = true,
    allowMultipleOpen = false,
    animateEntrance = true,
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#B89B7A',
    cardStyle = 'modern',
    searchPlaceholder = 'Buscar perguntas...',
  } = block?.properties || {};

  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const toggleItem = (itemId: string) => {
    if (isEditing) return;

    const newOpenItems = new Set(openItems);

    if (allowMultipleOpen) {
      if (newOpenItems.has(itemId)) {
        newOpenItems.delete(itemId);
      } else {
        newOpenItems.add(itemId);
      }
    } else {
      if (newOpenItems.has(itemId)) {
        newOpenItems.clear();
      } else {
        newOpenItems.clear();
        newOpenItems.add(itemId);
      }
    }

    setOpenItems(newOpenItems);
  };

  const getCardStyleClasses = (isHighlight: boolean = false) => {
    const baseClasses = 'transition-all duration-300 cursor-pointer';

    let styleClasses = '';
    switch (cardStyle) {
      case 'classic':
        styleClasses = 'bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md';
        break;
      case 'flat':
        styleClasses = 'bg-transparent border-b border-gray-200 rounded-none hover:bg-gray-50';
        break;
      case 'modern':
      default:
        styleClasses =
          'bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg hover:border-[#B89B7A]/30';
        break;
    }

    if (isHighlight) {
      styleClasses += ' border-[#B89B7A]/40 bg-[#FAF9F7]';
    }

    return `${baseClasses} ${styleClasses}`;
  };

  // Filter FAQs based on search and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch =
      searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)));

  const renderFAQItem = (faq: FAQItem, index: number) => {
    const isOpen = openItems.has(faq.id);

    return (
      <motion.div
        key={faq.id}
        initial={animateEntrance ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="w-full"
      >
        <Card className={getCardStyleClasses(faq.isHighlight)}>
          <CardContent className="p-0">
            <div className="p-4 md:p-6" onClick={() => toggleItem(faq.id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    {faq.isHighlight && (
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle className="w-5 h-5 text-[#B89B7A]" />
                      </div>
                    )}
                    <h3
                      className={cn(
                        'font-semibold text-lg leading-relaxed',
                        faq.isHighlight ? 'text-[#B89B7A]' : 'text-gray-800',
                        // Margens universais com controles deslizantes
                        getMarginClass(marginTop, 'top'),
                        getMarginClass(marginBottom, 'bottom'),
                        getMarginClass(marginLeft, 'left'),
                        getMarginClass(marginRight, 'right')
                      )}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  {faq.category && showCategories && (
                    <Badge variant="secondary" style={{ color: '#6B4F43' }}>
                      {faq.category}
                    </Badge>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p style={{ color: '#6B4F43' }}>{faq.answer}</p>

                      {faq.tags && faq.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {faq.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="text-xs border-[#B89B7A]/30 text-[#B89B7A]"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div
        className={cn(
          'bg-gray-100 p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-all duration-200',
          isSelected && 'ring-1 ring-gray-400/40 bg-gray-50/30',
          !isSelected && 'hover:shadow-sm',
          className
        )}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <HelpCircle className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-center">Configure as perguntas frequentes no painel de propriedades.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'py-8 px-4 cursor-pointer transition-all duration-200 w-full',
        isSelected && 'ring-1 ring-gray-400/40 bg-gray-50/30',
        !isSelected && 'hover:shadow-sm',
        className
      )}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
      style={{ backgroundColor, color: textColor }}
    >
      {/* Header */}
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <InlineEditableText
              value={title}
              onChange={(value: string) => handlePropertyChange('title', value)}
              className="inline-block"
              placeholder="Título do FAQ"
            />
          </h2>
          {subtitle && (
            <p style={{ color: '#6B4F43' }}>
              <InlineEditableText
                value={subtitle}
                onChange={(value: string) => handlePropertyChange('subtitle', value)}
                className="inline-block"
                placeholder="Subtítulo do FAQ"
              />
            </p>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ borderColor: '#E5DDD5' }}
                onClick={e => e.stopPropagation()}
              />
            </div>
          )}

          {/* Categories */}
          {showCategories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  selectedCategory === 'all'
                    ? 'bg-[#B89B7A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedCategory('all');
                }}
              >
                Todas
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    selectedCategory === category
                      ? 'bg-[#B89B7A] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedCategory(category || 'all');
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => renderFAQItem(faq, index))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p style={{ color: '#8B7355' }}>Nenhuma pergunta encontrada para "{searchTerm}"</p>
            <button
              className="mt-4 text-[#B89B7A] hover:underline"
              onClick={e => {
                e.stopPropagation();
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <div style={{ color: '#8B7355' }}>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{filteredFAQs.length} pergunta(s)</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            <span>{openItems.size} aberta(s)</span>
          </div>
        </div>
      </div>

      {/* Editor Info */}
      {isEditing && (
        <div className="mt-8 p-4 bg-[#FAF9F7] border border-[#B89B7A]/20 rounded-md">
          <p className="text-sm text-[#8F7A6A]">
            Modo de edição: {faqs.length} FAQ(s) • Layout: {layout} • Filtros:{' '}
            {searchTerm || 'nenhum'} • Categoria: {selectedCategory}
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQBlock;
