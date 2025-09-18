import { ComponentProps } from '@/interfaces/quiz';
import styles from '@/styles/quiz.module.css';

interface QuizSocialProofProps extends ComponentProps {
  customerCount?: string;
  rating?: string;
  reviewCount?: string;
  text?: string;
}

const QuizSocialProof: React.FC<QuizSocialProofProps> = ({
  customerCount = '5.000',
  rating = '4.9',
  reviewCount = '1.247',
  text = 'Mais de {customerCount} clientes satisfeitos',
  isSelected,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const formattedText = text.replace('{customerCount}', customerCount);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className={styles.starsContainer}>
        {Array.from({ length: fullStars }, (_, index) => (
          <span key={index} className={styles.starFull}>
            ⭐
          </span>
        ))}
        {hasHalfStar && <span className={styles.starHalf}>⭐</span>}
        {Array.from({ length: 5 - Math.ceil(rating) }, (_, index) => (
          <span key={index + fullStars} className={styles.starEmpty}>
            ☆
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`${styles.quizComponent} ${styles.socialProof} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.socialProofCard}>
        <div className={styles.socialProofHeader}>
          <h3 className={styles.socialProofTitle}>👥 Prova Social</h3>
        </div>

        <div className={styles.socialProofStats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{customerCount}+</div>
            <div className={styles.statLabel}>Clientes</div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statNumber}>{rating}</div>
            <div className={styles.statLabel}>Avaliação</div>
            {renderStars(parseFloat(rating))}
          </div>

          <div className={styles.statItem}>
            <div className={styles.statNumber}>{reviewCount}</div>
            <div className={styles.statLabel}>Avaliações</div>
          </div>
        </div>

        <div className={styles.socialProofText}>
          <p>{formattedText}</p>
        </div>

        <div className={styles.socialProofBadges}>
          <div className={styles.badge}>✅ Produto Verificado</div>
          <div className={styles.badge}>⭐ Mais Vendido</div>
          <div className={styles.badge}>🔒 Compra Segura</div>
        </div>
      </div>
    </div>
  );
};

export default QuizSocialProof;
