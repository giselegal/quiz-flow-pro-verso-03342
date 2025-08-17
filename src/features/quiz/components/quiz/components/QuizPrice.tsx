import { ComponentProps } from '@/interfaces/quiz';
import styles from '@/styles/quiz.module.css';

interface QuizPriceProps extends ComponentProps {
  price?: string;
  originalPrice?: string;
  currency?: string;
  installments?: string;
  discount?: string;
  alignment?: 'left' | 'center' | 'right';
}

const QuizPrice: React.FC<QuizPriceProps> = ({
  price = '97',
  originalPrice = '197',
  currency = 'R$',
  installments = '12x de R$ 9,70',
  discount = '50% OFF',
  alignment = 'center',
  isSelected,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <div
      className={`${styles.quizComponent} ${styles.priceComponent} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      style={{ textAlign: alignment }}
    >
      <div className={styles.priceCard}>
        {discount && <div className={styles.discountBadge}>{discount}</div>}

        <div className={styles.priceContainer}>
          {originalPrice && (
            <div className={styles.originalPrice}>
              De:{' '}
              <span className={styles.strikethrough}>
                {currency} {originalPrice}
              </span>
            </div>
          )}

          <div className={styles.currentPrice}>
            Por apenas:{' '}
            <span className={styles.priceValue}>
              {currency} {price}
            </span>
          </div>

          {installments && <div className={styles.installments}>ou {installments}</div>}
        </div>

        <div className={styles.priceFeatures}>
          <div className={styles.feature}>✅ Acesso imediato</div>
          <div className={styles.feature}>✅ Garantia de 30 dias</div>
          <div className={styles.feature}>✅ Suporte especializado</div>
        </div>
      </div>
    </div>
  );
};

export default QuizPrice;
