import { ComponentProps } from '@/interfaces/quiz';
import styles from '@/styles/quiz.module.css';

interface BonusItem {
  name: string;
  value: string;
}

interface QuizBonusProps extends ComponentProps {
  title?: string;
  items?: BonusItem[];
}

const QuizBonus: React.FC<QuizBonusProps> = ({
  title = 'Bônus Exclusivos',
  items = [
    { name: 'E-book Gratuito', value: 'R$ 47' },
    { name: 'Consultoria Grátis', value: 'R$ 197' },
    { name: 'Acesso VIP', value: 'R$ 97' },
  ],
  isSelected,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const getTotalValue = () => {
    return items.reduce((total, item) => {
      const value = parseFloat(item.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      return total + value;
    }, 0);
  };

  return (
    <div
      className={`${styles.quizComponent} ${styles.bonus} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.bonusCard}>
        <div className={styles.bonusHeader}>
          <h3 className={styles.bonusTitle}>🎁 {title}</h3>
          <div className={styles.bonusSubtitle}>Você ganha GRÁTIS ao adquirir hoje:</div>
        </div>

        <div className={styles.bonusList}>
          {items.map((item, index) => (
            <div key={index} className={styles.bonusItem}>
              <div className={styles.bonusCheck}>✅</div>
              <div className={styles.bonusContent}>
                <span className={styles.bonusName}>{item.name}</span>
                <span className={styles.bonusValue}>Valor: {item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bonusTotal}>
          <div className={styles.totalLabel}>Valor total dos bônus:</div>
          <div className={styles.totalValue}>R$ {getTotalValue().toFixed(0)}</div>
          <div className={styles.totalText}>GRÁTIS para você!</div>
        </div>
      </div>
    </div>
  );
};

export default QuizBonus;
