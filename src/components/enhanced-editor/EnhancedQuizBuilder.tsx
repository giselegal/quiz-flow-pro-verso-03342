import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

/**
 * EnhancedQuizBuilder é um wrapper para o componente QuizBuilder
 * que direciona o usuário para o editor unificado
 */
const EnhancedQuizBuilder: React.FC = () => {
  const [, setLocation] = useLocation();

  const handleOpenUnifiedEditor = () => {
    setLocation('/editor');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FAF9F7]">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-playfair text-[#432818] mb-4">Editor de Quiz</h1>
        <p className="text-[#8F7A6A] mb-6">
          Utilize nosso editor unificado para criar e editar o quiz, a página de resultado e a
          página de vendas em um só lugar.
        </p>
        <Button
          className="bg-[#B89B7A] hover:bg-[#A38A69] text-white"
          onClick={handleOpenUnifiedEditor}
        >
          Abrir Editor Unificado
        </Button>
      </div>
    </div>
  );
};

export default EnhancedQuizBuilder;
