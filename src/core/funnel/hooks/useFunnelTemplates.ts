/**
 * Hook para gerenciar templates de funil
 */
import { useState, useEffect } from 'react';
import { UITemplate } from '@/services/templateService';

export interface UseFunnelTemplatesOptions {
  category?: string;
  searchTerm?: string;
}

export interface UseFunnelTemplatesReturn {
  templates: UITemplate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filterBySearch: (term: string) => UITemplate[];
  filterByCategory: (category: string) => UITemplate[];
}

export const useFunnelTemplates = (): UseFunnelTemplatesReturn => {
  const [templates, setTemplates] = useState<UITemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // Implementação placeholder
      setTemplates([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const filterBySearch = (term: string) => {
    return templates.filter(t => 
      t.name.toLowerCase().includes(term.toLowerCase()) ||
      t.description?.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filterByCategory = (category: string) => {
    return templates.filter(t => t.category === category);
  };

  return {
    templates,
    loading,
    error,
    refetch: loadTemplates,
    filterBySearch,
    filterByCategory
  };
};

export const useCreateFunnelFromTemplate = useFunnelTemplates;
export const useFunnelTemplatePreview = useFunnelTemplates;

export default useFunnelTemplates;