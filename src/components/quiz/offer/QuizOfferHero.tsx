import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';
import { getCtaUrl } from '@/services/pixelManager';

interface QuizOfferHeroProps {
  onStartQuizClick: () => void;
}

export const QuizOfferHero: React.FC<QuizOfferHeroProps> = ({ onStartQuizClick }) => {
  const handleCtaClick = () => {
    trackButtonClick('hero-cta', 'Comprar Quiz', 'hero');
    window.location.href = getCtaUrl();
  };

  const handleStartQuizClick = () => {
    trackButtonClick('hero-start-quiz', 'Começar Quiz', 'hero');
    onStartQuizClick();
  };

  return (
    <div className="bg-[#F9F7F4] py-8 px-4 md:py-16 md:px-8 rounded-lg">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-[#432818] mb-4">
          Descubra Seu Estilo Pessoal e Transforme Seu Guarda-Roupa
        </h1>

        <p className="text-lg md:text-xl text-[#432818]/80 mb-6 max-w-3xl mx-auto">
          Um teste exclusivo que revela seu estilo autêntico e como expressar sua verdadeira
          essência através das roupas que você escolhe.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <Button
            onClick={handleStartQuizClick}
            className="text-white py-3 px-6 rounded-md bg-[#aa6b5d] hover:bg-[#8f574a] text-base md:text-lg w-full md:w-auto"
          >
            Começar o Quiz Gratuito
          </Button>

          <Button
            onClick={handleCtaClick}
            className="text-white py-3 px-6 rounded-md btn-cta-green text-base md:text-lg w-full md:w-auto"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Adquirir Guia Completo
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EAE4DA]">
            <h3 className="font-medium text-[#432818]">7+ Estilos</h3>
            <p className="text-sm text-[#432818]/70">Identificados com precisão</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EAE4DA]">
            <h3 className="font-medium text-[#432818]">15+ Questões</h3>
            <p className="text-sm text-[#432818]/70">Para análise completa</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EAE4DA]">
            <h3 className="font-medium text-[#432818]">100% Online</h3>
            <p className="text-sm text-[#432818]/70">Acesso imediato</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EAE4DA]">
            <h3 className="font-medium text-[#432818]">Bônus Exclusivos</h3>
            <p className="text-sm text-[#432818]/70">Para transformar seu estilo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizOfferHero;
