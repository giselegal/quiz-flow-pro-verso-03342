import quizStyles from '@/styles/quiz.module.css';

interface QuizSubtitleProps {
  text?: string;
  level?: 2 | 3 | 4 | 5 | 6;
  alignment?: 'left' | 'center' | 'right';
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  className?: string;
}

const QuizSubtitle: React.FC<QuizSubtitleProps> = ({
  text = '',
  level = 2,
  alignment = 'center',
  color = '#6b4f43',
  fontSize,
  fontWeight = 'semibold',
  className = '',
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const style: React.CSSProperties = {
    textAlign: alignment,
    color,
    fontSize: fontSize || '1.5rem',
    fontWeight,
    margin: '0 0 1rem 0',
    lineHeight: 1.3,
  };

  return (
    <Tag className={`${quizStyles.quizSubtitle} ${className}`} style={style}>
      {text}
    </Tag>
  );
};

export default QuizSubtitle;
