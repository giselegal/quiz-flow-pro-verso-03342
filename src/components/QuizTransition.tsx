// @ts-nocheck
import { motion } from 'framer-motion';
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
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-8"
      >
        <CheckCircle className="w-24 h-24 text-green-500" />
      </motion.div>

      <h2 className="text-2xl font-bold mb-4 text-center">Quiz Concluído!</h2>

      <p style={{ color: '#6B4F43' }}>Aguarde enquanto preparamos seus resultados...</p>

      <div className="flex space-x-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-[#B89B7A]/100 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default QuizTransition;
