import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface QuizFinalTransitionProps {
  onShowResult?: () => void;
}

const QuizFinalTransition: React.FC<QuizFinalTransitionProps> = ({ onShowResult }) => {
  return (
    <div className="fixed inset-0 bg-[#fffaf7] z-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-playfair text-[#432818] text-center font-bold">
          Obrigada por compartilhar.
        </h2>
        <p className="text-[#3a3a3a]">
          Chegar até aqui já mostra que você está pronta para se olhar com mais <strong>amor</strong>, se vestir com mais <strong>intenção</strong> e deixar sua imagem comunicar quem você é de verdade — com <strong>leveza</strong>, <strong>presença</strong> e <strong>propósito</strong>.
        </p>
        <p className="text-[#3a3a3a]">
          Agora, é hora de revelar o seu <strong>Estilo Predominante</strong> — e os seus <strong>Estilos Complementares</strong>. E, mais do que isso, uma oportunidade real de aplicar o seu Estilo com <strong>leveza</strong> e <strong>confiança</strong> — todos os dias.
        </p>
        <p className="text-[#3a3a3a]">
          Ah, e lembra do valor que mencionamos? Prepare-se para uma <strong>surpresa</strong>: o que você vai receber vale muito mais do que imagina — e vai custar muito menos do que você esperava.
        </p>
        <div className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            onClick={onShowResult}
            className="bg-[#B89B7A] text-white hover:bg-[#a08968] transition-colors"
          >
            Vamos ao resultado?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizFinalTransition;
