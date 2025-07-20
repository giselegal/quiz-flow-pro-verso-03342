'use client';

import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { EditorPreview } from '@/components/result-editor/EditorPreview';
import { useBlockOperations } from '@/hooks/editor/useBlockOperations';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Eye, EyeOff, TestTube, BarChart3, Settings, ExternalLink, Home } from 'lucide-react';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { QuizEditorPanel } from '@/components/editor/QuizEditorPanel';
import { blockDefinitions, getBlocksByCategory } from '@/config/blockDefinitions';
import { Link } from 'react-router-dom';

// Mock data for testing
const mockStyleResult: StyleResult = {
  style: 'natural',
  points: 85,
  percentage: 85,
  rank: 1,
  category: 'natural',
  score: 85,
  description: 'Você tem um estilo natural e descontraído',
  imageUrl: 'https://example.com/natural.jpg',
  guideImageUrl: 'https://example.com/natural-guide.jpg'
};

export default function Teste5EditorPage() {
  const {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    actions: blockActions
  } = useBlockOperations();

  const [isPreviewing, setIsPreviewing] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'quiz'>('components');

  // Obter componentes do blockDefinitions.ts (dinâmico)
  const resultComponents = getBlocksByCategory('Resultado');
  const offerComponents = getBlocksByCategory('Ofertas');
  const inlineComponents = getBlocksByCategory('Inline');
  const interactionComponents = getBlocksByCategory('Interação');

  // Debug dos componentes
  console.log('🔍 DEBUG Editor Teste5 - Componentes carregados:');
  console.log('📊 Resultado:', resultComponents.length, resultComponents.map(c => c.type));
  console.log('💰 Ofertas:', offerComponents.length, offerComponents.map(c => c.type));
  console.log('⚡ Inline:', inlineComponents.length, inlineComponents.map(c => c.type));
  console.log('🔘 Interação:', interactionComponents.length, interactionComponents.map(c => c.type));

  const handleAddComponent = (type: Block['type']) => {
    console.log('🎯 Adicionando componente (teste5):', type);
    blockActions.handleAddBlock(type);
  };

  const handleSaveInline = (blockId: string, updates: any) => {
    console.log('💾 Editor Teste5 - onSaveInline:', { blockId, updates });
    
    // Aplicar mudanças usando o sistema de block operations
    if (updates.properties) {
      blockActions.handleUpdateBlock(blockId, updates.properties);
      console.log('✅ Bloco atualizado com sucesso no teste5!');
    }
  };

  const handleSaveProject = () => {
    const projectData = {
      blocks,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mode: 'teste5'
    };
    
    console.log('💾 Salvando projeto teste5:', projectData);
    
    // Salvar no localStorage para testes
    localStorage.setItem('teste5-editor-project', JSON.stringify(projectData));
    
    alert(`✅ Projeto Teste5 salvo!\n\n📊 ${blocks.length} bloco${blocks.length !== 1 ? 's' : ''} configurado${blocks.length !== 1 ? 's' : ''}\n🕒 ${new Date().toLocaleTimeString()}`);
  };

  const handleLoadSavedProject = () => {
    try {
      const saved = localStorage.getItem('teste5-editor-project');
      if (saved) {
        const projectData = JSON.parse(saved);
        if (projectData.blocks) {
          blockActions.handleUpdateBlock('bulk-update', projectData.blocks);
          console.log('✅ Projeto teste5 carregado:', projectData);
          alert(`✅ Projeto carregado!\n\n📊 ${projectData.blocks.length} blocos restaurados\n🕒 Salvo em: ${new Date(projectData.timestamp).toLocaleString()}`);
        }
      } else {
        alert('❌ Nenhum projeto salvo encontrado.');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar projeto:', error);
      alert('❌ Erro ao carregar projeto salvo.');
    }
  };

  const handleExportProject = () => {
    const projectData = {
      blocks,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mode: 'teste5'
    };
    
    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `editor-teste5-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            <Home className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Editor Teste5</h1>
          <div className="text-sm text-gray-500">
            {blocks.length} bloco{blocks.length !== 1 ? 's' : ''}
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            🧪 MODO TESTE
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            ✅ Quiz Integrado
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSavedProject}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Carregar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportProject}
          >
            <Settings className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewing(!isPreviewing)}
          >
            {isPreviewing ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreviewing ? 'Editar' : 'Visualizar'}
          </Button>
          
          <Button onClick={handleSaveProject} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Salvar Teste5
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {!isPreviewing ? (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Sidebar */}
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="h-full bg-white border-r border-gray-200 flex flex-col">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'components' | 'quiz')} className="flex-1 flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 m-2">
                    <TabsTrigger value="components">
                      <Plus className="w-4 h-4 mr-2" />
                      Componentes
                    </TabsTrigger>
                    <TabsTrigger value="quiz">
                      <TestTube className="w-4 h-4 mr-2" />
                      Quiz
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="components" className="flex-1 overflow-hidden p-2">
                    <div className="h-full overflow-y-auto space-y-4">
                      {/* Seção Resultado - Etapa 20 */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700 px-2 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          📊 Resultado (Etapa 20)
                        </h3>
                        <div className="grid gap-2">
                          {resultComponents.map((component) => (
                            <Button
                              key={component.type}
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto p-3 text-left"
                              onClick={() => handleAddComponent(component.type)}
                            >
                              <div>
                                <div className="font-medium text-sm">{component.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {component.description}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Seção Ofertas - Etapa 21 */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700 px-2 flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          💰 Ofertas (Etapa 21)
                        </h3>
                        <div className="grid gap-2">
                          {offerComponents.map((component) => (
                            <Button
                              key={component.type}
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto p-3 text-left"
                              onClick={() => handleAddComponent(component.type)}
                            >
                              <div>
                                <div className="font-medium text-sm">{component.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {component.description}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Seção Inline */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700 px-2 flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          ⚡ Componentes Inline
                        </h3>
                        <div className="grid gap-2">
                          {inlineComponents.map((component) => (
                            <Button
                              key={component.type}
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto p-3 text-left"
                              onClick={() => handleAddComponent(component.type)}
                            >
                              <div>
                                <div className="font-medium text-sm">{component.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {component.description}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Seção Interação */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700 px-2 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          🔘 Interação
                        </h3>
                        <div className="grid gap-2">
                          {interactionComponents.map((component) => (
                            <Button
                              key={component.type}
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto p-3 text-left"
                              onClick={() => handleAddComponent(component.type)}
                            >
                              <div>
                                <div className="font-medium text-sm">{component.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {component.description}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quiz" className="flex-1 overflow-hidden p-2">
                    <QuizEditorPanel 
                      blocks={blocks}
                      onBlocksChange={(blocks: any[]) => console.log('Blocks updated:', blocks)}
                      testMode="teste5"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Main Editor Area */}
            <ResizablePanel defaultSize={75}>
              <div className="h-full bg-gray-100 overflow-auto">
                <div className="p-4">
                  {/* Header do modo teste */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      🧪 Editor Teste5 - Ambiente de Testes
                    </h2>
                    <p className="text-blue-700 text-sm">
                      Este é um ambiente de testes para validar componentes e funcionalidades do editor. 
                      Todos os dados são salvos localmente para testes.
                    </p>
                  </div>

                  <EditorPreview
                    blocks={blocks}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={setSelectedBlockId}
                    onReorderBlocks={blockActions.handleReorderBlocks}
                    primaryStyle={mockStyleResult}
                    onSaveInline={handleSaveInline}
                    isPreviewing={false}
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          // Preview Mode
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-4">
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-2 text-center">
                  🔍 Preview - Editor Teste5
                </h2>
                <p className="text-gray-600 text-center">
                  Visualização final dos componentes configurados
                </p>
              </div>
              
              <EditorPreview
                blocks={blocks}
                selectedBlockId={null}
                onSelectBlock={() => {}}
                onReorderBlocks={() => {}}
                primaryStyle={mockStyleResult}
                onSaveInline={() => {}}
                isPreviewing={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer de informações */}
      <div className="h-10 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-6 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>🧪 Modo: TESTE5</span>
          <span>📊 Blocos: {blocks.length}</span>
          <span>🕒 {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Editor Unificado v1.0.0</span>
          <Link to="/editor" className="text-blue-600 hover:text-blue-800">
            Editor Principal
          </Link>
        </div>
      </div>
    </div>
  );
}
