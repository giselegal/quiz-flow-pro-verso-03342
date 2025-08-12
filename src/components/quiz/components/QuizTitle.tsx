import quizStyles from '@/styles/quiz.module.css';

interface QuizTitleProps {
  text?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  alignment?: 'left' | 'center' | 'right';
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  className?: string;
}

const QuizTitle: React.FC<QuizTitleProps> = ({
  text = '',
  level = 1,
  alignment = 'center',
  color = '#432818',
  fontSize,
  fontWeight,
  className = '',
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const style: React.CSSProperties = {
    textAlign: alignment,
    color,
    fontSize: fontSize || (level === 1 ? '2rem' : level === 2 ? '1.5rem' : '1.25rem'),
    fontWeight: fontWeight || 'bold',
    margin: '0 0 1rem 0',
    lineHeight: 1.2,
  };

  return (
    <Tag className={`${quizStyles.quizTitle} ${className}`} style={style}>
      {text}
    </Tag>
  );
};

export default QuizTitle;
