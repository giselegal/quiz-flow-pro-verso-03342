import React, { useState } from 'react';
import { Info } from 'lucide-react';

const AccessibilityTip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {isVisible && (
        <div className="bg-[#F9F3EE] text-[#8F7A6A] p-3 rounded-lg text-xs flex items-start gap-2 shadow-sm mt-6 max-w-md mx-auto transition-all">
          <Info className="h-4 w-4 text-[#B89B7A] mt-0.5 flex-shrink-0" />
          <div>
            <p className="mb-1">
              <strong>Dica:</strong> Este quiz foi projetado para ser acessível. Use Tab para
              navegar e Espaço para selecionar opções.
            </p>
            <button
              onClick={() => setIsVisible(false)}
              className="text-[#B89B7A] hover:text-[#A1835D] underline text-xs"
            >
              Entendi, não mostrar novamente
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityTip;
