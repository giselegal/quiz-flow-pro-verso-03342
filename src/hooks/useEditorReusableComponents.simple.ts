/**
 * 🎯 HOOK EDITOR REUSABLE COMPONENTS SIMPLE - PLACEHOLDER
 * 
 * Hook temporário para resolver dependências de imports
 */

import { useState, useCallback } from 'react';

export interface ReusableComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  data: Record<string, any>;
  tags: string[];
}

export const useEditorReusableComponentsSimple = () => {
  const [components, setComponents] = useState<ReusableComponent[]>([]);
  const [categories, setCategories] = useState<string[]>(['Básicos', 'Avançados', 'Formulários']);
  const [isLoading, setIsLoading] = useState(false);

  const loadComponents = useCallback(async () => {
    setIsLoading(true);
    console.log('📥 Carregando componentes reutilizáveis...');
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const sampleComponents: ReusableComponent[] = [
      {
        id: 'comp-1',
        name: 'Botão Principal',
        category: 'Básicos',
        description: 'Botão principal do sistema',
        preview: 'https://via.placeholder.com/150x100',
        data: { type: 'button', variant: 'primary' },
        tags: ['button', 'primary']
      },
      {
        id: 'comp-2',
        name: 'Card de Informação',
        category: 'Avançados',
        description: 'Card informativo com título e descrição',
        preview: 'https://via.placeholder.com/150x100',
        data: { type: 'info-card', layout: 'vertical' },
        tags: ['card', 'info']
      }
    ];
    
    setComponents(sampleComponents);
    setIsLoading(false);
  }, []);

  const addComponent = useCallback((component: Omit<ReusableComponent, 'id'>) => {
    const newComponent: ReusableComponent = {
      ...component,
      id: `comp-${Date.now()}`
    };
    
    setComponents(prev => [...prev, newComponent]);
    console.log('➕ Componente adicionado:', newComponent);
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<ReusableComponent>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
    console.log('🔄 Componente atualizado:', id, updates);
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    console.log('🗑️ Componente removido:', id);
  }, []);

  return {
    components,
    categories,
    isLoading,
    loadComponents,
    addComponent,
    updateComponent,
    deleteComponent,
    totalComponents: components.length
  };
};

export default useEditorReusableComponentsSimple;