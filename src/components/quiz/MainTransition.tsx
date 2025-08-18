import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface MainTransitionProps {
  onProceedToStrategicQuestions: () => void;
}

export const MainTransition: React.FC<MainTransitionProps> = ({
  onProceedToStrategicQuestions,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF9F7] px-4 py-10 flex items-start justify-center">
      <div className="max-w-3xl w-full mx-auto">
        <Card className="p-8 space-y-8 bg-white shadow-lg border-[#B89B7A]/20 mb-10">
          <h2 className="text-2xl font-playfair text-[#432818] text-center tracking-normal font-bold mt-4">
            Enquanto calculamos o seu resultado...
          </h2>

          <p className="text-[#1A1818]/90 text-lg">
            Queremos te fazer algumas perguntas que vão tornar sua{' '}
            <strong className="text-[#432818]">experiência</strong> ainda mais{' '}
            <strong className="text-[#432818]">completa</strong>.
          </p>

          <p className="text-[#1A1818]/90 text-lg">
            A ideia é simples: te ajudar a enxergar com mais{' '}
            <strong className="text-[#432818]">clareza</strong> onde você está agora — e para onde
            pode ir com mais <strong className="text-[#432818]">intenção</strong>,{' '}
            <strong className="text-[#432818]">leveza</strong> e{' '}
            <strong className="text-[#432818]">autenticidade</strong>.
          </p>

          <div className="bg-gradient-to-r from-[#B89B7A]/10 to-[#432818]/10 p-6 rounded-lg border border-[#B89B7A]/20">
            <p className="text-[#432818] italic text-center font-medium text-lg">
              Responda com <strong className="text-[#432818] not-italic">sinceridade</strong>. Isso
              é só entre você e a sua{' '}
              <strong className="text-[#432818] not-italic">nova versão</strong>.
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              variant="default"
              size="lg"
              onClick={onProceedToStrategicQuestions}
              className="bg-[#B89B7A] text-white hover:bg-[#a0845c] focus:ring-2 focus:ring-[#B89B7A]"
            >
              Continuar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
