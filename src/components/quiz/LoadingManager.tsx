import { LoadingState } from '../ui/loading-state';

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

  // When loaded, render content with a simple CSS fade-in
  return <div className="opacity-100 transition-opacity duration-300 ease-in-out">{children}</div>;
};

export default LoadingManager;
