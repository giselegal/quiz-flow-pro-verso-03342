/**
 * 🎯 FUNNEL TEMPLATES HOOK - OTIMIZADO
 * 
 * Hook para gerenciamento otimizado de templates de funil
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { migratedTemplateService } from '@/services/migratedTemplateService';

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  stepCount: number;
  isOfficial: boolean;
  usageCount: number;
  tags: string[];
  features: string[];
  conversionRate: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface UseFunnelTemplatesOptions {
  category?: string;
  autoLoad?: boolean;
}

export interface UseFunnelTemplatesReturn {
  templates: FunnelTemplate[];
  isLoading: boolean;
  error: string | null;
  loadTemplates: () => Promise<void>;
  filterByCategory: (category: string) => FunnelTemplate[];
  createTemplate: (template: Omit<FunnelTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FunnelTemplate>;
  updateTemplate: (id: string, updates: Partial<FunnelTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

export function useFunnelTemplates(
  options: UseFunnelTemplatesOptions = {}
): UseFunnelTemplatesReturn {
  const { category, autoLoad = true } = options;
  const [templates, setTemplates] = useState<FunnelTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados mock para desenvolvimento
  const mockTemplates: FunnelTemplate[] = useMemo(() => [
    {
      id: 'quiz-21-steps',
      name: 'Quiz de Estilo 21 Etapas',
      description: 'Quiz completo para descoberta de estilo pessoal',
      category: 'quiz',
      stepCount: 21,
      isOfficial: true,
      usageCount: 150,
      tags: ['quiz', 'estilo', 'lifestyle'],
      features: ['21 etapas', 'Resultados personalizados', 'Social proof'],
      conversionRate: 85.4,
      image: '/api/placeholder/300/200',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ], []);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Por enquanto usar dados mock, depois integrar com API real
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular loading
      setTemplates(mockTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar templates');
    } finally {
      setIsLoading(false);
    }
  }, [mockTemplates]);

  const filterByCategory = useCallback((cat: string) => {
    return templates.filter(template => template.category === cat);
  }, [templates]);

  const createTemplate = useCallback(async (template: Omit<FunnelTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<FunnelTemplate> => {
    const newTemplate: FunnelTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const updateTemplate = useCallback(async (id: string, updates: Partial<FunnelTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === id 
        ? { ...template, ...updates, updatedAt: new Date().toISOString() }
        : template
    ));
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  }, []);

  // Auto-load se habilitado
  useEffect(() => {
    if (autoLoad) {
      loadTemplates();
    }
  }, [autoLoad, loadTemplates]);

  // Filtro por categoria
  const filteredTemplates = useMemo(() => {
    if (!category) return templates;
    return filterByCategory(category);
  }, [templates, category, filterByCategory]);

  return {
    templates: filteredTemplates,
    isLoading,
    error,
    loadTemplates,
    filterByCategory,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
}

export default useFunnelTemplates;