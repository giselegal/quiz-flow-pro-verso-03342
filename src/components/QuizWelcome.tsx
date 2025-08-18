import { useLoadingState } from '@/hooks/useLoadingState';

interface QuizWelcomeProps {
  onStart: () => void;
}

const QuizWelcome: React.FC<QuizWelcomeProps> = ({ onStart }) => {
  const { isLoading, setLoading } = useLoadingState({ initialState: false });

  const handleStart = () => {
    setLoading(true);
    // Simulate some loading before starting
    setTimeout(() => {
      setLoading(false);
      onStart();
    }, 1000);
  };

  return (
    <div className="quiz-welcome p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Quiz de Estilo</h1>
      <p className="text-lg mb-8">Descubra seu estilo pessoal em alguns minutos</p>

      <button
        onClick={handleStart}
        disabled={isLoading}
        className="px-8 py-3 bg-[#B89B7A]/100 text-white rounded-lg hover:bg-[#B89B7A] disabled:opacity-50"
      >
        {isLoading ? 'Carregando...' : 'Começar Quiz'}
      </button>
    </div>
  );
};

export default QuizWelcome;
