import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const AccessibilityTip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-[#F9F3EE] text-[#8F7A6A] p-3 rounded-lg text-xs flex items-start gap-2 shadow-sm mt-6 max-w-md mx-auto"
        >
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
        </motion.div>
      )}
    </>
  );
};

export default AccessibilityTip;
