/**
 * 🎯 EDITOR ELEMENTS HOOK
 * Hook para gerenciar elementos do editor
 */

import { useState, useCallback } from 'react';

export interface EditorElement {
  id: string;
  type: string;
  properties: Record<string, any>;
  styles?: Record<string, any>;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export const useEditorElements = () => {
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [elementOrder, setElementOrder] = useState<string[]>([]);
  const [selectedElements, setSelectedElements] = useState<EditorElement[]>([]);

  const addElement = useCallback((element: EditorElement) => {
    setElements(prev => [...prev, element]);
    setElementOrder(prev => [...prev, element.id]);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<EditorElement>) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setElementOrder(prev => prev.filter(eid => eid !== id));
  }, []);

  const removeElement = useCallback((id: string) => {
    deleteElement(id);
  }, [deleteElement]);

  const getElement = useCallback((id: string) => {
    return elements.find(el => el.id === id);
  }, [elements]);

  const getElementsByType = useCallback((type: string) => {
    return elements.filter(el => el.type === type);
  }, [elements]);

  return {
    elements,
    elementOrder,
    selectedElements,
    addElement,
    updateElement,
    deleteElement,
    removeElement,
    getElement,
    getElementsByType,
  };
};
