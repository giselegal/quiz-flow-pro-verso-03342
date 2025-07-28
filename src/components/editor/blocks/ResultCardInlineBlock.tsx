import React from 'react';
import { Block } from '../../../types/editor';

interface ResultCardInlineBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
}

const ResultCardInlineBlock: React.FC<ResultCardInlineBlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false
}) => {
  const properties = block.properties || {};
  
  const title = properties.title || 'Seu Estilo Predominante';
  const styleName = properties.styleName || 'Clássico';
  const percentage = properties.percentage || 85;
  const description = properties.description || 'Baseado nas suas respostas, identificamos características do estilo...';
  const imageUrl = properties.imageUrl || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp';
  const showMatch = properties.showMatch !== undefined ? properties.showMatch : true;

  return (
    <div 
      className={`p-6 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-2xl mx-auto">
        
        {/* Header do card */}
        <div className="bg-gradient-to-r from-[#B89B7A] to-[#A08A6C] text-white text-center py-6 px-4">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          {showMatch && (
            <div className="flex items-center justify-center space-x-2">
              <div className="text-4xl font-bold">{percentage}%</div>
              <div className="text-lg">de compatibilidade</div>
            </div>
          )}
        </div>

        {/* Conteúdo do card */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            
            {/* Imagem do estilo */}
            <div className="flex-shrink-0">
              <img 
                src={imageUrl}
                alt={`Estilo ${styleName}`}
                className="w-48 h-64 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Informações do estilo */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold text-[#432818] mb-4">
                Estilo {styleName}
              </h3>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {description}
              </p>

              {/* Badge de resultado */}
              <div className="inline-flex items-center px-4 py-2 bg-[#B89B7A]/10 rounded-full">
                <span className="text-[#B89B7A] font-semibold">
                  ✨ Resultado personalizado para você
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info para o editor */}
      {!isPreview && (
        <div className="mt-4 text-xs text-gray-500 border-t pt-2">
          <p>✓ Card do resultado principal</p>
          <p>✓ Estilo: {styleName} ({percentage}%)</p>
          <p>✓ Imagem: {imageUrl ? 'Configurada' : 'Padrão'}</p>
        </div>
      )}
    </div>
  );
};

export default ResultCardInlineBlock;
