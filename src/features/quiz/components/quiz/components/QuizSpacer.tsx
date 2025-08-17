interface QuizSpacerProps {
  height?: string;
  backgroundColor?: string;
  className?: string;
}

const QuizSpacer: React.FC<QuizSpacerProps> = ({
  height = '2rem',
  backgroundColor = 'transparent',
  className = '',
}) => {
  const style: React.CSSProperties = {
    height,
    backgroundColor,
    width: '100%',
    display: 'block',
  };

  return <div style={style} className={className} />;
};

export default QuizSpacer;
