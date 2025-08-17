import { useCallback, useState } from 'react';

// Hook simplificado para histórico de propriedades
export const usePropertyHistory = () => {
  const [canUndo] = useState(false);
  const [canRedo] = useState(false);

  const undo = useCallback(() => {
    console.log('Undo (placeholder)');
  }, []);

  const redo = useCallback(() => {
    console.log('Redo (placeholder)');
  }, []);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
  };
};

export default usePropertyHistory;