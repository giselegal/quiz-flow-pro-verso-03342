import quizStyles from '@/styles/quiz.module.css';

interface QuizParagraphProps {
  text?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  fontSize?: string;
  lineHeight?: string | number;
  className?: string;
}

const QuizParagraph: React.FC<QuizParagraphProps> = ({
  text = '',
  alignment = 'left',
  color = '#432818',
  fontSize = '1rem',
  lineHeight = 1.6,
  className = '',
}) => {
  const style: React.CSSProperties = {
    textAlign: alignment,
    color,
    fontSize,
    lineHeight,
    margin: '0 0 1rem 0',
  };

  return (
    <p
      className={`${quizStyles.quizDescription} ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default QuizParagraph;
