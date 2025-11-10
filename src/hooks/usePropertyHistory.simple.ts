import { useCallback, useState } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// Hook simplificado para histórico de propriedades
export const usePropertyHistory = () => {
  const [canUndo] = useState(false);
  const [canRedo] = useState(false);

  const undo = useCallback(() => {
    appLogger.info('Undo (placeholder)');
  }, []);

  const redo = useCallback(() => {
    appLogger.info('Redo (placeholder)');
  }, []);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
  };
};

export default usePropertyHistory;
