
import React from 'react';
import { StyleResult } from '@/types/quiz';

interface QuizResult {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

interface ResultPreviewProps {
  result: QuizResult;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ result }) => {
  const primaryStyle = result.primaryStyle;
  const secondaryStyles = (result.secondaryStyles || []).slice(0, 2);
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-[#FFFAF0] rounded-lg shadow-sm p-6">
      <div className="text-center space-y-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-playfair text-[#432818]">
          Seu Resultado de Estilo Pessoal
        </h1>
        
        <h2 className="text-xl font-medium text-[#432818]">
          Olá, seu Estilo Predominante é:
        </h2>
        
        {primaryStyle && (
          <div className="inline-block bg-[#ffefec] px-6 py-4 rounded-lg">
            <h3 className="text-2xl font-playfair text-[#aa6b5d]">
              {primaryStyle.category?.toUpperCase() || 'ESTILO'}
            </h3>
            <p className="text-[#432818]/80 mt-2">
              {getStyleDescription(primaryStyle.category || '')}
            </p>
          </div>
        )}
      </div>
      
      {secondaryStyles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium text-center mb-4 text-[#432818]">
            Seus Estilos Complementares:
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {secondaryStyles.map((style, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-[#B89B7A]/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#432818]">{style.category}</span>
                  <span className="text-[#B89B7A]">{Math.round(style.percentage || 0)}%</span>
                </div>
                <div className="w-full h-2 bg-[#B89B7A]/20 mt-2 rounded-full">
                  <div 
                    className="h-full bg-[#B89B7A] rounded-full" 
                    style={{ width: `${style.percentage || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
            alt="Guia Completo de Estilo"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744921536/Sem_nome_1080_x_1000_px_z0chuv.webp"
            alt="Gisele Galvão"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <button className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-6 py-3 rounded-md text-lg transition-colors">
          Conhecer o Guia Completo
        </button>
      </div>
    </div>
  );
};

function getStyleDescription(style: string): string {
  const descriptions: Record<string, string> = {
    'Natural': 'Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico.',
    'Clássico': 'Você aprecia a elegância atemporal, com peças de qualidade e caimento perfeito.',
    'Contemporâneo': 'Você busca um equilíbrio entre o clássico e o moderno, com peças práticas e atuais.',
    'Elegante': 'Você tem um olhar refinado para detalhes sofisticados e peças de alta qualidade.',
    'Romântico': 'Você valoriza a delicadeza e os detalhes femininos, com muita suavidade.',
    'Sexy': 'Você gosta de valorizar suas curvas e exibir sua sensualidade com confiança.',
    'Dramático': 'Você tem personalidade forte e gosta de causar impacto com seu visual.',
    'Criativo': 'Você aprecia a originalidade e não tem medo de ousar em combinações únicas.'
  };
  
  return descriptions[style] || 'Você tem um estilo único que combina várias características.';
}

export default ResultPreview;
