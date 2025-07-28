
import React from 'react';
import { Button } from '@/components/ui/button';

const QuizPreview: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#432818] mb-6">Pré-visualização do Quiz</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#B89B7A]/20 p-6">
          <h2 className="text-xl font-semibold text-[#432818] mb-4">
            Descubra Seu Estilo Pessoal
          </h2>
          
          <div className="mb-6">
            <div className="w-full bg-[#B89B7A]/20 rounded-full h-2 mb-4">
              <div className="bg-[#B89B7A] h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <p className="text-sm text-[#8F7A6A] text-center">Pergunta 1 de 4</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#432818] mb-4">
              Qual dessas cores mais representa você?
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {['Azul sereno', 'Vermelho vibrante', 'Verde natural', 'Dourado elegante'].map((option, index) => (
                <button
                  key={index}
                  className="p-3 text-left border border-[#B89B7A]/30 rounded-lg hover:bg-[#B89B7A]/10 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline">Anterior</Button>
            <Button>Próxima</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;
