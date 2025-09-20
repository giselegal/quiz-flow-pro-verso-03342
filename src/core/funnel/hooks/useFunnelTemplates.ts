/**
 * Hook para gerenciar templates de funil
 */
import { useState, useEffect } from 'react';
import { UITemplate } from '@/services/templateService';

export const useFunnelTemplates = () => {
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

  return {
    templates,
    loading,
    error,
    refetch: loadTemplates
  };
};

export default useFunnelTemplates;