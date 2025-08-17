import { toast } from '@/hooks/use-toast';
import { funnelTemplateService } from '@/services/funnelTemplateService';
import { useCallback, useState } from 'react';

export interface SavedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: string;
  tags: string[];
  data: any;
  stepCount: number;
  createdAt: string;
  updatedAt: string;
  isLocal?: boolean;
}

export const useSavedTemplates = () => {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [localTemplates, setLocalTemplates] = useState<SavedTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar todos os templates salvos
  const loadSavedTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Carregar templates do Supabase
      const supabaseTemplates = await funnelTemplateService.getUserTemplates();
      const formattedSupabaseTemplates = (supabaseTemplates || []).map(template => ({
        ...template,
        isLocal: false,
      }));
      setTemplates(formattedSupabaseTemplates);

      // Carregar templates locais
      const localTemplatesStr = localStorage.getItem('saved-templates');
      if (localTemplatesStr) {
        const parsedLocalTemplates = JSON.parse(localTemplatesStr);
        const formattedLocalTemplates = (parsedLocalTemplates || []).map((template: any) => ({
          ...template,
          isLocal: true,
        }));
        setLocalTemplates(formattedLocalTemplates);
      } else {
        setLocalTemplates([]);
      }
    } catch (err) {
      const errorMessage = 'Erro ao carregar templates salvos';
      setError(errorMessage);
      console.error('Erro ao carregar templates:', err);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar um template específico para o editor
  const loadTemplateToEditor = useCallback(async (templateId: string, isLocal: boolean = false) => {
    try {
      let template: SavedTemplate | null = null;

      if (isLocal) {
        // Buscar template local
        const localTemplatesStr = localStorage.getItem('saved-templates');
        if (localTemplatesStr) {
          const parsedLocalTemplates = JSON.parse(localTemplatesStr);
          template = parsedLocalTemplates.find((t: any) => t.id === templateId) || null;
        }
      } else {
        // Buscar template no Supabase
        template = await funnelTemplateService.getTemplate(templateId);
      }

      if (!template) {
        throw new Error('Template não encontrado');
      }

      return template;
    } catch (err) {
      const errorMessage = 'Erro ao carregar template';
      console.error('Erro ao carregar template para o editor:', err);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, []);

  // Duplicar um template
  const duplicateTemplate = useCallback(
    async (templateId: string, isLocal: boolean = false) => {
      try {
        const originalTemplate = await loadTemplateToEditor(templateId, isLocal);

        const duplicatedTemplate: SavedTemplate = {
          ...originalTemplate,
          id: `${originalTemplate.id}-copy-${Date.now()}`,
          name: `${originalTemplate.name} (Cópia)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (isLocal) {
          // Salvar cópia no localStorage
          const localTemplatesStr = localStorage.getItem('saved-templates');
          const existingTemplates = localTemplatesStr ? JSON.parse(localTemplatesStr) : [];
          const updatedTemplates = [...existingTemplates, duplicatedTemplate];
          localStorage.setItem('saved-templates', JSON.stringify(updatedTemplates));
          setLocalTemplates(prev => [...prev, { ...duplicatedTemplate, isLocal: true }]);
        } else {
          // Salvar cópia no Supabase
          const newTemplateId = await funnelTemplateService.saveTemplate(duplicatedTemplate);
          if (newTemplateId) {
            await loadSavedTemplates(); // Recarregar lista
          }
        }

        toast({
          title: 'Sucesso',
          description: 'Template duplicado com sucesso.',
          variant: 'default',
        });

        return duplicatedTemplate;
      } catch (err) {
        console.error('Erro ao duplicar template:', err);
        toast({
          title: 'Erro',
          description: 'Erro ao duplicar template.',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [loadTemplateToEditor, loadSavedTemplates]
  );

  // Excluir um template
  const deleteTemplate = useCallback(async (templateId: string, isLocal: boolean = false) => {
    try {
      if (isLocal) {
        // Remover template local
        const localTemplatesStr = localStorage.getItem('saved-templates');
        if (localTemplatesStr) {
          const existingTemplates = JSON.parse(localTemplatesStr);
          const updatedTemplates = existingTemplates.filter((t: any) => t.id !== templateId);
          localStorage.setItem('saved-templates', JSON.stringify(updatedTemplates));
          setLocalTemplates(prev => prev.filter(t => t.id !== templateId));
        }
      } else {
        // Remover template do Supabase
        await funnelTemplateService.deleteTemplate(templateId);
        setTemplates(prev => prev.filter(t => t.id !== templateId));
      }

      toast({
        title: 'Sucesso',
        description: 'Template excluído com sucesso.',
        variant: 'default',
      });
    } catch (err) {
      console.error('Erro ao excluir template:', err);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir template.',
        variant: 'destructive',
      });
      throw err;
    }
  }, []);

  // Exportar template como JSON
  const exportTemplate = useCallback(
    async (templateId: string, isLocal: boolean = false) => {
      try {
        const template = await loadTemplateToEditor(templateId, isLocal);

        const exportData = {
          ...template,
          exportedAt: new Date().toISOString(),
          version: '1.0.0',
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `template-${template.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
        link.click();

        URL.revokeObjectURL(url);

        toast({
          title: 'Sucesso',
          description: 'Template exportado com sucesso.',
          variant: 'default',
        });
      } catch (err) {
        console.error('Erro ao exportar template:', err);
        toast({
          title: 'Erro',
          description: 'Erro ao exportar template.',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [loadTemplateToEditor]
  );

  // Obter todos os templates (Supabase + Local)
  const getAllTemplates = useCallback(() => {
    return [...templates, ...localTemplates];
  }, [templates, localTemplates]);

  // Buscar template por ID em ambas as fontes
  const findTemplateById = useCallback(
    (templateId: string) => {
      const supabaseTemplate = templates.find(t => t.id === templateId);
      if (supabaseTemplate) {
        return { template: supabaseTemplate, isLocal: false };
      }

      const localTemplate = localTemplates.find(t => t.id === templateId);
      if (localTemplate) {
        return { template: localTemplate, isLocal: true };
      }

      return null;
    },
    [templates, localTemplates]
  );

  return {
    // Estado
    templates,
    localTemplates,
    allTemplates: getAllTemplates(),
    isLoading,
    error,

    // Ações
    loadSavedTemplates,
    loadTemplateToEditor,
    duplicateTemplate,
    deleteTemplate,
    exportTemplate,
    findTemplateById,
  };
};
