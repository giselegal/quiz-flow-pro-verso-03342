import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Tag, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { funnelTemplateService } from '@/services/funnelTemplateService';
import { Block } from '@/types/editor';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBlocks: Block[];
  currentFunnelId: string;
  onSaveSuccess?: (templateId: string) => void;
}

const TEMPLATE_CATEGORIES = {
  'quiz-style': 'Quiz de Estilo',
  'lead-generation': 'Geração de Leads',
  'personality-test': 'Teste de Personalidade',
  'product-recommendation': 'Recomendação de Produto',
  'assessment': 'Avaliações',
  'offer-funnel': 'Funil de Oferta',
  'custom': 'Personalizado',
};

const TEMPLATE_THEMES = {
  'modern-chic': 'Moderno Chique',
  'business-clean': 'Empresarial Limpo',
  'wellness-soft': 'Bem-estar Suave',
  'tech-modern': 'Tecnologia Moderna',
  'luxury-gold': 'Luxo Dourado',
  'corporate-blue': 'Corporativo Azul',
  'creative-bold': 'Criativo Ousado',
};

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  currentBlocks,
  currentFunnelId,
  onSaveSuccess,
}) => {
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: 'custom',
    theme: 'modern-chic',
    isOfficial: false,
    tags: [] as string[],
  });
  
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !templateData.tags.includes(newTag.trim())) {
      setTemplateData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTemplateData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!templateData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do template é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (!templateData.description.trim()) {
      toast({
        title: 'Erro',
        description: 'Descrição do template é obrigatória.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      // Preparar dados do template
      const templatePayload = {
        name: templateData.name.trim(),
        description: templateData.description.trim(),
        category: templateData.category,
        theme: templateData.theme,
        stepCount: currentBlocks.length,
        isOfficial: templateData.isOfficial,
        usageCount: 0,
        tags: templateData.tags,
        thumbnailUrl: '', // Pode ser gerado automaticamente depois
        templateData: {
          originalFunnelId: currentFunnelId,
          createdFrom: 'editor',
          version: '1.0.0',
        },
        components: currentBlocks.map((block, index) => ({
          id: block.id,
          type: block.type,
          content: block.content,
          properties: block.properties,
          order: block.order || index,
          stepNumber: 1, // Pode ser ajustado conforme necessário
        })),
      };

      console.log('💾 Salvando template:', templatePayload);

      // Salvar o template
      const templateId = await funnelTemplateService.saveTemplate(templatePayload);

      if (templateId) {
        toast({
          title: 'Sucesso!',
          description: `Template "${templateData.name}" salvo com sucesso.`,
          variant: 'default',
        });

        // Reset form
        setTemplateData({
          name: '',
          description: '',
          category: 'custom',
          theme: 'modern-chic',
          isOfficial: false,
          tags: [],
        });

        // Callback de sucesso
        onSaveSuccess?.(templateId);
        onClose();
      } else {
        throw new Error('ID do template não retornado');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar template:', error);
      
      // Fallback: salvar no localStorage
      try {
        const localTemplate = {
          id: `template-${Date.now()}`,
          ...templateData,
          stepCount: currentBlocks.length,
          components: currentBlocks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const existingTemplates = JSON.parse(
          localStorage.getItem('saved-templates') || '[]'
        );
        existingTemplates.push(localTemplate);
        localStorage.setItem('saved-templates', JSON.stringify(existingTemplates));

        toast({
          title: 'Template salvo localmente',
          description: 'Template salvo no navegador. Acesse em Templates Salvos.',
          variant: 'default',
        });

        onSaveSuccess?.(localTemplate.id);
        onClose();
      } catch (localError) {
        toast({
          title: 'Erro',
          description: 'Falha ao salvar template. Tente novamente.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setTemplateData({
      name: '',
      description: '',
      category: 'custom',
      theme: 'modern-chic',
      isOfficial: false,
      tags: [],
    });
    setNewTag('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#B89B7A]" />
            Salvar como Template
          </DialogTitle>
          <DialogDescription>
            Salve o funil atual como um template reutilizável. O template incluirá todos os {currentBlocks.length} componentes atuais.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-[#432818]">Informações Básicas</h3>
              
              <div className="space-y-2">
                <Label htmlFor="template-name">Nome do Template *</Label>
                <Input
                  id="template-name"
                  placeholder="Ex: Meu Quiz de Estilo Personalizado"
                  value={templateData.name}
                  onChange={e => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Descrição *</Label>
                <Textarea
                  id="template-description"
                  placeholder="Descreva o propósito e características do seu template..."
                  value={templateData.description}
                  onChange={e => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Categorização */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-[#432818]">Categorização</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-category">Categoria</Label>
                  <Select
                    value={templateData.category}
                    onValueChange={value => setTemplateData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-theme">Tema Visual</Label>
                  <Select
                    value={templateData.theme}
                    onValueChange={value => setTemplateData(prev => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TEMPLATE_THEMES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-[#432818]">Tags</h3>
              
              <div className="space-y-2">
                <Label htmlFor="new-tag">Adicionar Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-tag"
                    placeholder="Ex: moderno, responsivo, conversão"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {templateData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {templateData.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configurações Avançadas */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-[#432818]">Configurações</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="is-official">Template Oficial</Label>
                  <p className="text-sm text-gray-500">
                    Marcar como template oficial da plataforma
                  </p>
                </div>
                <Switch
                  id="is-official"
                  checked={templateData.isOfficial}
                  onCheckedChange={checked => setTemplateData(prev => ({ ...prev, isOfficial: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          <Card className="bg-[#FAF9F7]">
            <CardContent className="p-4">
              <h3 className="font-semibold text-[#432818] mb-2">Resumo do Template</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Componentes:</span>
                  <span className="font-medium ml-2">{currentBlocks.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Categoria:</span>
                  <span className="font-medium ml-2">
                    {TEMPLATE_CATEGORIES[templateData.category as keyof typeof TEMPLATE_CATEGORIES]}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Tema:</span>
                  <span className="font-medium ml-2">
                    {TEMPLATE_THEMES[templateData.theme as keyof typeof TEMPLATE_THEMES]}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Tags:</span>
                  <span className="font-medium ml-2">{templateData.tags.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !templateData.name.trim() || !templateData.description.trim()}
            className="bg-[#B89B7A] hover:bg-[#A38A69]"
          >
            {isSaving ? 'Salvando...' : 'Salvar Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
