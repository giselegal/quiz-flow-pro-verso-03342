import { ComponentProps } from '@/interfaces/quiz';
import styles from '@/styles/quiz.module.css';

interface QuizPhoneProps extends ComponentProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  width?: string;
}

const QuizPhone: React.FC<QuizPhoneProps> = ({
  label = 'Seu telefone',
  placeholder = '(11) 99999-9999',
  required = false,
  width = '100%',
  isSelected,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`${styles.quizComponent} ${styles.inputField} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      style={{ width }}
    >
      <div className={styles.inputContainer}>
        <label className={styles.inputLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>

        <div className={styles.inputWrapper}>
          <span className={styles.inputIcon}>📱</span>
          <input
            type="tel"
            placeholder={placeholder}
            className={styles.inputControl}
            onClick={handleInputClick}
            readOnly
          />
        </div>

        {!required && <div className={styles.inputHint}>Campo opcional</div>}
      </div>
    </div>
  );
};

export default QuizPhone;
