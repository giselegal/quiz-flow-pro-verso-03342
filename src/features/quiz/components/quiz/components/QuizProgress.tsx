import quizStyles from '@/styles/quiz.module.css';

interface QuizProgressProps {
  value?: number;
  max?: number;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  height?: string;
  className?: string;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  value = 50,
  max = 100,
  showPercentage = true,
  color = '#b89b7a',
  backgroundColor = '#e5e7eb',
  height = '8px',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const containerStyle: React.CSSProperties = {
    margin: '1rem 0',
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height,
    backgroundColor,
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
  };

  const progressFillStyle: React.CSSProperties = {
    width: `${percentage}%`,
    height: '100%',
    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  };

  return (
    <div style={containerStyle} className={`${quizStyles.quizProgress} ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: '#6B4F43' }}>Progresso</span>
          <span className="text-sm font-bold" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div style={progressBarStyle}>
        <div style={progressFillStyle} />
      </div>
    </div>
  );
};

export default QuizProgress;
