import { useState, useCallback } from "react";
import { Block } from "@/types/editor";

export interface UseInlineBlockReturn {
  isEditing: boolean;
  startEditing: () => void;
  stopEditing: () => void;
  handlePropertyChange: (key: string, value: any) => void;
  // Additional properties for compatibility
  properties: Record<string, any>;
  commonProps: {
    block: Block;
    isSelected: boolean;
    onClick?: () => void;
    onPropertyChange?: (key: string, value: any) => void;
    className?: string;
  };
}

export const useInlineBlock = (
  block: Block,
  isSelected?: boolean,
  onClick?: () => void,
  onPropertyChange?: (key: string, value: any) => void,
  className?: string
): UseInlineBlockReturn => {
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handlePropertyChange = useCallback(
    (key: string, value: any) => {
      if (onPropertyChange) {
        onPropertyChange(key, value);
      }
    },
    [onPropertyChange]
  );

  const properties = block?.properties || {};

  const commonProps = {
    block,
    isSelected: isSelected || false,
    onClick,
    onPropertyChange,
    className,
  };

  return {
    isEditing,
    startEditing,
    stopEditing,
    handlePropertyChange,
    properties,
    commonProps,
  };
};
