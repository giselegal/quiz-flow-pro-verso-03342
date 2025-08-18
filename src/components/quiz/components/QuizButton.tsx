// @ts-nocheck
import quizStyles from '@/styles/quiz.module.css';

interface QuizButtonProps {
  text?: string;
  type?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  width?: string | number;
  alignment?: 'left' | 'center' | 'right';
  action?: 'next' | 'previous' | 'submit' | 'link';
  backgroundColor?: string;
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const QuizButton: React.FC<QuizButtonProps> = ({
  text = '',
  type = 'primary',
  size = 'medium',
  width = 'auto',
  alignment = 'center',
  action = 'next',
  backgroundColor = '#b89b7a',
  color = '#ffffff',
  onClick,
  disabled = false,
  className = '',
}) => {
  const containerStyle: React.CSSProperties = {
    textAlign: alignment,
    margin: '1rem 0',
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { padding: '0.5rem 1rem', fontSize: '0.875rem' };
      case 'large':
        return { padding: '1rem 2.5rem', fontSize: '1.125rem' };
      default:
        return { padding: '0.875rem 2rem', fontSize: '1rem' };
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: backgroundColor,
          border: `2px solid ${backgroundColor}`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: backgroundColor,
          border: `1px solid ${backgroundColor}`,
        };
      default:
        return {
          backgroundColor,
          color,
          border: 'none',
        };
    }
  };

  const buttonStyle: React.CSSProperties = {
    ...getSizeStyles(),
    ...getTypeStyles(),
    width: typeof width === 'number' ? `${width}px` : width,
    borderRadius: '12px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    textTransform: 'none',
    letterSpacing: '0',
  };

  const handleClick = () => {
    if (disabled || !onClick) return;
    onClick();
  };

  return (
    <div style={containerStyle} className={className}>
      <button
        className={quizStyles.quizButton}
        style={buttonStyle}
        onClick={handleClick}
        disabled={disabled}
        type="button"
      >
        {text}
      </button>
    </div>
  );
};

export default QuizButton;
