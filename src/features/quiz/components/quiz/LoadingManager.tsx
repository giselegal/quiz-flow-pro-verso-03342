import { LoadingState } from '../ui/loading-state';
import { motion } from 'framer-motion';

interface LoadingManagerProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

const LoadingManager: React.FC<LoadingManagerProps> = ({
  isLoading,
  children,
  message = 'Carregando o quiz...',
}) => {
  // If loading, show loading state
  if (isLoading) {
    return <LoadingState message={message} />;
  }

  // When loaded, use framer-motion to smoothly fade in content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

export default LoadingManager;
