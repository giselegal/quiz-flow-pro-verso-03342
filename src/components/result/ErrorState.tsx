import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

const ErrorState: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#fff9f7]">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-playfair text-[#432818] mb-4">Oops, algo deu errado</h1>
        <p className="text-[#432818] mb-6">
          Não conseguimos carregar seu resultado do quiz. Por favor, tente novamente.
        </p>
        <Button
          onClick={() => setLocation('/quiz')}
          className="bg-[#aa6b5d] hover:bg-[#9a5b4d] text-white"
        >
          Refazer o Quiz
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
