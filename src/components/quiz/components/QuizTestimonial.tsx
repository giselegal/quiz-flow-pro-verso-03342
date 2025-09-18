import { ComponentProps } from '@/interfaces/quiz';
import styles from '@/styles/quiz.module.css';

interface QuizTestimonialProps extends ComponentProps {
  text?: string;
  author?: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

const QuizTestimonial: React.FC<QuizTestimonialProps> = ({
  text = 'Este produto mudou minha vida! Recomendo para todos.',
  author = 'Maria Silva',
  role = 'Cliente satisfeita',
  avatar = 'https://via.placeholder.com/64x64',
  rating = 5,
  isSelected,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? styles.starFilled : styles.starEmpty}>
        ⭐
      </span>
    ));
  };

  return (
    <div
      className={`${styles.quizComponent} ${styles.testimonial} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.testimonialCard}>
        <div className={styles.testimonialRating}>{renderStars(rating)}</div>

        <blockquote className={styles.testimonialText}>"{text}"</blockquote>

        <div className={styles.testimonialAuthor}>
          <img
            src={avatar}
            alt={author}
            className={styles.testimonialAvatar}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=👤';
            }}
          />
          <div className={styles.testimonialInfo}>
            <cite className={styles.testimonialName}>{author}</cite>
            <p className={styles.testimonialRole}>{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTestimonial;
