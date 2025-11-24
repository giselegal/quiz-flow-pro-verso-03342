/**
 * 📋 TEMPLATE SELECTOR - CANONICAL VERSION
 * 
 * This component uses the canonical services architecture with React Query.
 * All legacy paths and feature flag conditionals have been removed.
 * 
 * ARCHITECTURE:
 * - Uses React Query hooks for data fetching and mutations
 * - Uses canonical TemplateService through React Query
 * - No feature flags or conditional logic
 * - Single, stable code path
 * 
 * @version 4.0.0 - Phase 4 Finalized
 * @phase Phase 4 - Canonical Only (No Legacy Support)
 */

import React, { useState } from 'react';
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

// Canonical React Query hooks (permanent, no feature flags)
import { useTemplateList } from '@/hooks/useTemplate';
import { useCreateTemplate, useDeleteTemplate } from '@/hooks/useUpdateTemplate';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

/**
 * Template Selector using canonical services architecture
 * 
 * Uses React Query hooks + Supabase for all operations.
 * No legacy paths or feature flag conditionals.
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
  // DATA FETCHING (Canonical React Query)
  // ============================================================================
  
  const {
    data: templates,
    isLoading,
    refetch,
  } = useTemplateList(
    { status: 'published' },
    { enabled: true }
  );
  
  const createTemplateMutation = useCreateTemplate({
    onSuccess: () => {
      refetch();
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
      refetch();
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
  };

  const handleDuplicateTemplate = async (id: string) => {
    // TODO: Implement template duplication with React Query
    toast({
      title: 'Em desenvolvimento',
      description: 'Duplicação de templates será implementada em breve.',
      variant: 'default',
    });
  };

  const handleDeleteTemplate = async (id: string) => {
    await deleteTemplateMutation.mutateAsync({ id });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">

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
      {!isLoading && templates && (
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
