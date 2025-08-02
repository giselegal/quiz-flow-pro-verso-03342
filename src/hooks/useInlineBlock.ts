import { useState, useCallback } from 'react';

export interface UseInlineBlockReturn {
  isEditing: boolean;
  startEditing: () => void;
  stopEditing: () => void;
  handlePropertyChange: (key: string, value: any) => void;
}

export const useInlineBlock = (
  blockId: string,
  onPropertyChange?: (key: string, value: any) => void
): UseInlineBlockReturn => {
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handlePropertyChange = useCallback((key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  }, [onPropertyChange]);

  return {
    isEditing,
    startEditing,
    stopEditing,
    handlePropertyChange
  };
};
