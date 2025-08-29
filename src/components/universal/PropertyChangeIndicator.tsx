/**
 * ✨ PropertyChangeIndicator - Feedback visual para mudanças de propriedades
 * Componente para mostrar indicações visuais quando propriedades são alteradas
 */

import React, { useEffect, useState } from 'react';
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

      {isChanging && (
        <div className="absolute -top-1 -right-1 bg-[#FAF9F7] rounded-full p-1 shadow-sm opacity-100 transition-opacity">
          <Loader2 className="w-3 h-3 text-white animate-spin" />
        </div>
      )}

      {showSaved && !isChanging && (
        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 shadow-lg opacity-100 transition-transform">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

export default PropertyChangeIndicator;
