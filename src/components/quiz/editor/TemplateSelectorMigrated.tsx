/**
 * 🔄 TEMPLATE SELECTOR - PHASE 2 MIGRATED VERSION
 * 
 * This component demonstrates Phase 2 migration to canonical services and React Query.
 * It uses feature flags to conditionally use the new architecture while maintaining
 * backward compatibility.
 * 
 * KEY CHANGES FROM ORIGINAL:
 * - Uses featureFlags to conditionally enable React Query
 * - Falls back to legacy implementation when flags are disabled
 * - Demonstrates gradual migration pattern
 * - Uses canonical TemplateService through migration helpers
 * 
 * @version 2.0.0 - Phase 2 Migration
 * @phase Fase 2 - Migração Progressiva
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Copy, Trash2, Edit, Check, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { appLogger } from '@/lib/utils/appLogger';

// 🎯 PHASE 2: Import feature flags and migration helpers
import { featureFlags } from '@/config/flags';
import { shouldUseReactQuery, loadTemplate } from '@/services/canonical/migrationHelpers';

// 🎯 PHASE 2: Conditional imports based on feature flags
// React Query hooks (used when USE_REACT_QUERY_TEMPLATES is true)
import { useTemplateList } from '@/hooks/useTemplate';
import { useCreateTemplate, useDeleteTemplate } from '@/hooks/useUpdateTemplate';

// Legacy service (used when flags are disabled)
import {
  getAllTemplates,
  createTemplate as legacyCreateTemplate,
  duplicateTemplate as legacyDuplicateTemplate,
  deleteTemplate as legacyDeleteTemplate,
} from '@/services/templates/templateService';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

/**
 * Template Selector with Phase 2 migration support
 * 
 * This component uses feature flags to choose between:
 * - React Query hooks + Supabase (when USE_REACT_QUERY_TEMPLATES is true)
 * - Legacy localStorage-based service (when flag is false)
 */
