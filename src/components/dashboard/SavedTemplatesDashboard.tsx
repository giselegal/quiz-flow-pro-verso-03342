import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Edit3,
  Copy,
  Trash2,
  Download,
  MoreVertical,
  Eye,
  Calendar,
  Tag,
} from 'lucide-react';
import { funnelTemplateService, type FunnelTemplate } from '@/services/funnelTemplateService';
import { toast } from '@/hooks/use-toast';

interface SavedTemplatesDashboardProps {
  onSelectTemplate?: (templateId: string) => void;
  onEditTemplate?: (templateId: string) => void;
  onDuplicateTemplate?: (templateId: string) => void;
  onLoadTemplate?: (templateId: string) => void;
}

export const SavedTemplatesDashboard: React.FC<SavedTemplatesDashboardProps> = ({
  onSelectTemplate,
  onEditTemplate,
  onDuplicateTemplate,
  onLoadTemplate,
}) => {
  const [templates, setTemplates] = useState<FunnelTemplate[]>([]);
  const [localTemplates, setLocalTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Carregar templates do Supabase
      const supabaseTemplates = await funnelTemplateService.getUserTemplates();
      setTemplates(supabaseTemplates || []);

      // Carregar templates locais
      const localTemplatesStr = localStorage.getItem('saved-templates');
      if (localTemplatesStr) {
        const parsedLocalTemplates = JSON.parse(localTemplatesStr);
        setLocalTemplates(parsedLocalTemplates || []);
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar templates salvos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string, isLocal: boolean = false) => {
    if (!window.confirm('Tem certeza que deseja excluir este template?')) {
      return;
    }

    try {
      if (isLocal) {
        // Remover template local
        const updatedLocalTemplates = localTemplates.filter(t => t.id !== templateId);
        setLocalTemplates(updatedLocalTemplates);
        localStorage.setItem('saved-templates', JSON.stringify(updatedLocalTemplates));
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
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir template.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicateTemplate = async (template: any, isLocal: boolean = false) => {
    try {
      const duplicatedTemplate = {
        ...template,
        id: `${template.id}-copy-${Date.now()}`,
        name: `${template.name} (Cópia)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isLocal) {
        // Duplicar template local
        const updatedLocalTemplates = [...localTemplates, duplicatedTemplate];
        setLocalTemplates(updatedLocalTemplates);
        localStorage.setItem('saved-templates', JSON.stringify(updatedLocalTemplates));
      } else {
        // Duplicar template no Supabase
        const newTemplateId = await funnelTemplateService.saveTemplate(duplicatedTemplate);
        if (newTemplateId) {
          loadTemplates(); // Recarregar lista
        }
      }

      toast({
        title: 'Sucesso',
        description: 'Template duplicado com sucesso.',
        variant: 'default',
      });

      onDuplicateTemplate?.(duplicatedTemplate.id);
    } catch (error) {
      console.error('Erro ao duplicar template:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao duplicar template.',
        variant: 'destructive',
      });
    }
  };

  const handleExportTemplate = (template: any) => {
    try {
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
    } catch (error) {
      console.error('Erro ao exportar template:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao exportar template.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const TemplateCard = ({ template, isLocal = false }: { template: any; isLocal?: boolean }) => (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-[#432818] mb-1 line-clamp-1">
              {template.name}
            </h3>
            <p className="text-sm text-[#6B4F43] mb-2 line-clamp-2">
              {template.description}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onLoadTemplate?.(template.id)}>
                <Eye className="h-4 w-4 mr-2" />
                Carregar no Editor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditTemplate?.(template.id)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDuplicateTemplate(template, isLocal)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportTemplate(template)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar JSON
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteTemplate(template.id, isLocal)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between text-xs text-[#8B7355] mb-3">
          <div className="flex items-center gap-4">
            <span>{template.stepCount || template.components?.length || 0} componentes</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(template.createdAt || template.updatedAt)}
            </div>
          </div>
          
          {isLocal && (
            <Badge variant="outline" className="text-xs">
              Local
            </Badge>
          )}
        </div>

        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-[#B89B7A] hover:bg-[#A38A69] text-white"
            onClick={() => onLoadTemplate?.(template.id)}
          >
            Carregar no Editor
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#B89B7A] text-[#6B4F43] hover:bg-[#B89B7A]/10"
            onClick={() => onSelectTemplate?.(template.id)}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const hasTemplates = templates.length > 0 || localTemplates.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#432818]">Meus Templates</h2>
          <p className="text-[#6B4F43]">
            Templates salvos que você pode reutilizar em novos projetos
          </p>
        </div>
        <Button onClick={loadTemplates} variant="outline" className="border-[#B89B7A]">
          Atualizar Lista
        </Button>
      </div>

      {!hasTemplates ? (
        // Empty State
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#B89B7A' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#432818' }}>
            Nenhum template salvo
          </h3>
          <p style={{ color: '#6B4F43' }}>
            Comece criando um funil no editor e salve-o como template para reutilizar depois.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Templates do Supabase */}
          {templates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#432818] mb-4">
                Templates na Nuvem ({templates.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
          )}

          {/* Templates Locais */}
          {localTemplates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#432818] mb-4">
                Templates Locais ({localTemplates.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} isLocal={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
