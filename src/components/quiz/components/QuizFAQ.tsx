import React, { useState } from 'react';
import { ComponentProps } from '@/interfaces/quiz';
import styles from '@/styles/quiz.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface QuizFAQProps extends ComponentProps {
  title?: string;
  items?: FAQItem[];
}

const QuizFAQ: React.FC<QuizFAQProps> = ({
  title = 'Perguntas Frequentes',
  items = [
    {
      question: 'Como funciona o produto?',
      answer: 'O produto funciona de forma simples e intuitiva...',
    },
    {
      question: 'Qual a garantia?',
      answer: 'Oferecemos 30 dias de garantia incondicional.',
    },
  ],
  isSelected,
  onClick,
}) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const toggleItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenItems(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
  };

  return (
    <div
      className={`${styles.quizComponent} ${styles.faq} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.faqCard}>
        <h3 className={styles.faqTitle}>❓ {title}</h3>

        <div className={styles.faqList}>
          {items.map((item, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${openItems.includes(index) ? styles.open : ''}`}
                onClick={e => toggleItem(index, e)}
              >
                <span>{item.question}</span>
                <span className={styles.faqToggle}>{openItems.includes(index) ? '−' : '+'}</span>
              </button>

              {openItems.includes(index) && (
                <div className={styles.faqAnswer}>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizFAQ;
