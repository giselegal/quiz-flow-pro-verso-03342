/**
 * ⚠️ ⚠️ ⚠️ DEPRECATED - NÃO USAR ⚠️ ⚠️ ⚠️
 * @deprecated Use QuizModularProductionEditor - Ver MIGRATION_EDITOR.md
 */

/**
 * 🎯 QUIZ PAGE EDITOR - Editor para componentes do QuizPage
 * 
 * Funcionalidades:
 * - Editar componentes do QuizPage no /editor existente
 * - Integração com UnifiedCRUDService
 * - Preview em tempo real
 * - Gerenciamento de versões
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  Eye,
  Save,
  Undo,
  Redo,
  Settings,
  Palette,
  Type,
  Layout,
  Code,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useQuizPageEditor } from '@/hooks/core/useQuizPageEditor';
import { QuizPageComponent } from '@/services/QuizPageIntegrationService';

interface QuizPageEditorProps {
  funnelId: string;
  componentId?: string;
  onSave?: (component: QuizPageComponent) => void;
  onPreview?: (component: QuizPageComponent) => void;
}

export function QuizPageEditor({
  funnelId,
  componentId,
  onSave,
  onPreview
}: QuizPageEditorProps) {
  // 🚨 Console warning para desenvolvedores
  console.warn(
    '⚠️ DEPRECATED: QuizPageEditor será removido em 01/nov/2025. ' +
    'Migre para QuizModularProductionEditor. Ver MIGRATION_EDITOR.md'
  );

  const {
    funnel,
    components,
    isLoading,
    isSaving,
    error,
    loadFunnel,
    saveFunnel,
    updateComponent,
    versions,
    createVersion,
    restoreVersion,
    analytics,
    refreshAnalytics
  } = useQuizPageEditor(funnelId);

  const [selectedComponent, setSelectedComponent] = useState<QuizPageComponent | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Carregar funil
  useEffect(() => {
    if (funnelId) {
      loadFunnel(funnelId);
    }
  }, [funnelId, loadFunnel]);

  // Selecionar componente
  useEffect(() => {
    if (componentId && components.length > 0) {
      const component = components.find(comp => comp.id === componentId);
      if (component) {
        setSelectedComponent(component);
      }
    } else if (components.length > 0) {
      setSelectedComponent(components[0]);
    }
  }, [componentId, components]);

  const handleComponentSelect = (component: QuizPageComponent) => {
    setSelectedComponent(component);
  };

  const handleComponentUpdate = async (updates: Partial<QuizPageComponent>) => {
    if (!selectedComponent) return;

    try {
      await updateComponent(selectedComponent.id, updates);

      // Atualizar estado local
      const updatedComponent = { ...selectedComponent, ...updates };
      setSelectedComponent(updatedComponent);

      if (onSave) {
        onSave(updatedComponent);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar componente:', error);
    }
  };

  const handleSave = async () => {
    try {
      await saveFunnel();
    } catch (error) {
      console.error('❌ Erro ao salvar funil:', error);
    }
  };

  const handlePreview = () => {
    if (selectedComponent && onPreview) {
      onPreview(selectedComponent);
    }
    setIsPreviewMode(!isPreviewMode);
  };

  const handleCreateVersion = async () => {
    const name = prompt('Nome da versão:');
    const description = prompt('Descrição da versão:');

    if (name && description) {
      await createVersion(name, description);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">❌ {error}</div>
        <Button onClick={() => loadFunnel(funnelId)}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (!funnel || !selectedComponent) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhum componente selecionado</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Editor QuizPage</h2>
          <Badge variant="outline">
            {funnel.name}
          </Badge>
          <Badge variant="outline">
            v{funnel.version}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handlePreview}
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? 'Editar' : 'Preview'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Lista de Componentes */}
        <div className="w-80 border-r bg-gray-50">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Componentes</h3>
            <div className="space-y-2">
              {components.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedComponent?.id === component.id
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  onClick={() => handleComponentSelect(component)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{component.name}</div>
                      <div className="text-xs text-gray-500">
                        Etapa {component.step} • {component.type}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {component.isEditable ? 'Editável' : 'Somente leitura'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {isPreviewMode ? (
            /* Preview Mode */
            <div className="flex-1 p-6 bg-gray-100">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {selectedComponent.content.title || selectedComponent.name}
                  </h3>
                  {selectedComponent.content.description && (
                    <p className="text-gray-600 mb-4">
                      {selectedComponent.content.description}
                    </p>
                  )}
                  {selectedComponent.type === 'question' && selectedComponent.content.options && (
                    <div className="space-y-2">
                      {selectedComponent.content.options.map((option) => (
                        <div
                          key={option.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          {option.text}
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedComponent.content.buttonText && (
                    <div className="mt-6">
                      <Button className="w-full">
                        {selectedComponent.content.buttonText}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="flex-1 p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="content">
                    <Type className="w-4 h-4 mr-2" />
                    Conteúdo
                  </TabsTrigger>
                  <TabsTrigger value="styles">
                    <Palette className="w-4 h-4 mr-2" />
                    Estilos
                  </TabsTrigger>
                  <TabsTrigger value="properties">
                    <Settings className="w-4 h-4 mr-2" />
                    Propriedades
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    <Code className="w-4 h-4 mr-2" />
                    Código
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conteúdo do Componente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={selectedComponent.content.title || ''}
                          onChange={(e) => handleComponentUpdate({
                            content: { ...selectedComponent.content, title: e.target.value }
                          })}
                          placeholder="Título do componente"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={selectedComponent.content.description || ''}
                          onChange={(e) => handleComponentUpdate({
                            content: { ...selectedComponent.content, description: e.target.value }
                          })}
                          placeholder="Descrição do componente"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buttonText">Texto do Botão</Label>
                        <Input
                          id="buttonText"
                          value={selectedComponent.content.buttonText || ''}
                          onChange={(e) => handleComponentUpdate({
                            content: { ...selectedComponent.content, buttonText: e.target.value }
                          })}
                          placeholder="Texto do botão"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="styles" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estilos do Componente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={selectedComponent.styles.backgroundColor || '#ffffff'}
                          onChange={(e) => handleComponentUpdate({
                            styles: { ...selectedComponent.styles, backgroundColor: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="textColor">Cor do Texto</Label>
                        <Input
                          id="textColor"
                          type="color"
                          value={selectedComponent.styles.textColor || '#333333'}
                          onChange={(e) => handleComponentUpdate({
                            styles: { ...selectedComponent.styles, textColor: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buttonColor">Cor do Botão</Label>
                        <Input
                          id="buttonColor"
                          type="color"
                          value={selectedComponent.styles.buttonColor || '#3b82f6'}
                          onChange={(e) => handleComponentUpdate({
                            styles: { ...selectedComponent.styles, buttonColor: e.target.value }
                          })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="properties" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Propriedades do Componente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="componentName">Nome do Componente</Label>
                        <Input
                          id="componentName"
                          value={selectedComponent.name}
                          onChange={(e) => handleComponentUpdate({ name: e.target.value })}
                          placeholder="Nome do componente"
                        />
                      </div>
                      <div>
                        <Label htmlFor="componentDescription">Descrição</Label>
                        <Textarea
                          id="componentDescription"
                          value={selectedComponent.description}
                          onChange={(e) => handleComponentUpdate({ description: e.target.value })}
                          placeholder="Descrição do componente"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="step">Etapa</Label>
                        <Input
                          id="step"
                          type="number"
                          value={selectedComponent.step}
                          onChange={(e) => handleComponentUpdate({ step: parseInt(e.target.value) })}
                          min="1"
                          max="21"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Código do Componente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                        {JSON.stringify(selectedComponent, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
