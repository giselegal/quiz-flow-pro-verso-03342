import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';
import { getUnifiedTemplates } from '@/config/unifiedTemplatesRegistry';
import { cloneFunnelTemplate } from '@/utils/cloneFunnel';
import { funnelLocalStore } from '@/services/funnelLocalStore';

const EditorTemplatesPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Carregar templates unificados
  const templates = getUnifiedTemplates();

  const handleSelectTemplate = async (templateId: string) => {
    try {
      console.log('🎯 Selecionando template:', templateId);

      // Buscar template selecionado
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        console.error('❌ Template não encontrado:', templateId);
        return;
      }

      // Clonar template para criar nova instância
      const templateData = {
        id: template.id,
        name: template.name,
        description: template.description || '',
        category: template.category || 'general',
        preview: template.image || '',
        blocks: [] // Será preenchido pelo sistema de templates
      };

      const clonedInstance = cloneFunnelTemplate(templateData, `${template.name} - Novo Funil`);

      // Salvar no localStorage como um funil
      const newFunnel = {
        id: clonedInstance.id,
        name: clonedInstance.name,
        status: 'draft' as const,
        updatedAt: clonedInstance.createdAt
      };

      funnelLocalStore.upsert(newFunnel);
      console.log('✅ Funil criado a partir do template:', clonedInstance.id);

      // Navegar para o editor com o funil criado
      setLocation(`/editor/${encodeURIComponent(clonedInstance.id)}`);

    } catch (error) {
      console.error('❌ Erro ao selecionar template:', error);
      // Fallback: navegar direto para editor
      setLocation('/editor');
    }
  };

  const handlePreviewTemplate = (templateId: string) => {
    // Abrir preview em nova aba
    const previewUrl = `/quiz?template=${templateId}`;
    window.open(previewUrl, '_blank');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#432818] mb-2">
          <Sparkles className="inline-block w-8 h-8 mr-2 text-[#B89B7A]" />
          Modelos de Funil
        </h1>
        <p className="text-[#8F7A6A] text-lg">
          Escolha um modelo otimizado para começar seu funil
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedTemplate === template.id
                ? 'ring-2 ring-[#B89B7A] shadow-lg'
                : 'hover:shadow-md'
              }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-[#432818] mb-1">
                    {template.name}
                  </CardTitle>
                  <p className="text-sm text-[#8F7A6A] line-clamp-2">
                    {template.description || 'Modelo de funil profissional'}
                  </p>
                </div>
                <Badge
                  variant={template.isOfficial ? "default" : "secondary"}
                  className="ml-2"
                >
                  {template.isOfficial ? 'Oficial' : 'Personalizado'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Preview thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-[#F6F3EF] to-[#EEEBE1] rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-[#8F7A6A]">
                    {template.stepCount || 21} etapas
                  </p>
                </div>
              </div>

              {/* Metadados */}
              <div className="flex items-center justify-between text-xs text-[#8F7A6A] mb-4">
                <span>Categoria: {template.category || 'Geral'}</span>
                <span>{template.usageCount || 0} usos</span>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template.id);
                  }}
                  className="flex-1 bg-[#B89B7A] hover:bg-[#A08966] text-white"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Usar Template
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewTemplate(template.id);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#F6F3EF] rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#B89B7A]" />
          </div>
          <h3 className="text-lg font-semibold text-[#432818] mb-2">
            Nenhum template encontrado
          </h3>
          <p className="text-[#8F7A6A] mb-4">
            Não há templates disponíveis no momento.
          </p>
          <Button
            onClick={() => setLocation('/editor')}
            className="bg-[#B89B7A] hover:bg-[#A08966] text-white"
          >
            Criar Funil do Zero
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditorTemplatesPage;