import { ComponentProps } from '@/interfaces/quiz';
import styles from '@/styles/quiz.module.css';

interface QuizGuaranteeProps extends ComponentProps {
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
}

const QuizGuarantee: React.FC<QuizGuaranteeProps> = ({
  title = 'Garantia de 30 dias',
  description = 'Se não ficar satisfeito, devolvemos 100% do seu dinheiro.',
  icon = 'shield',
  color = '#059669',
  isSelected,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'shield':
        return '🛡️';
      case 'star':
        return '⭐';
      case 'check':
        return '✅';
      case 'heart':
        return '❤️';
      default:
        return '🛡️';
    }
  };

  return (
    <div
      className={`${styles.quizComponent} ${styles.guarantee} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.guaranteeCard}>
        <div className={styles.guaranteeIcon} style={{ color }}>
          <span className={styles.iconEmoji}>{getIcon(icon)}</span>
        </div>

        <div className={styles.guaranteeContent}>
          <h3 className={styles.guaranteeTitle} style={{ color }}>
            {title}
          </h3>
          <p className={styles.guaranteeDescription}>{description}</p>
        </div>

        <div className={styles.guaranteeBadge}>
          <span className={styles.badgeText}>100% SEGURO</span>
        </div>
      </div>
    </div>
  );
};

export default QuizGuarantee;