const TemplateSelectorMigrated: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  // ============================================================================
  // STATE
  // ============================================================================
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);

  // ============================================================================
  // PHASE 2: CONDITIONAL DATA FETCHING
  // ============================================================================
  
  // Use React Query when flag is enabled
  const useReactQuery = shouldUseReactQuery();
  
  // React Query hooks (only used when feature flag is enabled)
  const {
    data: reactQueryTemplates,
    isLoading: isLoadingReactQuery,
    refetch: refetchReactQuery,
  } = useTemplateList(
    { status: 'published' },
    { enabled: useReactQuery }
  );
  
  const createTemplateMutation = useCreateTemplate({
    onSuccess: () => {
      if (useReactQuery) {
        refetchReactQuery();
      }
      toast({
        title: 'Template criado',
        description: 'O novo template foi criado com sucesso.',
      });
      setIsCreateDialogOpen(false);
      setNewTemplateName('');
      setNewTemplateDescription('');
    },
    onError: (error) => {
      appLogger.error('Erro ao criar template:', { data: [error] });
      toast({
        title: 'Erro ao criar template',
        description: error.message || 'Não foi possível criar o novo template.',
        variant: 'destructive',
      });
    },
  });
  
  const deleteTemplateMutation = useDeleteTemplate({
    onSuccess: () => {
      if (useReactQuery) {
        refetchReactQuery();
      }
      toast({
        title: 'Template excluído',
        description: 'O template foi excluído com sucesso.',
      });
      setIsDeleteConfirmOpen(null);
    },
    onError: (error) => {
      appLogger.error('Erro ao excluir template:', { data: [error] });
      toast({
        title: 'Erro ao excluir',
        description: error.message || 'Não foi possível excluir o template.',
        variant: 'destructive',
      });
    },
  });

  // Legacy state (only used when feature flag is disabled)
  const [legacyTemplates, setLegacyTemplates] = useState<any[]>([]);
  const [isLoadingLegacy, setIsLoadingLegacy] = useState(false);

  // Legacy loading effect
  useEffect(() => {
    if (!useReactQuery) {
      loadLegacyTemplates();
    }
  }, [useReactQuery]);

  const loadLegacyTemplates = () => {
    setIsLoadingLegacy(true);
    try {
      const loadedTemplates = getAllTemplates();
      setLegacyTemplates(loadedTemplates);
    } catch (error) {
      appLogger.error('Erro ao carregar templates (legacy):', { data: [error] });
      toast({
        title: 'Erro ao carregar templates',
        description: 'Não foi possível carregar os templates.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingLegacy(false);
    }
  };

  // ============================================================================
  // UNIFIED DATA ACCESS (works with both implementations)
  // ============================================================================
  
  const templates = useReactQuery ? (reactQueryTemplates || []) : legacyTemplates;
  const isLoading = useReactQuery ? isLoadingReactQuery : isLoadingLegacy;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCreateTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, insira um nome para o template.',
        variant: 'destructive',
      });
      return;
    }

    if (useReactQuery) {
      // Use React Query mutation
      await createTemplateMutation.mutateAsync({
        name: newTemplateName,
        description: newTemplateDescription,
        status: 'draft',
        blocks: [],
        config: {},
        metadata: {
          isPublic: false,
          category: 'custom',
        },
      });
    } else {
      // Use legacy service
      try {
        const newTemplate = {
          name: newTemplateName,
          description: newTemplateDescription,
          isPublished: false,
          questions: [],
          resultPageSettings: {
            styleType: 'classic',
            blocks: [],
            headerConfig: {},
            mainContentConfig: {},
            offerConfig: {},
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        legacyCreateTemplate(newTemplate);
        setIsCreateDialogOpen(false);
        setNewTemplateName('');
        setNewTemplateDescription('');
        loadLegacyTemplates();

        toast({
          title: 'Template criado',
          description: 'O novo template foi criado com sucesso.',
        });
      } catch (error) {
        appLogger.error('Erro ao criar template (legacy):', { data: [error] });
        toast({
          title: 'Erro ao criar template',
          description: 'Não foi possível criar o novo template.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDuplicateTemplate = async (id: string) => {
    if (useReactQuery) {
      // TODO: Implement with React Query when available
      toast({
        title: 'Em desenvolvimento',
        description: 'Duplicação via React Query será implementada em breve.',
        variant: 'default',
      });
    } else {
      // Use legacy service
      try {
        const duplicatedId = legacyDuplicateTemplate(id);
        if (duplicatedId) {
          loadLegacyTemplates();
          toast({
            title: 'Template duplicado',
            description: 'O template foi duplicado com sucesso.',
          });
        }
      } catch (error) {
        appLogger.error('Erro ao duplicar template:', { data: [error] });
        toast({
          title: 'Erro ao duplicar',
          description: 'Não foi possível duplicar o template.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (useReactQuery) {
      // Use React Query mutation
      await deleteTemplateMutation.mutateAsync({ id });
    } else {
      // Use legacy service
      try {
        const success = legacyDeleteTemplate(id);
        if (success) {
          loadLegacyTemplates();
          setIsDeleteConfirmOpen(null);
          toast({
            title: 'Template excluído',
            description: 'O template foi excluído com sucesso.',
          });
        }
      } catch (error) {
        appLogger.error('Erro ao excluir template:', { data: [error] });
        toast({
          title: 'Erro ao excluir',
          description: 'Não foi possível excluir o template.',
          variant: 'destructive',
        });
      }
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header with migration status indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">🔄 Phase 2 Migration Status:</span>
            <span className={useReactQuery ? 'text-green-600' : 'text-orange-600'}>
              {useReactQuery ? '✅ React Query Enabled' : '⚠️ Legacy Mode'}
            </span>
          </div>
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Criar Novo Template
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Template</DialogTitle>
            <DialogDescription>
              Configure o nome e descrição do seu novo template.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Template</Label>
              <Input
                id="name"
                placeholder="Ex: Quiz Estilo de Beleza"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva o propósito deste template..."
                value={newTemplateDescription}
                onChange={(e) => setNewTemplateDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={createTemplateMutation.isPending}
            >
              {createTemplateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Templates Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template: any) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.description || 'Sem descrição'}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onSelectTemplate(template.id)}
                >
                  Selecionar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDuplicateTemplate(template.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDeleteConfirmOpen(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmOpen !== null}
        onOpenChange={(open) => !open && setIsDeleteConfirmOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => isDeleteConfirmOpen && handleDeleteTemplate(isDeleteConfirmOpen)}
              disabled={deleteTemplateMutation.isPending}
            >
              {deleteTemplateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateSelectorMigrated;
