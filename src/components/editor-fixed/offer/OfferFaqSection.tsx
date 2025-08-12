import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface OfferFaqSectionProps {
  title: string;
  questions: FaqItem[];
}

/**
 * 🎯 COMPONENTE: OfferFaqSection
 *
 * Seção de FAQ com acordeão interativo
 * Permite expandir/recolher perguntas individualmente
 */
export const OfferFaqSection: React.FC<OfferFaqSectionProps> = ({ title, questions }) => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="section-gap">
      <div className="container-main">
        <div className="card-clean">
          <h2
            className="text-hierarchy-2 text-[var(--text-dark)] text-center mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {title}
          </h2>

          <div className="w-full max-w-3xl mx-auto">
            <div className="space-y-4">
              {questions.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-[#B89B7A]"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    style={{ backgroundColor: openItem === index ? '#FAF9F7' : 'white' }}
                  >
                    <span className="font-medium text-[#432818] text-lg pr-4">{item.question}</span>
                    <ChevronRight
                      size={24}
                      className={`text-[#B89B7A] transition-transform duration-300 flex-shrink-0 ${
                        openItem === index ? 'transform rotate-90' : ''
                      }`}
                    />
                  </button>

                  {openItem === index && (
                    <div className="px-6 pb-4">
                      <div className="text-base leading-relaxed" style={{ color: '#6B4F43' }}>
                        {item.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferFaqSection;
