// @ts-nocheck
import { CheckCircle } from 'lucide-react';
import QuizQuestion from './QuizQuestion';

interface QuizTransitionProps {
  isCompleting: boolean;
  onComplete: () => void;
}

const QuizTransition: React.FC<QuizTransitionProps> = ({ isCompleting, onComplete }) => {
  React.useEffect(() => {
    if (isCompleting) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCompleting, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="mb-8">
        <CheckCircle className="w-24 h-24 text-green-500" />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">Quiz Concluído!</h2>

      <p style={{ color: '#6B4F43' }}>Aguarde enquanto preparamos seus resultados...</p>

      <div className="flex space-x-2 mt-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-3 h-3 bg-[#B89B7A]/100 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default QuizTransition;
