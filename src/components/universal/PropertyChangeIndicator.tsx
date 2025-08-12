/**
 * ✨ PropertyChangeIndicator - Feedback visual para mudanças de propriedades
 * Componente para mostrar indicações visuais quando propriedades são alteradas
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface PropertyChangeIndicatorProps {
  isChanging?: boolean;
  hasChanged?: boolean;
  children: React.ReactNode;
}

export const PropertyChangeIndicator: React.FC<PropertyChangeIndicatorProps> = ({
  isChanging = false,
  hasChanged = false,
  children,
}) => {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (hasChanged && !isChanging) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasChanged, isChanging]);

  return (
    <div className="relative">
      {children}

      <AnimatePresence>
        {isChanging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ backgroundColor: '#FAF9F7' }}
          >
            <Loader2 className="w-3 h-3 text-white animate-spin" />
          </motion.div>
        )}

        {showSaved && !isChanging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 shadow-lg"
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyChangeIndicator;
